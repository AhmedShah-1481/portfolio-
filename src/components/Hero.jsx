import { lazy, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { profile, profileStats } from '../data/profile.js';
import { useHeroStory } from '../hooks/useHeroStory.js';
import Icon from './Icon.jsx';
import MagneticLink from './MagneticLink.jsx';
import RotatingRole from './RotatingRole.jsx';
import StaticNeuralField from './StaticNeuralField.jsx';

const NeuralField = lazy(() => import('./NeuralField.jsx'));

export default function Hero({ preferences, navigate }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.15 });
  const { motionEnabled, entranceEnabled, effectsEnabled, interactiveEnabled, reducedMotion, toggleMotion } = preferences;
  useHeroStory(ref, interactiveEnabled);
  const { identity, contact, assets, site } = profile;
  const copy = site.hero;
  const entrance = (delay = 0) => ({
    initial: entranceEnabled ? { opacity: 0, y: 12 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: entranceEnabled ? 0.35 : 0, delay: entranceEnabled ? delay * 0.3 : 0 },
  });
  const facts = [
    { value: String(profileStats.projectCount).padStart(2, '0'), label: copy.projectCountLabel },
    { value: profileStats.cgpa, label: copy.cgpaLabel },
    { value: String(profileStats.semester).padStart(2, '0'), label: copy.semesterLabel },
  ];

  return (
    <section ref={ref} id="home" className={`hero${interactiveEnabled ? ' hero-interactive' : ''}`}
      tabIndex={-1} aria-labelledby="hero-name">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <StaticNeuralField />
      </div>
      {interactiveEnabled && <Suspense fallback={null}><NeuralField /></Suspense>}

      <div className="hero-content page-container">
        <div className="hero-main">
          <div className="hero-copy">
            <motion.p className="hero-eyebrow" {...entrance(0.1)}>
              <span className="eyebrow-line" />{copy.eyebrow}
            </motion.p>
            <h1 id="hero-name" className="hero-name" aria-label={identity.name}>
              {identity.displayNameLines.map((line, index) => (
                <span className={`name-mask name-mask-${index}`} key={line} aria-hidden="true">
                  <motion.span className="hero-name-line"
                    initial={entranceEnabled ? { y: '110%' } : false}
                    animate={{ y: 0 }}
                    transition={{ duration: entranceEnabled ? 0.45 : 0, delay: entranceEnabled ? index * 0.06 : 0,
                      ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span>
                </span>
              ))}
            </h1>
            <motion.div {...entrance(0.5)}>
              <RotatingRole enabled={effectsEnabled && inView} />
            </motion.div>
            <motion.p className="hero-description" {...entrance(0.65)}>{copy.description}</motion.p>
            <motion.div className="hero-actions" {...entrance(0.75)}>
              <MagneticLink className="primary-cta" enabled={interactiveEnabled} href="#projects"
                onClick={(event) => navigate(event, 'projects')}>
                {copy.primaryCta}<span className="cta-icon"><Icon name="arrow" size={19} /></span>
              </MagneticLink>
              <a className="text-cta" href={contact.emailHref}>{copy.secondaryCta}<Icon name="arrow" size={16} /></a>
            </motion.div>
            <motion.div className="hero-socials" {...entrance(0.85)}>
              <a href={contact.githubHref} target="_blank" rel="noopener noreferrer" aria-label={site.labels.github}>
                <Icon name="github" size={18} /><span>{site.labels.github}</span>
              </a>
              <a href={contact.linkedinHref} target="_blank" rel="noopener noreferrer" aria-label={site.labels.linkedin}>
                <Icon name="linkedin" size={17} /><span>{site.labels.linkedin}</span>
              </a>
              <span className="social-divider" />
              <span className="hero-location"><Icon name="location" size={15} />{contact.location}</span>
            </motion.div>
          </div>

          <motion.div className="hero-visual" {...entrance(0.35)}>
            <div className="hero-visual-parallax">
              <div className="portrait-stage">
                <div className="portrait-orbit orbit-one"><span /></div>
                <div className="portrait-orbit orbit-two"><span /></div>
                <div className="portrait-halo" />
                <picture className="hero-portrait">
                  <source srcSet={assets.portrait.webpSrcSet} sizes="(max-width: 767px) 280px, 360px" type="image/webp" />
                  <img src={assets.portrait.jpg} alt={assets.portrait.alt}
                    width={assets.portrait.width} height={assets.portrait.height}
                    fetchPriority="high" decoding="async" />
                </picture>
                {copy.technologies.map((technology, index) => (
                  <span className={`floating-tech floating-tech-${index}`} key={technology}>
                    <span className="tech-dot" />{technology}
                  </span>
                ))}
                <span className="graph-caption"><span className="graph-caption-line" />{copy.graphCaption}</span>
              </div>
              <div className="portrait-caption">
                <span className="caption-bracket">[</span>{copy.portraitCaption}<span className="caption-bracket">]</span>
              </div>
              <div className="opportunity"><span className="status-dot" />{copy.opportunity}</div>
            </div>
          </motion.div>
        </div>

        <motion.div className="hero-bottom" {...entrance(0.95)}>
          <dl className="hero-facts">
            {facts.map(({ value, label }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <div className="hero-controls">
            <button className="motion-toggle" type="button" onClick={toggleMotion}
              disabled={reducedMotion} aria-pressed={!motionEnabled}>
              <Icon name={motionEnabled ? 'pause' : 'play'} size={13} />
              {reducedMotion ? site.labels.reducedMotion : motionEnabled ? site.labels.pauseAnimations : site.labels.resumeAnimations}
            </button>
            <a className="scroll-cue" href="#about" onClick={(event) => navigate(event, 'about')}>
              {copy.scrollLabel}<span className="scroll-arrow"><Icon name="down" size={16} /></span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
