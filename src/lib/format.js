// Форматирование без зависимостей. Тесты: format.test.js.

// 12500 → «12 500 ₽» (неразрывные пробелы, чтобы цена не переносилась).
export function rub(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return `${Math.round(value).toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`;
}

// «+7 (343) 000-00-00» → «+73430000000» для tel:.
export function telHref(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  const normalized = digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
  return normalized.length === 11 ? `tel:+${normalized}` : null;
}

// Окончание по числу: plural(2, ['комната','комнаты','комнат']).
export function plural(n, [one, few, many]) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
