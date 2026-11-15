import { profile } from '../src/data/profile.js';

const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function siteOrigin(environment) {
  const configured = environment.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.URL;
  if (!configured) return '';
  const url = new URL(configured.includes('://') ? configured : `https://${configured}`);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_SITE_URL must be the public site origin, without a path, query, or credentials.');
  }
  return url.origin;
}

export default function portfolioSEO(origin) {
  const title = `${profile.identity.name} | ${profile.site.title}`;
  const description = profile.site.seo.description;
  const image = origin ? new URL(profile.assets.portrait.jpg, origin).href : profile.assets.portrait.jpg;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Person', name: profile.identity.name,
    description: profile.identity.summary, image, email: profile.contact.email,
    sameAs: [profile.contact.linkedinHref, profile.contact.githubHref],
    homeLocation: { '@type': 'Place', name: profile.contact.location },
    affiliation: { '@type': 'CollegeOrUniversity', name: profile.education.university },
    knowsAbout: [...new Set(profile.skills.flatMap(({ items }) => items))],
    ...(origin ? { url: `${origin}/` } : {}),
  };
  const robots = `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${origin ? `  <url><loc>${escape(origin)}/</loc></url>\n` : '  <!-- Set VITE_SITE_URL before deployment to populate the production URL. -->\n'}</urlset>\n`;
  return {
    name: 'portfolio-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const meta = (name, content, property = false) => ({ tag: 'meta', attrs: { [property ? 'property' : 'name']: name, content }, injectTo: 'head' });
        return { html: html.replace('<title>Portfolio</title>', `<title>${escape(title)}</title>`), tags: [
          meta('description', description),
          meta('og:type', 'website', true), meta('og:title', title, true), meta('og:description', description, true),
          meta('og:image', image, true), meta('og:image:alt', profile.assets.portrait.alt, true),
          meta('og:image:width', String(profile.assets.portrait.width), true), meta('og:image:height', String(profile.assets.portrait.height), true),
          meta('twitter:card', 'summary_large_image'), meta('twitter:title', title), meta('twitter:description', description),
          meta('twitter:image', image), meta('twitter:image:alt', profile.assets.portrait.alt),
          ...(origin ? [meta('og:url', `${origin}/`, true), { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' }] : []),
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(schema).replaceAll('<', '\\u003c'), injectTo: 'head' },
        ] };
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/robots.txt' && req.url !== '/sitemap.xml') return next();
        res.setHeader('Content-Type', req.url === '/robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8');
        res.end(req.url === '/robots.txt' ? robots : sitemap);
      });
    },
  };
}
