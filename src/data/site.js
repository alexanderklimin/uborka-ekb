// Единый конфиг компании.
//
// demo(настоящее, временное): пока настоящего значения нет (null), в ПРЕВЬЮ показывается временное
// (цены — по конкурентам из research/competitors.md, контакты и реквизиты — нули/образцы).
// В production временные значения не подставляются никогда: null → заглушка ⚑ → `npm run build:production` падает.
// Как только заказчик дал данные — пишем их первым аргументом.

export const SITE_MODE = process.env.SITE_MODE === 'production' ? 'production' : 'preview';
export const PREVIEW = SITE_MODE !== 'production';
export const demo = (real, temporary) => real ?? (PREVIEW ? temporary : null);

export const BRAND = {
  // Решение заказчика 2026-11-25: «Прибрали», домен pribrali.ru (ещё не куплен).
  name: 'Прибрали',
  tagline: 'уборка квартир и офисов в Екатеринбурге',
};
export const BRAND_NAME = BRAND.name ?? 'Название';

export const CONTACTS = {
  phone: demo(null, '+7 (343) 000-00-00'),
  phoneE164: demo(null, '+73430000000'),
  email: demo(null, 'info@pribrali.ru'),        // почта для клиентов
  telegram: demo(null, 'https://t.me/'),
  whatsapp: demo(null, 'https://wa.me/'),
  max: demo(null, 'https://max.ru/'),
  hours: demo(null, 'ежедневно 8:00–22:00'),
  address: demo(null, 'работаем на выезде по Екатеринбургу'),
  geo: null,                                   // { lat, lon } офиса, если он есть
};

// ИП на УСН (ответ заказчика 2026-11-25).
export const LEGAL = {
  form: 'ИП',
  fullName: demo(null, 'ИП Фамилия Имя Отчество'),
  inn: demo(null, '000000000000'),
  ogrnip: demo(null, '000000000000000'),
  address: demo(null, 'г. Екатеринбург'),
  tax: 'УСН, без НДС',
  rknNumber: demo(null, 'будет после подачи уведомления'),
};

export const AREA = {
  city: 'Екатеринбург',
  suburbs: demo(null, ['Верхняя Пышма', 'Берёзовский', 'Арамиль', 'Среднеуральск', 'Сысерть', 'Кольцово', 'Большой Исток', 'Растущий']),
  suburbFee: demo(null, 'от 500 ₽, точнее — по расстоянию'),
  minOrder: demo(null, 4000),                  // как у «Трёх Сестёр»
};

export const INTEGRATIONS = {
  metrikaId: process.env.PUBLIC_METRIKA_ID || null,
  leadEndpoint: process.env.PUBLIC_LEAD_ENDPOINT || null,
  smartCaptchaKey: process.env.PUBLIC_SMARTCAPTCHA_KEY || null,
};

export const SITE_URL = process.env.SITE_URL || 'https://pribrali.ru';
export const UPDATED = '2026-11-25';
