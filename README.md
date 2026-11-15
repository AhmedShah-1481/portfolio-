# Ahmed's portfolio

A responsive React/Vite portfolio in plain JavaScript, with Tailwind CSS, Framer Motion, GSAP, and Lenis. Static hosting supports every section and local AI answers; Gemini and form delivery are optional.

## Run, build, and preview

Use Node.js 22.12+:

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. On Windows PowerShell, use `npm.cmd` when script policy blocks `npm.ps1`.

```sh
npm run build
npm run preview
```

The build writes deployable files to `dist/`. Preview opens at `http://127.0.0.1:4173/`. Stop the previous server with Ctrl+C before reusing its port. Static preview supports local chat fallback but does not run the Vercel function.

## Edit content

Edit `src/data/profile.js`. It contains identity, summary, education, skill groups, all seven projects, certifications, contact links, image paths, resume settings, and UI copy. Counts derive from the records. Skills connect to projects through exact matches in each project's `technologies` array.

Keep factual changes consistent with `assets/resume.md`. Preserve `date.precision: 'year'` and `month: null` when a certification's month is not supplied. The two year-only participation records must not acquire invented months or awards.

For each project's `missingProjectAssets(...)` options, supply:

- `githubHref`: the actual repository URL.
- `demoHref`: the actual live demo URL.
- `screenshotSrc`: a real screenshot placed in `public/`, referenced as `/images/...`.
- `screenshotAlt`: a description of that screenshot.

Missing values remain visible coming-soon states. Optimize screenshots as WebP. The portrait uses 320, 512, and 768-pixel WebP variants with a JPG fallback. Image paths, dimensions, and alt text are in the profile data.

The resume file is `public/resume.pdf`. Every button retains `/resume.pdf` and download filename `Syed-Muhammed-Ahmed-Bin-Haider-Resume.pdf`. The shared `ResumeLink` retrieves a generated JSON transport containing the exact PDF bytes and saves a local blob, avoiding native download-manager interception. `scripts/resume.js` generates that payload at build time and serves it in development. Replace the PDF and rebuild to update both copies.

## Contact form setup

Create a Formspree form (or a compatible endpoint accepting JSON POST). Add its public URL as `VITE_CONTACT_FORM_ENDPOINT` in `.env.local`. Create that file from `.env.example` only if it does not already exist; preserve existing settings. Restart the dev server after editing it.

The form sends `name`, `email`, and `message`. It validates input, prevents duplicate sends, and reports success, failure, or timeout. Until configured, delivery is disabled and direct contact links remain available. For a service with a different payload or authentication contract, adapt `src/hooks/useContactForm.js`. Never expose private credentials through `VITE_` settings.

For hosted builds, set this variable in the project's environment settings and rebuild. All `VITE_` values are public and embedded during the build.

## SEO and production URL

Set `VITE_SITE_URL` to the public production origin, including `https://` and without a path or query. The build also recognizes Vercel's `VERCEL_PROJECT_PRODUCTION_URL` and Netlify's `URL` when an explicit origin is absent. Override it with your canonical custom domain when needed.

`scripts/seo.js` generates the initial HTML title, description, Open Graph/Twitter metadata, Person structured data, `robots.txt`, and `sitemap.xml` from the profile. Social previews use the actual portrait JPG. With no production origin, canonical/og:url are omitted, image paths remain relative, and the sitemap contains no fabricated URL. Configure the origin and rebuild before sharing or indexing the production site.

## Deploy to Vercel

1. Import the project using the Vite framework preset.
2. Use build command `npm run build` and output directory `dist`.
3. Set `VITE_SITE_URL` and, for form delivery, `VITE_CONTACT_FORM_ENDPOINT` in Project Settings → Environment Variables.
4. For Gemini, add the server-only variables described below.
5. Deploy or redeploy after changing environment variables. Vercel runs `api/ask.js` at `/api/ask`.

## Deploy to Netlify

Import the project with build command `npm run build`, publish directory `dist`, and Node.js 22.12+. Set `VITE_SITE_URL` and `VITE_CONTACT_FORM_ENDPOINT` under the site's environment variables, then deploy. Alternatively, upload a locally built `dist/` folder for a static deployment.

Netlify static hosting supports local chat retrieval, contact delivery, and all portfolio sections. It does not automatically run the Vercel `api/ask.js` handler as a Netlify Function. For Gemini there, adapt the handler to Netlify Functions and route `/api/ask` to it, or deploy this project on Vercel. Never expose Gemini keys in frontend settings.

## Ask My AI setup

The chat first calls `/api/ask`, then silently uses local retrieval if the function is absent, unconfigured, unavailable, slow, rate limited, or returns invalid data. Answers show **Local answer** or **AI-assisted answer** with source chips. Unknown facts lead visitors to Contact. Local answers require no key.

### Configure Gemini

1. Open [Google AI Studio](https://aistudio.google.com/apikey), sign in, and create an API key.
2. Add `GEMINI_API_KEY` and `GEMINI_MODEL` to private `.env.local`, preserving other values. Use an available text-generation model ID from AI Studio. Both settings are required; neither has a hardcoded default.
3. Restart the dev server. Never prefix these settings with `VITE_`, put a key in `src/` or `public/`, or commit an environment file.

### Test the function locally

```sh
npm run dev:api
```

This Node/Vite adapter serves the portfolio and the same `api/ask.js` handler at `http://127.0.0.1:5173/`. A successful provider response shows **AI-assisted answer**. To disable Gemini for that process and verify fallback without changing `.env.local`, use `npm run dev:local`. Ordinary `npm run dev` serves only the frontend and also supports local answers.

The API accepts only POST JSON `{ "question": "What is his CGPA?" }`, limited to 300 characters. Responses contain `{ answer, sources }`. It uses the same factual profile data, instructs Gemini to ignore visitor attempts to change its rules, preserves date precision, limits output, and applies a 10-request-per-minute in-memory IP limit per server instance. Errors never expose keys or stack traces.

On Vercel, add `GEMINI_API_KEY` and `GEMINI_MODEL` to the desired production/preview environments, store the key as a sensitive setting, and redeploy.

## Quality checks

Audit production preview rather than development mode. Check phone, tablet, laptop, and wide-screen layouts; project filters/modals; exact skill connections; keyboard and dialog focus restoration; reduced motion; local chat and unknown answers; and every resume button. Do not submit contact tests unless you intend to deliver them.

The hero canvas is capped at 30fps and 1.5 DPR, pauses off-screen and in background tabs, and has a static fallback on touch/low-power devices. Chat and dialogs load on demand, the browser defers below-fold rendering, fonts are local WOFF2 files, and portraits have responsive sources. Lighthouse targets are Performance 90+, Accessibility 95+, and SEO 95+; scores vary with hardware and hosting. Recheck the final production domain.

## Remaining placeholders

All seven projects need repository URLs, live demos, and screenshots with descriptive alt text: LearnLoop, Autonomous AI Sales Agent, Bazario Mart, FirstRound, AdFlow Pro, ISP Customer Management System, and Sweet Bites. Configure the contact form endpoint and production origin. Gemini settings are optional. LinkedIn, personal GitHub profile, portrait, and resume are already supplied.
