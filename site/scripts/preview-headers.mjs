// Только для превью на Cloudflare Pages: X-Robots-Tag на всё. В сборку для Yandex Cloud не попадает.
import fs from 'node:fs';
fs.writeFileSync(new URL('../dist/_headers', import.meta.url), '/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log('dist/_headers записан');
