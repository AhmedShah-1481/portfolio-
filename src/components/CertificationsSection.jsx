import { motion } from 'framer-motion';
import { profile } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';

function TimelineEntry({ entry, motionEnabled }) {
  const yearOnly = entry.date.precision === 'year';
  const Heading = yearOnly ? 'h4' : 'h3';
  const month = String(entry.date.month).padStart(2, '0');
  return (
    <motion.li className="timeline-entry" data-date-precision={entry.date.precision}
      initial={motionEnabled ? { opacity: 0, y: 15 } : false} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }} transition={{ duration: motionEnabled ? 0.5 : 0 }}>
      <span className="timeline-node" aria-hidden="true" />
      <div className="timeline-date">{yearOnly ? <span>{entry.date.label}</span>
        : <time dateTime={`${entry.date.year}-${month}`}>{entry.date.label}</time>}
        {yearOnly && <span className="year-only-badge">{profile.site.certifications.yearOnlyLabel}</span>}
      </div>
      <div className="timeline-record"><Heading>{entry.title}</Heading><p>{entry.issuer}</p></div>
    </motion.li>
  );
}

export default function CertificationsSection({ index, motionEnabled }) {
  const copy = profile.site.certifications;
  const dated = profile.certifications.filter((entry) => entry.date.precision === 'month')
    .sort((a, b) => b.date.year - a.date.year || b.date.month - a.date.month);
  const yearOnly = profile.certifications.filter((entry) => entry.date.precision === 'year')
    .sort((a, b) => b.date.year - a.date.year);
  return (
    <section id="certifications" className="content-section certifications-section" tabIndex={-1} aria-labelledby="certifications-heading">
      <SectionHeading id="certifications" index={index} copy={copy} />
      <ol className="certification-timeline" role="list">
        {dated.map((entry) => <TimelineEntry key={entry.id} entry={entry} motionEnabled={motionEnabled} />)}
      </ol>
      {yearOnly.length > 0 && <div className="year-only-group">
        <h3>{copy.yearOnlyHeading}</h3><ol className="certification-timeline" role="list">
          {yearOnly.map((entry) => <TimelineEntry key={entry.id} entry={entry} motionEnabled={motionEnabled} />)}
        </ol>
      </div>}
    </section>
  );
}
