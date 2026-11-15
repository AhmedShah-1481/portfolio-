import { motion } from 'framer-motion';
import { profile, getProjectsForSkill } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';
import Icon from './Icon.jsx';

export default function SkillsSection({ index, motionEnabled, activeSkill, selectedSkill, onPreview, onSelect, onClear, onVisitProject }) {
  const { site, skills } = profile;
  const copy = site.skills;
  const matches = getProjectsForSkill(activeSkill);
  return (
    <section id="skills" className="content-section skills-section" tabIndex={-1} aria-labelledby="skills-heading">
      <SectionHeading id="skills" index={index} copy={copy} />
      <div className="skills-layout">
        <div className="skill-map">
          {skills.map((group, groupIndex) => (
            <motion.div key={group.category} className="skill-group" initial={motionEnabled ? { opacity: 0, y: 12 } : false}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: motionEnabled ? 0.4 : 0 }}>
              <h3><span aria-hidden="true">{String(groupIndex + 1).padStart(2, '0')}</span>{group.category}<Icon name="branch" size={14} /></h3>
              <div className="skill-nodes">
                {group.items.map((skill) => (
                  <button type="button" className="skill-node" key={skill} data-skill={skill}
                    data-active={activeSkill === skill ? 'true' : 'false'} aria-pressed={selectedSkill === skill}
                    aria-controls="skill-connections" onClick={() => onSelect(skill)}
                    onPointerEnter={(event) => { if (event.pointerType !== 'touch') onPreview(skill); }}
                    onPointerLeave={() => onPreview(null)} onFocus={() => onPreview(skill)} onBlur={() => onPreview(null)}>
                    {skill}<span aria-hidden="true">{getProjectsForSkill(skill).length}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <aside id="skill-connections" className="skill-connections" aria-labelledby="skill-connections-heading">
          <span className="connection-orbit" aria-hidden="true"><Icon name="branch" size={28} /></span>
          <p className="connection-eyebrow">{activeSkill ? copy.selectedLabel : copy.connectedHeading}</p>
          <h3 id="skill-connections-heading">{activeSkill || copy.idleHeading}</h3>
          <p className="connection-status" role="status" aria-live="polite">
            {activeSkill ? `${matches.length} ${copy.matchingLabel}` : copy.idleDescription}
          </p>
          {activeSkill && <>
            {matches.length > 0 ? <ul className="connected-project-list" role="list">
              {matches.map((project) => <li key={project.id}><a href={`#project-${project.id}`} onClick={(event) => onVisitProject(event, project.id)}>
                <span>{project.title}</span><Icon name="arrow" size={14} />
              </a></li>)}
            </ul> : <p className="connection-empty">{copy.emptyDescription}</p>}
            <button type="button" className="clear-skill" onClick={onClear}>{copy.clearSelection}<Icon name="close" size={13} /></button>
          </>}
          <p className="connection-note">{copy.matchNote}</p>
        </aside>
      </div>
    </section>
  );
}
