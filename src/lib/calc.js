// Расчёт стоимости для калькулятора. Чистая функция, тесты в calc.test.js.
// Возвращает { total, lines, missing }: missing — каких цен не хватает (тогда total = null).
//
// Правила (согласовать с заказчиком):
//  - если у услуги есть фиксированная цена за 1–3 комнаты и комнат ≤ 3 — берём её;
//  - иначе цена за м² × площадь;
//  - окна прибавляются по цене за окно из услуги «Мытьё окон»;
//  - итог не меньше минимального заказа.

export function calculate({ service, rooms, area, windows = 0, windowPrice = null, minOrder = null }) {
  const lines = [];
  const missing = [];
  const p = service?.price ?? {};
  let base = null;

  if (service?.slug === 'myte-okon') {
    if (typeof p.unit?.price === 'number') base = 0; else missing.push('цена за окно');
  } else if (rooms >= 1 && rooms <= 3 && typeof p.rooms?.[rooms] === 'number') {
    base = p.rooms[rooms];
    lines.push({ label: `${service.short}, ${rooms}-комнатная`, sum: base });
  } else if (typeof p.perM2 === 'number' && area > 0) {
    base = Math.round(p.perM2 * area);
    lines.push({ label: `${service.short}, ${area} м² × ${p.perM2} ₽`, sum: base });
  } else if (!(area > 0) && typeof p.perM2 === 'number') {
    missing.push('площадь');
  } else {
    missing.push(`цена услуги «${service?.short ?? '?'}»`);
  }

  const wp = service?.slug === 'myte-okon' ? p.unit?.price : windowPrice;
  if (windows > 0) {
    if (typeof wp === 'number') lines.push({ label: `Мытьё окон, ${windows} шт. × ${wp} ₽`, sum: windows * wp });
    else if (!missing.includes('цена за окно')) missing.push('цена за окно');
  }

  if (missing.length) return { total: null, lines, missing };
  let total = lines.reduce((s, l) => s + l.sum, 0);
  if (typeof minOrder === 'number' && total < minOrder) {
    lines.push({ label: 'Доплата до минимального заказа', sum: minOrder - total });
    total = minOrder;
  }
  return { total, lines, missing };
}
