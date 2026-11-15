import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import portfolioSEO, { siteOrigin } from './scripts/seo.js';
import resumeDownload from './scripts/resume.js';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), portfolioSEO(siteOrigin(loadEnv(mode, process.cwd(), 'VITE_SITE_URL'))), resumeDownload()],
  server: { watch: { ignored: ['**/.tmp/**'] } },
}));
