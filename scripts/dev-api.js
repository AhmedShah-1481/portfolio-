import { createServer as createHTTPServer } from 'node:http';
import { createServer as createViteServer, loadEnv } from 'vite';
import handler from '../api/ask.js';

const localOnly = process.argv.includes('--local-only');
const environment = loadEnv('development', process.cwd(), '');
for (const name of ['GEMINI_API_KEY', 'GEMINI_MODEL']) {
  if (!process.env[name] && environment[name]) process.env[name] = environment[name];
}
if (localOnly) {
  process.env.GEMINI_API_KEY = '';
  process.env.GEMINI_MODEL = '';
}
let vite;
const server = createHTTPServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  if (pathname === '/api/ask') {
    try { await handler(req, res); } catch {
      if (!res.headersSent) { res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); }
      if (!res.writableEnded) res.end(JSON.stringify({ error: 'AI service is temporarily unavailable.' }));
    }
  } else vite.middlewares(req, res);
});
vite = await createViteServer({ server: { middlewareMode: true, hmr: { server } }, appType: 'spa' });
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? 'Port 5173 is already in use. Stop the other dev server first.' : 'The dev server could not start.');
  process.exitCode = 1;
  vite.close();
});
server.listen(5173, '127.0.0.1', () => {
  console.log('Portfolio + /api/ask: http://127.0.0.1:5173/');
  if (localOnly) console.log('Local fallback mode: Gemini is disabled for this process.');
});
const close = async () => { await vite.close(); server.close(() => process.exit(0)); };
process.on('SIGINT', close);
process.on('SIGTERM', close);
