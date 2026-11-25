// Yandex Cloud Function (Node.js 22), HTTP-триггер. Заявка с сайта → письмо на почту.
// Переменные окружения (задаются в функции, значения — в /opt/uborka-ekb/.env, не в коде):
//   ALLOWED_ORIGIN          https://<домен> (через запятую можно несколько)
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   — Яндекс 360 / Postbox SMTP
//   MAIL_FROM, MAIL_TO      — от кого и куда слать заявки
//   SMARTCAPTCHA_SECRET     — серверный ключ SmartCaptcha (если не задан, капча не проверяется)
import nodemailer from 'nodemailer';
import { parseLead, formatEmail } from './lead.js';

const origins = (process.env.ALLOWED_ORIGIN ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 465), secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const reply = (statusCode, origin, body = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' },
  body: JSON.stringify(body),
});

async function captchaOk(token, ip) {
  if (!process.env.SMARTCAPTCHA_SECRET) return true;
  if (!token) return false;
  const res = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: process.env.SMARTCAPTCHA_SECRET, token, ip: ip ?? '' }),
  });
  return res.ok && (await res.json()).status === 'ok';
}

export async function handler(event) {
  const origin = event.headers?.Origin ?? event.headers?.origin ?? '';
  const allowed = origins.includes(origin) ? origin : (origins[0] ?? '');
  if (event.httpMethod === 'OPTIONS') return reply(204, allowed);
  if (event.httpMethod !== 'POST') return reply(405, allowed, { error: 'method' });
  if (!origins.includes(origin)) return reply(403, allowed, { error: 'origin' });

  let body;
  try { body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body); } catch { return reply(400, allowed, { error: 'bad json' }); }

  const parsed = parseLead(body);
  if (!parsed.ok) return reply(parsed.status, allowed, parsed.spam ? { ok: true } : { error: parsed.error });
  if (!(await captchaOk(body.captcha, event.requestContext?.identity?.sourceIp))) return reply(400, allowed, { error: 'captcha' });

  const mail = formatEmail(parsed.lead);
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM, to: process.env.MAIL_TO, subject: mail.subject, text: mail.text });
  } catch (e) {
    console.error('mail failed', e.code ?? e.message); // без данных заявки в логах
    return reply(502, allowed, { error: 'mail' });
  }
  return reply(200, allowed, { ok: true });
}
