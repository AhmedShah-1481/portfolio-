import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';
import ResumeLink from './ResumeLink.jsx';

export default function SiteHeader({ navigate, motionEnabled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef(null);
  const menuButton = useRef(null);
  const closeButton = useRef(null);
  const { activeId, scrolled } = useActiveSection();
  const { site } = profile;

  useEffect(() => {
    if (menuOpen && !dialog.current.open) {
      dialog.current.showModal();
      closeButton.current?.focus({ preventScroll: true });
    }
    if (!menuOpen && dialog.current.open) dialog.current.close();
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1100px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  const visit = (event, id) => {
    setMenuOpen(false);
    navigate(event, id);
  };

  return (
    <>
      <motion.header className={`site-header${scrolled ? ' is-scrolled' : ''}`}
        initial={motionEnabled ? { opacity: 0, y: -12 } : false}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="header-inner page-container">
          <Brand navigate={navigate} />
          <nav className="desktop-nav" aria-label={site.labels.navigation}>
            {site.navigation.map(({ id, label }) => (
              <a key={id} href={`#${id}`} onClick={(event) => navigate(event, id)}
                aria-current={activeId === id ? 'location' : undefined}>{label}</a>
            ))}
          </nav>
          <ResumeLink className="header-resume">
            {site.labels.downloadResume}<Icon name="download" size={15} />
          </ResumeLink>
          <button ref={menuButton} className="menu-toggle icon-button" type="button" aria-label={site.labels.openMenu}
            aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </motion.header>

      <dialog ref={dialog} id="mobile-navigation" className="navigation-dialog"
        aria-label={site.labels.navigation} onCancel={() => setMenuOpen(false)}
        onClose={() => {
          setMenuOpen(false);
          menuButton.current?.focus({ preventScroll: true });
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const controls = [...dialog.current.querySelectorAll('a[href], button:not([disabled])')];
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onClick={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
        <motion.div className="mobile-nav-panel" initial={false}
          animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -10 }}
          transition={{ duration: motionEnabled ? 0.25 : 0 }}>
          <div className="mobile-nav-top">
            <Brand navigate={visit} />
            <button ref={closeButton} type="button" className="icon-button" aria-label={site.labels.closeMenu}
              onClick={() => setMenuOpen(false)}><Icon name="close" size={24} /></button>
          </div>
          <nav aria-label={site.labels.navigation}>
            {site.navigation.map(({ id, label }, index) => (
              <a key={id} href={`#${id}`} onClick={(event) => visit(event, id)}
                aria-current={activeId === id ? 'location' : undefined}>
                <span className="nav-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {label}<Icon name="arrow" size={18} />
              </a>
            ))}
          </nav>
          <ResumeLink className="mobile-resume">
            {site.labels.downloadResume}<Icon name="download" size={18} />
          </ResumeLink>
        </motion.div>
      </dialog>
    </>
  );
}
