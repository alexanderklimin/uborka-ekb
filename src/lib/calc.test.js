import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from './calc.js';

const gen = { slug: 'generalnaya-uborka', short: 'Генеральная', price: { rooms: { 1: 6000, 2: 8000, 3: null }, perM2: 150 } };
const windowsSvc = { slug: 'myte-okon', short: 'Окна', price: { unit: { price: 700 } } };

test('фиксированная цена за комнаты', () => {
  assert.equal(calculate({ service: gen, rooms: 2, area: 50 }).total, 8000);
});
test('нет цены за 3 комнаты — считаем по м²', () => {
  assert.equal(calculate({ service: gen, rooms: 3, area: 70 }).total, 10500);
});
test('4+ комнат без площади — просим площадь', () => {
  assert.deepEqual(calculate({ service: gen, rooms: 4, area: 0 }).missing, ['площадь']);
});
test('окна плюсом и минимальный заказ', () => {
  const r = calculate({ service: gen, rooms: 1, area: 30, windows: 2, windowPrice: 700, minOrder: 9000 });
  assert.equal(r.total, 9000);
  assert.equal(r.lines.at(-1).sum, 1600);
});
test('только окна', () => {
  assert.equal(calculate({ service: windowsSvc, rooms: 1, area: 0, windows: 3 }).total, 2100);
});
test('цен нет — total null и понятно чего не хватает', () => {
  const r = calculate({ service: { slug: 'x', short: 'X', price: { rooms: { 1: null } } }, rooms: 1, area: 30, windows: 1 });
  assert.equal(r.total, null);
  assert.deepEqual(r.missing, ['цена услуги «X»', 'цена за окно']);
});
