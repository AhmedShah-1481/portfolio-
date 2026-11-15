import { profile } from '../data/profile.js';
import Icon from './Icon.jsx';

export default function ProjectLinks({ project }) {
  const { site } = profile;
  const slots = [
    { key: 'github', icon: 'github', label: site.projects.githubLink, pending: site.labels.repositoryComingSoon },
    { key: 'demo', icon: 'arrow', label: site.projects.demoLink, pending: site.labels.demoComingSoon },
  ];
  return (
    <div className="project-links" role="group" aria-label={site.projects.pendingLinksLabel}>
      {slots.map(({ key, icon, label, pending }) => project[key].href ? (
        <a key={key} href={project[key].href} target="_blank" rel="noopener noreferrer" className="project-link">
          <Icon name={icon} size={14} />{label}
        </a>
      ) : (
        <button key={key} type="button" className="project-link is-pending" disabled title={project[key].todo}>
          <Icon name={icon} size={14} />{pending}
        </button>
      ))}
    </div>
  );
}
