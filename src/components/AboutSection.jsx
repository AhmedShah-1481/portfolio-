import { motion } from 'framer-motion';
import { profile, profileStats } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';
import AnimatedCounter from './AnimatedCounter.jsx';
import Icon from './Icon.jsx';

export default function AboutSection({ index, motionEnabled }) {
  const { site, assets, identity, education, contact } = profile;
  const copy = site.about;
  return (
    <section id="about" className="content-section about-section" tabIndex={-1} aria-labelledby="about-heading">
      <SectionHeading id="about" index={index} copy={copy} />
      <div className="about-layout">
        <motion.div className="about-portrait-panel" initial={motionEnabled ? { opacity: 0, y: 18 } : false}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: motionEnabled ? 0.6 : 0 }}>
          <picture><source srcSet={assets.portrait.webpSrcSet} sizes="(max-width: 767px) 235px, 280px" type="image/webp" />
            <img src={assets.portrait.jpg} width={assets.portrait.width} height={assets.portrait.height} alt={assets.portrait.alt} loading="lazy" decoding="async" />
          </picture>
          <p className="about-location"><Icon name="location" size={14} />{contact.location}</p>
        </motion.div>
        <div className="about-story">
          <p className="about-lead">{copy.lead}</p>
          <p className="about-summary">{identity.summary}</p>
          <div className="education-record">
            <span>{copy.educationLabel}</span><h3>{education.degree}</h3>
            <p>{education.university}<br />{education.campus}</p>
          </div>
        </div>
      </div>
      <dl className="about-counters">
        {Object.entries(copy.counterLabels).map(([key, label]) => (
          <AnimatedCounter key={key} value={profileStats[key]} label={label} decimals={key === 'cgpa' ? 2 : 0} motionEnabled={motionEnabled} />
        ))}
      </dl>
    </section>
  );
}
