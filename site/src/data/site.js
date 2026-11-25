// Единый конфиг компании. Всё, что должен дать заказчик, стоит как null.
// null на странице выводится жёлтой заглушкой (компонент Todo),
// а `npm run build:production` падает, пока в dist остаётся хоть одна заглушка.

export const BRAND = {
  // Название ещё не выбрано: «Лоск» (losk96.ru) / «Прибрали» (pribrali.ru) / «Отмыли» (otmyli.ru).
  // Меняется только здесь.
  name: null,
  tagline: 'уборка квартир и офисов в Екатеринбурге',
};

export const BRAND_NAME = BRAND.name ?? 'Название';

export const CONTACTS = {
  phone: null,          // '+7 (343) 000-00-00' — как показываем
  phoneE164: null,      // '+73430000000' — для tel:
  email: null,          // почта для клиентов (может совпадать с почтой для заявок)
  telegram: null,       // 'https://t.me/...'
  whatsapp: null,       // 'https://wa.me/7...'
  max: null,            // ссылка на MAX
  hours: null,          // 'ежедневно 8:00–21:00'
  address: null,        // адрес офиса или «выезд по городу, без офиса»
  geo: null,            // { lat: 56.8389, lon: 60.6057 } для карты и schema.org
};

// ИП на УСН (ответ заказчика 2026-11-25).
export const LEGAL = {
  form: 'ИП',
  fullName: null,       // 'Индивидуальный предприниматель Иванов Иван Иванович'
  inn: null,
  ogrnip: null,
  address: null,        // адрес регистрации ИП (можно без квартиры — уточнить с юристом)
  tax: 'УСН, без НДС',
  rknNumber: null,      // номер в реестре операторов ПДн Роскомнадзора
};

// Зона выезда. Пригороды и доплата — от заказчика.
export const AREA = {
  city: 'Екатеринбург',
  suburbs: null,        // ['Верхняя Пышма', 'Берёзовский', ...]
  suburbFee: null,      // 'от 500 ₽' или правило
  minOrder: null,       // минимальный заказ, ₽
};

// Интеграции. Ключи и ID не секретные, но всё равно задаются через окружение.
export const INTEGRATIONS = {
  metrikaId: process.env.PUBLIC_METRIKA_ID || null,
  leadEndpoint: process.env.PUBLIC_LEAD_ENDPOINT || null,       // HTTP-триггер Cloud Function
  smartCaptchaKey: process.env.PUBLIC_SMARTCAPTCHA_KEY || null, // клиентский ключ SmartCaptcha
};

export const SITE_MODE = process.env.SITE_MODE === 'production' ? 'production' : 'preview';
export const SITE_URL = process.env.SITE_URL || 'https://example.ru';
export const UPDATED = '2026-11-25';
