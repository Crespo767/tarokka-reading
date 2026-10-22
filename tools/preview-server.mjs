import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const types = { '.html':'text/html', '.mjs':'text/javascript', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.json':'application/json', '.hbs':'text/plain' };
http.createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/') path = '/preview/index.html';
    path = path.replace(/^\/modules\/tarokka-reading\//, '/tarokka-reading/');
    const file = resolve(root, '.' + path);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': (types[extname(file)] || 'application/octet-stream') + (['.html','.mjs','.js','.css','.hbs','.json'].includes(extname(file)) ? '; charset=utf-8' : ''), 'Cache-Control':'no-cache' });
    res.end(body);
  } catch { res.writeHead(404).end('Arquivo não encontrado'); }
}).listen(4173, '127.0.0.1', () => console.log('Prévia Tarokka: http://127.0.0.1:4173'));
