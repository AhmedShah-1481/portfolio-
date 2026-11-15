import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { profile } from '../src/data/profile.js';

const pdf = fileURLToPath(new URL('../public/resume.pdf', import.meta.url));
const pathname = profile.assets.resume.downloadPayload;
const payload = () => JSON.stringify({ type: 'application/pdf', data: readFileSync(pdf).toString('base64') });

// A generated transport for the existing public PDF. Some native download
// managers intercept even fetch/XHR responses with a PDF content type.
export default function resumeDownload() {
  return {
    name: 'resume-download',
    generateBundle() { this.emitFile({ type: 'asset', fileName: pathname.slice(1), source: payload() }); },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== pathname || !['GET', 'HEAD'].includes(req.method)) return next();
        try {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(req.method === 'HEAD' ? undefined : payload());
        } catch { res.statusCode = 404; res.end(); }
      });
    },
  };
}
