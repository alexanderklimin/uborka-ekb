// Блокирует боевую сборку, пока в dist есть заглушки (data-todo) или превью-признаки.
import fs from 'node:fs';
import path from 'node:path';
const dist = new URL('../dist/', import.meta.url).pathname;
const found = new Map();
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      const rel = path.relative(dist, p);
      const labels = [...html.matchAll(/data-todo="([^"]*)"/g)].map((m) => m[1]);
      if (/<meta name="robots" content="noindex/.test(html) && !rel.includes('404')) labels.push('режим превью (noindex)');
      if (labels.length) found.set(path.relative(dist, p), [...new Set(labels)]);
    }
  }
};
walk(dist);
if (found.size) {
  const total = [...found.values()].reduce((n, l) => n + l.length, 0);
  console.error(`Заглушек осталось: ${total} на ${found.size} страницах:`);
  for (const [file, labels] of found) console.error(`  ${file}: ${labels.join('; ')}`);
  process.exit(process.argv.includes('--report') ? 0 : 1);
}
console.log('Заглушек нет.');
