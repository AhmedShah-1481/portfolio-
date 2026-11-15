# Portfolio Build Prompt (for Cline)

You are a senior creative front-end engineer and designer. Build me an exceptional, award-level interactive portfolio website for myself. It should look like it was made by a top design studio, not a template.

## 1. Source material (read first)

- `assets/resume.md` is the ONLY source of truth for my content. It contains my contact details, summary, education, skills, 7 projects, and certifications.
- `assets/photo.jfif` is my profile photo (a circular-cropped headshot on a light gray background). Convert it to optimized `.webp` and `.jpg` (`.jfif` is poorly supported in browsers), keep the circular style, and use it in the hero and about sections. Add proper alt text.
- `assets/resume.pdf` is my CV, used for the "Download Resume" button. Copy it to `public/`.

My links (fill these in before running, or leave the TODO placeholders):
- LinkedIn: www.linkedin.com/in/ahmed-shah-1481alpha
- GitHub: https://github.com/AhmedShah-1481
- Live demos: none yet, so show "Demo coming soon" states with placeholder links.

## 2. Hard rules about facts

- Do NOT invent employers, metrics, users, awards, links, dates, or project details. Use only what is in `resume.md`.
- Anything missing (GitHub links, live demos, screenshots, LinkedIn URL) must be a clearly marked TODO placeholder in the data file that I can fill in later.
- Keep ALL content in one editable data file (`src/data/profile.js` or `.ts`). Components must read from it. Derive counts (projects, certifications) from the data instead of hardcoding them.
- Project architecture diagrams may illustrate how the described system works (retriever, LLM, tools, memory) using only the technologies listed for that project. Label them as simplified diagrams.

## 3. Positioning

I am a BS Computer Science student (COMSATS, CGPA 3.75) focused on AI and Generative AI: agentic workflows, RAG, LangChain, LangGraph, FastAPI, plus full-stack (MERN, React). Recruiters and AI startups should think "this person builds real agentic systems," and the site itself should demonstrate that skill.

## 4. Tech stack

- React + Vite + Tailwind CSS
- Framer Motion for UI and page animation
- GSAP + ScrollTrigger for scroll storytelling
- React Three Fiber / Three.js (or a lightweight canvas alternative) for ONE hero visual
- Lenis for smooth scrolling
- Must deploy as a static site on Vercel or Netlify with no backend required

## 5. Sections and experience

1. **Hero**: animated name reveal, rotating role line (AI Engineer, Agentic Systems Builder, Full-Stack Developer), my photo, a magnetic CTA button, and an interactive background: a particle or neural-network field that reacts to the cursor and subtly forms an agent/node graph (a nod to LangGraph). Fall back to a static or light version on mobile and low-power devices.
2. **About**: a short, punchy story based on my summary, with animated counters using only real numbers from the data (CGPA 3.75, project count, certification count, semester).
3. **Skills**: an interactive skill map grouped by the categories in `resume.md`. Hovering or clicking a skill highlights the projects that use it, based on each project's tech list.
4. **Projects (the centerpiece)**: large interactive cards with tilt and spotlight hover effects, plus a detail modal for each. Include all 7 projects. Add filters: All / AI / Full-Stack / Frontend. For the AI projects (LearnLoop, Autonomous AI Sales Agent, Bazario Mart, FirstRound), add a small animated architecture diagram of the agent or RAG flow. Include GitHub and live demo link slots, with screenshot placeholders.
5. **Certifications and training timeline**: an animated vertical timeline of all entries in `resume.md`, in date order.
6. **Ask My AI (wow feature)**: a chat widget that answers questions about me, grounded ONLY in the data file, as a mini RAG demo. Build it with a local fallback (client-side retrieval over the profile data with templated answers and source chips showing which section was used). Put the chat logic behind a clean `askAI(question)` interface so I can later swap in a real backend (FastAPI or a serverless function calling an LLM). Never put API keys in frontend code. If a question is outside the data, the widget should say so honestly.
7. **Contact**: an animated form that is Formspree/EmailJS-ready (config in an env variable), plus email, phone, LinkedIn, GitHub, and a WhatsApp button. Add a "Download Resume" button.
8. **Footer and easter egg**: a command palette opened with Ctrl/Cmd+K to jump between sections, with a subtle hint in the footer.

## 6. Design direction

- Dark, premium, modern. One bold accent (electric violet to cyan gradient). Use glassmorphism sparingly.
- Distinctive typography: a strong display font, a clean sans for body, and a mono font for tech tags. Avoid generic template looks.
- Custom cursor with hover states (disabled on touch devices), a smooth page-load sequence, scroll progress indicator, and section transitions.
- Micro-interactions everywhere, but tasteful. Nothing should feel laggy or gimmicky.
- Light/dark toggle only if it does not compromise quality.

## 7. Quality requirements

- Mobile-first and fully responsive. Heavy effects degrade gracefully on mobile and low-power devices.
- Respect `prefers-reduced-motion`.
- Targets: Lighthouse Performance 90+, Accessibility 95+, SEO 95+. Lazy-load heavy assets and optimize images.
- Semantic HTML, keyboard navigation, visible focus states, alt text, sufficient color contrast, proper meta tags, and Open Graph tags.
- Clean structure: `src/components/`, `src/data/`, `src/hooks/`, `src/styles/`, `public/`.
- A `README.md` explaining how to edit content, run, build, and deploy.

## 8. How to work

**Plan mode first.** Read `assets/resume.md` and look at `assets/photo.jfif`. Then give me a short plan with: design concept, color palette, font choices, component structure, and animation ideas per section. Do NOT write code until I approve.

**After I approve, build one phase at a time and stop after each phase:**
1. Project setup, folder structure, and the data file populated from `resume.md`
2. Layout, navigation, and hero (including the interactive background)
3. Projects section (cards, filters, modals, architecture diagrams)
4. About, Skills, Certifications timeline, Contact, Footer, command palette
5. "Ask My AI" widget
6. Polish pass: performance, accessibility, responsiveness, SEO, README

**After each phase:** run the dev server, fix any errors, and tell me exactly what to check in the browser before continuing.

**At the end:** list every placeholder I still need to fill in (LinkedIn URL, GitHub links, live demo links, project screenshots, form endpoint).
