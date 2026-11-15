import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import AskAISection from './components/AskAISection.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import SkillsSection from './components/SkillsSection.jsx';
import CertificationsSection from './components/CertificationsSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import { profile } from './data/profile.js';
import { useMotionPreferences } from './hooks/useMotionPreferences.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { useSectionNavigation } from './hooks/useSectionNavigation.js';

const AskAIWidget = lazy(() => import('./components/AskAIWidget.jsx'));
const CommandPalette = lazy(() => import('./components/CommandPalette.jsx'));

export default function App() {
  const preferences = useMotionPreferences();
  const scrollController = useSmoothScroll(preferences.interactiveEnabled);
  const navigate = useSectionNavigation(scrollController, preferences.motionEnabled);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [previewSkill, setPreviewSkill] = useState(null);
  const [projectCategory, setProjectCategory] = useState('All');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteTrigger = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const chatTrigger = useRef(null);
  const activeSkill = previewSkill || selectedSkill;
  const openChat = (event) => {
    if (document.querySelector('dialog[open]')) return;
    chatTrigger.current = event.currentTarget;
    setChatLoaded(true);
    setChatOpen(true);
  };

  const openPalette = (event) => {
    if (document.querySelector('dialog[open]')) return;
    paletteTrigger.current = event?.currentTarget || document.activeElement;
    setPaletteOpen(true);
  };
  const visitSkillProject = (event, projectId) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setProjectCategory('All');
    requestAnimationFrame(() => navigate(event, `project-${projectId}`));
  };

  useEffect(() => {
    const shortcut = (event) => {
      if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey) || event.altKey) return;
      event.preventDefault();
      if (paletteOpen) { setPaletteOpen(false); return; }
      if (document.querySelector('dialog[open]')) return;
      paletteTrigger.current = document.activeElement;
      setPaletteOpen(true);
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [paletteOpen]);

  useEffect(() => {
    document.title = `${profile.identity.name} | ${profile.site.title}`;
  }, []);

  return (
    <MotionConfig reducedMotion={preferences.motionEnabled ? 'never' : 'always'}>
      <div className="site" data-motion={preferences.motionEnabled ? 'on' : 'off'} data-effects={preferences.effectsEnabled ? 'full' : 'light'}>
        <a className="skip-link" href="#home" onClick={(event) => navigate(event, 'home')}>
          {profile.site.labels.skipToContent}
        </a>
        <ScrollProgress motionEnabled={preferences.motionEnabled} />
        <SiteHeader navigate={navigate} motionEnabled={preferences.motionEnabled} />
        <main id="main-content">
          <Hero preferences={preferences} navigate={navigate} />
          <div className="section-shells page-container">
            <AboutSection index={2} motionEnabled={preferences.motionEnabled} />
            <SkillsSection index={3} motionEnabled={preferences.motionEnabled} activeSkill={activeSkill}
              selectedSkill={selectedSkill} onPreview={setPreviewSkill}
              onSelect={(skill) => setSelectedSkill((current) => current === skill ? null : skill)}
              onClear={() => { setPreviewSkill(null); setSelectedSkill(null); }} onVisitProject={visitSkillProject} />
            <ProjectsSection preferences={preferences} index={4} category={projectCategory} onCategoryChange={setProjectCategory}
              activeSkill={activeSkill} onClearSkill={() => { setPreviewSkill(null); setSelectedSkill(null); }} />
            <CertificationsSection index={5} motionEnabled={preferences.motionEnabled} />
            <AskAISection onOpen={openChat} />
            <ContactSection index={7} motionEnabled={preferences.motionEnabled} />
          </div>
        </main>
        <SiteFooter navigate={navigate} onOpenPalette={openPalette} />
        {!chatLoaded && <button className="chat-launcher" type="button" aria-label={profile.site.ai.openLabel}
          aria-haspopup="dialog" aria-expanded="false" onClick={openChat}>{profile.site.ai.title}</button>}
        <Suspense fallback={null}>
          {chatLoaded && <AskAIWidget open={chatOpen} onOpen={openChat} onClose={() => setChatOpen(false)} returnFocusRef={chatTrigger}
            motionEnabled={preferences.motionEnabled} navigate={navigate} />}
          {paletteOpen && <CommandPalette navigate={navigate} onClose={() => setPaletteOpen(false)}
            returnFocusRef={paletteTrigger} motionEnabled={preferences.motionEnabled} />}
        </Suspense>
      </div>
    </MotionConfig>
  );
}
