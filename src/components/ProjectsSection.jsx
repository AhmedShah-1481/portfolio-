import { lazy, Suspense, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile, getProjectsForSkill } from '../data/profile.js';
import ProjectCard from './ProjectCard.jsx';
import Icon from './Icon.jsx';

const ProjectModal = lazy(() => import('./ProjectModal.jsx'));

export default function ProjectsSection({ preferences, index, category, onCategoryChange, activeSkill, onClearSkill }) {
  const [selected, setSelected] = useState(null);
  const trigger = useRef(null);
  const { site, projects } = profile;
  const copy = site.projects;
  const { motionEnabled, interactiveEnabled, reducedMotion, toggleMotion } = preferences;
  const matches = (project, filter) => filter === 'All' || project.categories.includes(filter);
  const visible = projects.filter((project) => matches(project, category));
  const skillMatches = getProjectsForSkill(activeSkill);
  const openProject = (project, element) => {
    trigger.current = element;
    setSelected(project);
  };

  return (
    <section id="projects" className="projects-section" tabIndex={-1} aria-labelledby="projects-heading">
      <div className="projects-heading-row">
        <div>
          <p className="section-kicker"><span aria-hidden="true">{String(index).padStart(2, '0')}</span>{copy.eyebrow}</p>
          <h2 id="projects-heading">{copy.heading}</h2>
          <p className="projects-intro">{copy.description}</p>
        </div>
        <span className="project-total" aria-hidden="true">{String(projects.length).padStart(2, '0')}<span>{copy.resultUnit}</span></span>
      </div>

      <div className="projects-toolbar">
        <div className="project-filters" role="group" aria-label={copy.filterLabel}>
          {site.projectFilters.map((filter) => (
            <button key={filter} type="button" aria-pressed={category === filter} aria-controls="project-grid"
              onClick={() => onCategoryChange(filter)}>
              {filter}<span aria-hidden="true">{projects.filter((project) => matches(project, filter)).length}</span>
            </button>
          ))}
        </div>
        <button className="motion-toggle project-motion-toggle" type="button" onClick={toggleMotion}
          disabled={reducedMotion} aria-pressed={!motionEnabled}>
          <Icon name={motionEnabled ? 'pause' : 'play'} size={13} />
          {reducedMotion ? site.labels.reducedMotion : motionEnabled ? site.labels.pauseAnimations : site.labels.resumeAnimations}
        </button>
      </div>
      <p className="project-results" role="status" aria-live="polite" aria-atomic="true">
        {visible.length} {copy.resultConnector} {projects.length} {copy.resultUnit}
      </p>
      {activeSkill && <div className="project-skill-banner">
        <span>{copy.connectionsLabel}: <strong>{activeSkill}</strong> · {skillMatches.length} {copy.matchingLabel}</span>
        <button type="button" onClick={onClearSkill} aria-label={copy.clearSkill}><Icon name="close" size={15} /></button>
      </div>}

      <div id="project-grid" className="project-grid">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((project) => (
            <motion.div className="project-slot" key={project.id} layout={motionEnabled}
              initial={motionEnabled ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: motionEnabled ? 10 : 0 }}
              transition={{ duration: motionEnabled ? 0.22 : 0 }}>
              <ProjectCard project={project} index={projects.indexOf(project) + 1} onOpen={openProject}
                motionEnabled={preferences.effectsEnabled} interactiveEnabled={interactiveEnabled}
                skillMatch={skillMatches.length ? skillMatches.includes(project) ? 'true' : 'false' : 'none'} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Suspense fallback={null}>{selected && <ProjectModal key={selected.id} project={selected} motionEnabled={motionEnabled}
        onClose={() => setSelected(null)} returnFocusRef={trigger} />}</Suspense>
    </section>
  );
}
