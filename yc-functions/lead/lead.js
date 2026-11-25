// Проверка и оформление заявки. Без сети — тестируется в lead.test.js.

const SERVICES = {
  'uborka-kvartir': 'Уборка квартир', 'generalnaya-uborka': 'Генеральная уборка',
  'podderzhivayushchaya-uborka': 'Поддерживающая уборка', 'uborka-posle-remonta': 'Уборка после ремонта',
  'myte-okon': 'Мытьё окон', 'uborka-ofisov': 'Уборка офисов', 'uborka-kottedzhey': 'Уборка коттеджей',
  'uborka-dlya-arendodateley': 'Посуточные квартиры',
};
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Возвращает { ok: true, lead } или { ok: false, status, error }. spam: true — тихо отвечаем 200, письмо не шлём.
export function parseLead(body) {
  if (!body || typeof body !== 'object') return { ok: false, status: 400, error: 'bad json' };
  if (str(body.website, 200)) return { ok: false, status: 200, spam: true, error: 'honeypot' };
  const digits = str(body.phone, 30).replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 12) return { ok: false, status: 400, error: 'phone' };
  if (body.consent !== true) return { ok: false, status: 400, error: 'consent' };
  const attribution = {};
  if (body.attribution && typeof body.attribution === 'object') {
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid']) {
      if (body.attribution[k]) attribution[k] = str(String(body.attribution[k]), 200);
    }
  }
  return {
    ok: true,
    lead: {
      name: str(body.name, 80),
      phone: str(body.phone, 30),
      service: SERVICES[body.service] ?? '',
      area: str(String(body.area ?? ''), 10).replace(/[^\d.,]/g, ''),
      date: /^\d{4}-\d{2}-\d{2}$/.test(body.date ?? '') ? body.date : '',
      comment: str(body.comment, 1000),
      page: str(body.page, 300),
      ym_client_id: str(String(body.ym_client_id ?? ''), 40).replace(/\D/g, ''),
      attribution,
    },
  };
}

export function formatEmail(lead, receivedAt = new Date()) {
  const rows = [
    ['Имя', lead.name], ['Телефон', lead.phone], ['Услуга', lead.service], ['Площадь, м²', lead.area],
    ['Дата', lead.date], ['Комментарий', lead.comment], ['Страница', lead.page],
    ...Object.entries(lead.attribution).map(([k, v]) => [k, v]),
    ['Метрика ClientID', lead.ym_client_id],
    ['Согласие на ПДн', 'да, отмечено в форме'],
    ['Получено', receivedAt.toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' }) + ' (Екб)'],
  ].filter(([, v]) => v);
  return {
    subject: `Заявка: ${lead.service || 'уборка'} — ${lead.phone}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
  };
}
