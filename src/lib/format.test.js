import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rub, telHref, plural } from './format.js';
import { priceFrom } from '../data/services.js';
import { faqPage, localBusiness } from './seo.js';

test('rub', () => {
  assert.equal(rub(12500), '12 500 ₽');
  assert.equal(rub(null), null);
});
test('telHref', () => {
  assert.equal(telHref('+7 (343) 123-45-67'), 'tel:+73431234567');
  assert.equal(telHref('8 912 123 45 67'), 'tel:+79121234567');
  assert.equal(telHref('123'), null);
  assert.equal(telHref(null), null);
});
test('plural', () => {
  assert.equal(plural(1, ['окно', 'окна', 'окон']), 'окно');
  assert.equal(plural(3, ['окно', 'окна', 'окон']), 'окна');
  assert.equal(plural(11, ['окно', 'окна', 'окон']), 'окон');
  assert.equal(plural(22, ['окно', 'окна', 'окон']), 'окна');
});
test('priceFrom: за квартиру важнее, чем за м²', () => {
  assert.equal(priceFrom({ price: { rooms: { 1: null } } }), null);
  assert.deepEqual(priceFrom({ price: { rooms: { 1: 4000, 2: 5000 }, perM2: 90 } }), { value: 4000, suffix: '' });
  assert.deepEqual(priceFrom({ price: { perM2: 150 } }), { value: 150, suffix: ' за м²' });
  assert.deepEqual(priceFrom({ price: { unit: { price: 500, label: 'за окно' } } }), { value: 500, suffix: ' за окно' });
});
test('faqPage: только вопросы с ответом', () => {
  assert.equal(faqPage([{ q: 'a', a: null }]), null);
  assert.equal(faqPage([{ q: 'a', a: 'b' }, { q: 'c', a: null }]).mainEntity.length, 1);
});
test('localBusiness без пустых полей', () => {
  const lb = localBusiness({ site: 'https://x.ru', brand: 'X', contacts: { phoneE164: null }, legal: { inn: null }, area: { city: 'Екатеринбург' } });
  assert.ok(!('telephone' in lb));
  assert.ok(!('taxID' in lb));
  assert.ok(!('sameAs' in lb));
});
