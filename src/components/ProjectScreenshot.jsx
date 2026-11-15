import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';
import Icon from './Icon.jsx';

export default function ProjectScreenshot({ project, expanded = false }) {
  const [failed, setFailed] = useState(false);
  const { site } = profile;
  useEffect(() => { setFailed(false); }, [project.screenshot.src]);
  const hasImage = Boolean(project.screenshot.src) && !failed;

  return (
    <div className={`project-screenshot${expanded ? ' project-screenshot-expanded' : ''}`}>
      <div className="screenshot-topline" aria-hidden="true">
        <span className="screenshot-dots"><i /><i /><i /></span>
        <span>{site.projects.screenshotFrameLabel}</span><Icon name="image" size={12} />
      </div>
      {hasImage ? (
        <img src={project.screenshot.src} alt={project.screenshot.alt || `${project.title} ${site.projects.screenshotAltSuffix}`}
          loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <div className="screenshot-placeholder" data-screenshot-placeholder>
          <span className="screenshot-symbol" aria-hidden="true"><Icon name="image" size={27} /></span>
          <p>{site.labels.screenshotComingSoon}</p>
          <span className="screenshot-todo">{site.projects.screenshotTodo}</span>
          <div className="placeholder-orbit" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
