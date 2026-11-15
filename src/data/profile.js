// Content source: assets/resume.md. Presentation copy follows portfolio-prompt.md.
// Edit factual content here; components and both AI answer paths read this file.
// null + a TODO message means an asset/link has not been supplied. Never use '#'.
// Fill the options on each project below to add its links and screenshot.
const missingProjectAssets = (title, {
  githubHref = null, demoHref = null, screenshotSrc = null, screenshotAlt = null,
} = {}) => ({
  github: {
    href: githubHref,
    todo: githubHref ? null : `TODO: Add the GitHub repository URL for ${title}.`,
  },
  demo: {
    href: demoHref,
    todo: demoHref ? null : `TODO: Add the live demo URL for ${title}.`,
  },
  screenshot: {
    src: screenshotSrc,
    alt: screenshotAlt,
    todo: screenshotSrc && screenshotAlt ? null : `TODO: Add a real screenshot and descriptive alt text for ${title}.`,
  },
});

export const profile = {
  identity: {
    name: 'Syed Muhammed Ahmed Bin Haider',
    displayNameLines: ['Syed Muhammed', 'Ahmed', 'Bin Haider'],
    summary:
      'BS Computer Science student with a strong interest in Artificial Intelligence and Generative AI. Hands-on experience building AI-powered applications, agentic workflows, retrieval-augmented generation (RAG) systems, and full-stack web applications. Familiar with LangChain, LangGraph, Python, FastAPI, and modern web technologies. Seeking an opportunity to contribute to practical, real-world AI projects.',
  },

  contact: {
    location: 'Vehari, Pakistan',
    phone: '03067771481',
    // Pakistan dialing code +92 replaces the local leading zero for links.
    phoneHref: 'tel:+923067771481',
    whatsappHref: 'https://wa.me/923067771481',
    email: 'ahmedshah1481@gmail.com',
    emailHref: 'mailto:ahmedshah1481@gmail.com',
    // Only whitespace and the missing https:// were normalized from the resume.
    linkedinHref: 'https://www.linkedin.com/in/ahmed-shah-1481alpha',
    githubHref: 'https://github.com/AhmedShah-1481',
    form: {
      endpointEnv: 'VITE_CONTACT_FORM_ENDPOINT',
    },
  },

  education: {
    degree: 'BS Computer Science',
    university: 'COMSATS University Islamabad',
    campus: 'Vehari Campus',
    semester: 7,
    cgpa: 3.75,
  },

  skills: [
    { category: 'Programming', items: ['Python', 'JavaScript'] },
    {
      category: 'AI & Generative AI',
      items: ['LLMs', 'Prompt Engineering', 'RAG', 'AI Agents'],
    },
    {
      category: 'AI Frameworks & Tools',
      items: ['LangChain', 'LangGraph', 'Chroma', 'LangSmith'],
    },
    { category: 'Backend', items: ['FastAPI', 'Node.js', 'Express.js'] },
    { category: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS'] },
    { category: 'Databases', items: ['MongoDB', 'Supabase'] },
    { category: 'Other', items: ['REST APIs', 'Git', 'API Integration'] },
  ],

  projects: [
    {
      id: 'learnloop',
      title: 'LearnLoop – Agentic Course Recommender',
      categories: ['AI'],
      technologies: ['Python', 'FastAPI', 'LangGraph', 'RAG', 'Chroma', 'LangSmith'],
      details: [
        'Developed an AI-powered course recommendation system using learner behavioral signals.',
        'Implemented retrieval-augmented generation to provide personalized course recommendations.',
        'Used LangSmith for workflow tracing and observability.',
      ],
      architecture: {
        summary: 'Learner behavioral signals feed a retrieval-based recommendation workflow. LangSmith provides tracing and observability.',
        flow: [
          { id: 'signals', label: 'Learner signals', technologies: [] },
          { id: 'retrieval', label: 'Retrieve context', technologies: ['RAG', 'Chroma'] },
          { id: 'workflow', label: 'Recommendation workflow', technologies: ['LangGraph'] },
          { id: 'recommendations', label: 'Course recommendations', technologies: [] },
        ],
        support: [{ label: 'Workflow tracing & observability', technologies: ['LangSmith'] }],
      },
      ...missingProjectAssets('LearnLoop', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
    {
      id: 'autonomous-ai-sales-agent',
      title: 'Autonomous AI Sales Agent',
      categories: ['AI'],
      technologies: ['Python', 'FastAPI', 'LangGraph', 'LangChain', 'RAG', 'Supabase'],
      details: [
        'Built an AI sales agent for lead discovery, qualification, and automated follow-ups.',
        'Implemented persistent memory and integrations with Gmail, Calendar, and WhatsApp.',
      ],
      architecture: {
        summary: 'Lead discovery, qualification, and automated follow-ups form an agentic workflow, supported by retrieval context and persistent memory.',
        flow: [
          { id: 'discovery', label: 'Discover leads', technologies: [] },
          { id: 'workflow', label: 'Agent workflow', technologies: ['LangGraph', 'LangChain'] },
          { id: 'qualification', label: 'Qualify leads', technologies: [] },
          { id: 'follow-up', label: 'Follow up', technologies: [] },
        ],
        support: [
          { label: 'Retrieval context', technologies: ['RAG'] },
          { label: 'Persistent memory', technologies: ['Supabase'] },
        ],
      },
      ...missingProjectAssets('Autonomous AI Sales Agent', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
    {
      id: 'bazario-mart',
      title: 'Bazario Mart – Agentic E-commerce Recommender',
      categories: ['AI', 'Full-Stack'],
      technologies: ['Python', 'FastAPI', 'React', 'Gemini API', 'LangGraph', 'Chroma'],
      details: [
        'Developed an AI-powered e-commerce recommendation application.',
        'Implemented personalized product recommendations using retrieval-based context.',
      ],
      architecture: {
        summary: 'A React storefront supplies the entry point for retrieval-based product recommendations through an agentic workflow.',
        flow: [
          { id: 'storefront', label: 'Storefront', technologies: ['React'] },
          { id: 'retrieval', label: 'Retrieve context', technologies: ['Chroma'] },
          { id: 'workflow', label: 'Recommendation workflow', technologies: ['LangGraph', 'Gemini API'] },
          { id: 'products', label: 'Product recommendations', technologies: [] },
        ],
        support: [],
      },
      ...missingProjectAssets('Bazario Mart', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
    {
      id: 'firstround',
      title: 'FirstRound – AI Video Interviewer',
      categories: ['AI'],
      technologies: ['LangGraph', 'LiveKit'],
      details: [
        'Built an AI video interviewing system with resume and job-description parsing.',
        'Implemented candidate research, human review of generated questions, and real-time audio/video interviews.',
        'Generated interview assessments and PDF reports.',
      ],
      architecture: {
        summary: 'Resume and job-description parsing lead to candidate research and questions, then human review, real-time interviews, and assessment/PDF reports.',
        flow: [
          { id: 'inputs', label: 'Resume + job description', technologies: [] },
          { id: 'questions', label: 'Research + questions', technologies: ['LangGraph'] },
          { id: 'review', label: 'Human review', technologies: [] },
          { id: 'interview', label: 'Live interview', technologies: ['LiveKit'] },
          { id: 'assessment', label: 'Assessment + PDF report', technologies: [] },
        ],
        support: [],
      },
      ...missingProjectAssets('FirstRound', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
    {
      id: 'adflow-pro',
      title: 'AdFlow Pro – Freelance Marketplace',
      categories: ['Full-Stack'],
      stack: 'MERN Stack',
      // Expand only the four technologies explicitly listed in the resume.
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      details: [
        'Developed a freelance marketplace with role-based workflows.',
        'Implemented payment and moderation-related functionality.',
      ],
      ...missingProjectAssets('AdFlow Pro', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
    {
      id: 'isp-customer-management',
      title: 'ISP Customer Management System',
      categories: ['Full-Stack'],
      stack: 'MERN Stack',
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      details: [
        'Built a customer management system for an ISP service provider.',
        'Implemented customer, package, and billing workflows, reporting, spreadsheet imports, PDF receipts, and WhatsApp reminders.',
      ],
      ...missingProjectAssets('ISP Customer Management System', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
    {
      id: 'sweet-bites',
      title: 'Sweet Bites – Bakery Website',
      categories: ['Frontend'],
      technologies: ['React', 'Vite', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
      details: [
        'Developed an interactive bakery website with an animated user interface.',
        'Implemented a custom cake builder and WhatsApp ordering functionality.',
      ],
      ...missingProjectAssets('Sweet Bites', { githubHref: null, demoHref: null, screenshotSrc: null, screenshotAlt: null }),
    },
  ],

  // Latest known months first; year-only entries remain explicitly unplaced
  // within 2026. Null months prevent inventing a more precise date later.
  certifications: [
    {
      id: 'google-ai-professional',
      title: 'Google AI Professional Certificate',
      issuer: 'Google',
      date: { label: 'October 2026', year: 2026, month: 10, precision: 'month' },
    },
    {
      id: 'google-ai-essentials',
      title: 'Google AI Essentials',
      issuer: 'Google',
      date: { label: 'October 2026', year: 2026, month: 10, precision: 'month' },
    },
    {
      id: 'ai-agents-bootcamp',
      title: 'AI Agents Bootcamp',
      issuer: 'AI Season',
      date: { label: 'September 2026', year: 2026, month: 9, precision: 'month' },
    },
    {
      id: 'generative-ai-training',
      title: 'Generative AI Internship and Training Program',
      issuer: 'Arch Technologies',
      date: { label: 'August 2026', year: 2026, month: 8, precision: 'month' },
    },
    {
      id: 'agent-hack-2026',
      title: 'Agent Hack 2026 (Participation)',
      issuer: 'AI Season',
      date: { label: '2026', year: 2026, month: null, precision: 'year' },
    },
    {
      id: 'smartreco-build-challenge',
      title: 'SmartReco Build Challenge Hackathon 2026 (Participation)',
      issuer: 'Krish Naik Academy',
      date: { label: '2026', year: 2026, month: null, precision: 'year' },
    },
  ],

  assets: {
    portrait: {
      webp: '/images/portrait.webp',
      webpSrcSet: '/images/portrait-320.webp 320w, /images/portrait-512.webp 512w, /images/portrait.webp 768w',
      jpg: '/images/portrait.jpg',
      width: 768,
      height: 768,
      alt: 'Portrait of Syed Muhammed Ahmed Bin Haider against a light gray background',
    },
    resume: {
      href: '/resume.pdf',
      downloadPayload: '/resume-download.json',
      downloadName: 'Syed-Muhammed-Ahmed-Bin-Haider-Resume.pdf',
    },
  },

  site: {
    title: 'AI & Full-Stack Portfolio',
    seo: {
      description: 'Syed Muhammed Ahmed Bin Haider, a COMSATS Computer Science student building agentic AI, RAG systems, and full-stack applications. Explore his work.',
    },
    roles: ['AI Engineer', 'Agentic Systems Builder', 'Full-Stack Developer'],
    projectFilters: ['All', 'AI', 'Full-Stack', 'Frontend'],
    navigation: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'skills', label: 'Skills' },
      { id: 'projects', label: 'Projects' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'ask-ai', label: 'Ask My AI' },
      { id: 'contact', label: 'Contact' },
    ],
    labels: {
      downloadResume: 'Download Resume',
      demoComingSoon: 'Demo coming soon',
      repositoryComingSoon: 'Repository coming soon',
      screenshotComingSoon: 'Project screenshot coming soon',
      simplifiedArchitecture: 'Simplified architecture',
      skipToContent: 'Skip to content',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      navigation: 'Main navigation',
      pauseAnimations: 'Pause animation',
      resumeAnimations: 'Resume animation',
      reducedMotion: 'Reduced motion enabled',
      github: 'GitHub',
      linkedin: 'LinkedIn',
    },
    brand: {
      wordmark: 'Ahmed',
      descriptor: 'AI & Full-Stack',
      homeLabel: 'Ahmed — back to home',
    },
    hero: {
      eyebrow: 'AI & GENERATIVE AI',
      description:
        'I build AI-powered applications, agentic workflows, and full-stack experiences. A Computer Science student at COMSATS, focused on bringing practical AI systems to life.',
      primaryCta: 'Explore my work',
      secondaryCta: 'Let’s talk',
      rolePrefix: 'Building as an',
      opportunity: 'Open to AI opportunities',
      portraitCaption: 'The person behind the systems',
      graphCaption: 'Agentic workflows',
      technologies: ['LangGraph', 'RAG', 'FastAPI'],
      scrollLabel: 'Scroll to explore',
      projectCountLabel: 'Projects built',
      cgpaLabel: 'CGPA at COMSATS',
      semesterLabel: 'Current semester',
    },
    projects: {
      eyebrow: 'Projects',
      heading: 'Selected work.',
      description: 'Agentic AI, full-stack applications, and interactive web experiences.',
      filterLabel: 'Filter projects by category',
      resultUnit: 'projects',
      resultConnector: 'of',
      openDetail: 'View project',
      closeDetail: 'Close project details',
      screenshotTodo: 'TODO · Real screenshot pending',
      screenshotAltSuffix: 'project screenshot',
      screenshotFrameLabel: 'Project preview',
      pendingLinksLabel: 'Project links',
      githubLink: 'GitHub repository',
      demoLink: 'Live demo',
      detailsHeading: 'What I built',
      technologiesHeading: 'Technology stack',
      architectureNote: 'Conceptual flow based on the project description.',
      supportingLabel: 'Supporting capabilities',
      connectionsLabel: 'Skill connections',
      matchingLabel: 'matching projects',
      clearSkill: 'Clear skill selection',
    },
    about: {
      eyebrow: 'About',
      heading: 'Curiosity into working systems.',
      lead: 'My focus is practical AI: agentic workflows, RAG, and full-stack applications.',
      educationLabel: 'Education',
      counterLabels: { cgpa: 'CGPA', projectCount: 'Projects built', certificationCount: 'Certifications & training', semester: 'Current semester' },
    },
    skills: {
      eyebrow: 'Skills',
      heading: 'Tools with a purpose.',
      description: 'Hover to explore. Select a skill to keep its project connections visible.',
      connectedHeading: 'Connected projects',
      selectedLabel: 'Exploring',
      idleHeading: 'Connect the dots.',
      idleDescription: 'Choose a skill to see the projects that use it.',
      emptyDescription: 'No project lists this technology in its stack yet.',
      matchNote: 'Connections reflect each project’s listed technologies.',
      matchingLabel: 'matching projects',
      clearSelection: 'Clear selection',
      openProject: 'Explore project',
    },
    certifications: {
      eyebrow: 'Certifications & training',
      heading: 'Always learning.',
      description: 'Certifications, training, and participation from my resume.',
      yearOnlyHeading: 'Dates recorded by year',
      yearOnlyLabel: 'Year only',
    },
    contact: {
      eyebrow: 'Contact',
      heading: 'Let’s build something useful.',
      description: 'I’m seeking an opportunity to contribute to practical, real-world AI projects. If you’re building something in AI or on the web, let’s talk.',
      directLabel: 'Direct contact links',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      locationLabel: 'Based in',
      whatsappLabel: 'Talk on WhatsApp',
      formHeading: 'Leave a message',
      formDescription: 'Tell me a little about what you have in mind.',
      fields: [
        { name: 'name', label: 'Your name', placeholder: 'Your name', type: 'text', autoComplete: 'name', minLength: 2, maxLength: 100 },
        { name: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email', autoComplete: 'email', maxLength: 254 },
        { name: 'message', label: 'Your message', placeholder: 'Tell me about your project or opportunity…', type: 'textarea', minLength: 10, maxLength: 4000 },
      ],
      submitLabel: 'Send message',
      sendingLabel: 'Sending…',
      unavailable: 'Message delivery is not connected yet. Please use email or WhatsApp to get in touch.',
      success: 'Message sent. Thanks for getting in touch.',
      error: 'Your message couldn’t be sent. Please try again, or use email or WhatsApp.',
      timeout: 'That took too long. Please try again, or use email or WhatsApp.',
      validationSummary: 'Please check the highlighted fields.',
      fieldErrors: {
        name: 'Enter a name between 2 and 100 characters.',
        email: 'Enter a valid email address.',
        message: 'Enter a message between 10 and 4000 characters.',
      },
    },
    footer: {
      description: 'AI & Generative AI · Full-Stack Development',
      backToTop: 'Back to top',
      quickNavigation: 'Quick navigation',
      shortcut: 'Ctrl / ⌘ K',
    },
    ai: {
      eyebrow: 'Ask My AI',
      heading: 'A conversation, grounded in my work.',
      description: 'Ask about my projects, skills, education, certifications, or how to get in touch.',
      sectionCta: 'Start a conversation',
      openLabel: 'Open Ask My AI',
      closeLabel: 'Close Ask My AI',
      title: 'Ask My AI',
      subtitle: 'A guide to Ahmed’s profile',
      welcome: 'Hello! Ask me about his projects, skills, education, certifications, or contact details.',
      starters: [
        'Which AI projects has he built?',
        'Which projects use LangGraph?',
        'What is his education and CGPA?',
        'What certifications does he have?',
        'How can I contact him?',
      ],
      startersLabel: 'Suggested questions',
      inputLabel: 'Your question',
      placeholder: 'Ask about Ahmed…',
      sendLabel: 'Send question',
      thinking: 'Finding an answer…',
      localLabel: 'Local answer',
      aiLabel: 'AI-assisted answer',
      sourcesLabel: 'Answer sources',
      visitorLabel: 'You',
      assistantLabel: 'Profile assistant',
      emptyQuestion: 'Please enter a question about his profile.',
      longQuestion: 'Please keep your question to 300 characters or fewer.',
      unknownAnswer: "I don't have that information in his profile. Please use the contact form to ask him directly.",
      contactCta: 'Go to the contact form',
      missingRepository: 'The project repository link is not supplied in his profile.',
      missingDemo: 'The live demo link is not supplied in his profile.',
      sources: {
        summary: { label: 'Summary', href: '#about' },
        education: { label: 'Education', href: '#about' },
        skills: { label: 'Skills', href: '#skills' },
        projects: { label: 'Projects', href: '#projects' },
        certifications: { label: 'Certifications', href: '#certifications' },
        contact: { label: 'Contact', href: '#contact' },
      },
    },
    palette: {
      title: 'Quick navigation',
      searchLabel: 'Search sections',
      placeholder: 'Jump to a section…',
      closeLabel: 'Close quick navigation',
      resultsLabel: 'Sections',
      empty: 'No matching sections. Try another search.',
      navigateHint: '↑ ↓ to navigate',
      enterHint: 'Enter to jump',
      escapeHint: 'Esc to close',
      descriptions: {
        home: 'Name, focus, and links',
        about: 'Background and education',
        skills: 'Skills and their project connections',
        projects: 'Explore the projects I’ve built',
        certifications: 'Certificates, training, and participation',
        'ask-ai': 'Questions grounded in the profile',
        contact: 'Email, WhatsApp, and resume',
      },
    },
  },
};

// All displayed totals come from the records rather than fixed UI values.
export const profileStats = {
  cgpa: profile.education.cgpa,
  semester: profile.education.semester,
  projectCount: profile.projects.length,
  certificationCount: profile.certifications.length,
};

// Exact technology matching avoids assuming tools that a project did not list.
export function getProjectsForSkill(skill) {
  if (!skill) return [];
  const normalized = skill.trim().toLowerCase();
  return profile.projects.filter((project) => project.technologies.some((technology) => technology.toLowerCase() === normalized));
}

export function getNavigationCommands(query = '') {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return profile.site.navigation.map((section) => {
    const description = profile.site.palette.descriptions[section.id];
    const keywords = section.id === 'skills' ? profile.skills.flatMap((group) => group.items)
      : section.id === 'projects' ? profile.projects.map((project) => project.title)
      : section.id === 'about' ? [profile.education.degree, profile.education.university, 'CGPA'] : [];
    return { ...section, description, searchText: [section.label, description, ...keywords].join(' ').toLowerCase() };
  }).filter((command) => terms.every((term) => command.searchText.includes(term)));
}

export default profile;
