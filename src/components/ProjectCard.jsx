import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { profile } from '../data/profile.js';
import Icon from './Icon.jsx';
import ProjectScreenshot from './ProjectScreenshot.jsx';
import ProjectLinks from './ProjectLinks.jsx';
import ArchitectureDiagram from './ArchitectureDiagram.jsx';

export default function ProjectCard({ project, index, onOpen, motionEnabled, interactiveEnabled, skillMatch = 'none' }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const opacity = useMotionValue(0);
  const spring = { stiffness: 160, damping: 22, mass: 0.4 };
  const tiltX = useSpring(rotateX, spring);
  const tiltY = useSpring(rotateY, spring);
  const glowOpacity = useSpring(opacity, spring);
  const spotlight = useMotionTemplate`radial-gradient(450px circle at ${pointerX}px ${pointerY}px, rgba(139,92,246,0.11), transparent 70%)`;
  const reset = () => { rotateX.set(0); rotateY.set(0); opacity.set(0); };
  const headingId = `project-${project.id}-title`;
  const copy = profile.site.projects;

  return (
    <motion.article id={`project-${project.id}`} tabIndex={-1} className="project-card" data-project-id={project.id}
      data-skill-match={skillMatch} aria-labelledby={headingId}
      style={{ rotateX: interactiveEnabled ? tiltX : 0, rotateY: interactiveEnabled ? tiltY : 0, transformPerspective: 1100 }}
      onPointerMove={(event) => {
        if (!interactiveEnabled || event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        pointerX.set(x);
        pointerY.set(y);
        rotateX.set(-(y / bounds.height - 0.5) * 6);
        rotateY.set((x / bounds.width - 0.5) * 6);
        opacity.set(1);
      }} onPointerLeave={reset}>
      <motion.div className="project-spotlight" aria-hidden="true"
        style={{ background: spotlight, opacity: interactiveEnabled ? glowOpacity : 0 }} />
      <div className="project-card-header">
        <span className="project-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
        <div className="project-categories">{project.categories.map((category) => <span key={category}>{category}</span>)}</div>
        <Icon name="arrow" size={17} />
      </div>
      <ProjectScreenshot project={project} />
      <div className="project-card-body">
        <h3 id={headingId}>{project.title}</h3>
        <p className="project-summary">{project.details[0]}</p>
        <ul className="project-tech-tags" role="list" aria-label={copy.technologiesHeading}>
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {project.architecture && <ArchitectureDiagram architecture={project.architecture} compact motionEnabled={motionEnabled} />}
        <div className="project-card-footer">
          <button className="project-open" type="button" aria-haspopup="dialog"
            aria-label={`${copy.openDetail}: ${project.title}`} onClick={(event) => onOpen(project, event.currentTarget)}>
            {copy.openDetail}<Icon name="arrow" size={15} />
          </button>
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.article>
  );
}
