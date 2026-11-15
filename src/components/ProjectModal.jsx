import { motion } from 'framer-motion';
import { profile } from '../data/profile.js';
import { useProjectDialog } from '../hooks/useProjectDialog.js';
import Icon from './Icon.jsx';
import ProjectScreenshot from './ProjectScreenshot.jsx';
import ProjectLinks from './ProjectLinks.jsx';
import ArchitectureDiagram from './ArchitectureDiagram.jsx';

export default function ProjectModal({ project, motionEnabled, onClose, returnFocusRef }) {
  const { dialogRef, titleRef, trapFocus, startedOutside, outside } = useProjectDialog(returnFocusRef);
  const copy = profile.site.projects;

  return (
    <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-modal-title"
      aria-describedby="project-modal-summary" onKeyDown={trapFocus}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDown={(event) => { startedOutside.current = outside(event); }}
      onClick={(event) => { if (startedOutside.current && outside(event)) onClose(); }}>
      <motion.div className="project-modal-panel"
        initial={motionEnabled ? { opacity: 0, y: 15 } : false} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionEnabled ? 0.25 : 0 }}>
        <div className="project-modal-header">
          <div>
            <div className="project-categories">{project.categories.map((category) => <span key={category}>{category}</span>)}</div>
            <h2 ref={titleRef} tabIndex={-1} id="project-modal-title">{project.title}</h2>
          </div>
          <button className="icon-button project-modal-close" type="button" onClick={onClose} aria-label={copy.closeDetail}>
            <Icon name="close" size={23} />
          </button>
        </div>
        <div className="project-modal-content">
          <p id="project-modal-summary" className="project-modal-summary">{project.details[0]}</p>
          <ProjectScreenshot project={project} expanded />
          {project.architecture && <ArchitectureDiagram architecture={project.architecture} motionEnabled={motionEnabled} />}
          <div className="project-modal-columns">
            <section aria-labelledby="project-detail-heading">
              <h3 id="project-detail-heading">{copy.detailsHeading}</h3>
              <ul className="project-detail-list">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </section>
            <section aria-labelledby="project-stack-heading">
              <h3 id="project-stack-heading">{copy.technologiesHeading}</h3>
              {project.stack && <p className="project-stack-name">{project.stack}</p>}
              <ul className="project-tech-tags" role="list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
            </section>
          </div>
          <ProjectLinks project={project} />
        </div>
      </motion.div>
    </dialog>
  );
}
