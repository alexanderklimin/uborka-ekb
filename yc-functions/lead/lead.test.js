import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLead, formatEmail } from './lead.js';
const base = { phone: '+7 (912) 123-45-67', consent: true };
test('валидная заявка', () => {
  const r = parseLead({ ...base, name: 'Анна', service: 'myte-okon', date: '2026-12-01', attribution: { utm_source: 'yandex', evil: 'x' } });
  assert.ok(r.ok);
  assert.equal(r.lead.service, 'Мытьё окон');
  assert.deepEqual(r.lead.attribution, { utm_source: 'yandex' });
});
test('без согласия — 400', () => assert.equal(parseLead({ ...base, consent: 'on' }).error, 'consent'));
test('плохой телефон — 400', () => assert.equal(parseLead({ ...base, phone: '123' }).error, 'phone'));
test('honeypot — тихий отказ', () => assert.equal(parseLead({ ...base, website: 'spam' }).spam, true));
test('дата не в формате отбрасывается', () => assert.equal(parseLead({ ...base, date: '<script>' }).lead.date, ''));
test('письмо', () => {
  const m = formatEmail(parseLead({ ...base, name: 'Анна' }).lead, new Date('2026-11-25T06:00:00Z'));
  assert.match(m.subject, /\+7 \(912\)/);
  assert.match(m.text, /Получено: 25\.11\.2026, 11:00:00 \(Екб\)/);
});
