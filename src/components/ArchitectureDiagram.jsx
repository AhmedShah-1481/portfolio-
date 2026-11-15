import { useId, useRef } from 'react';
import { useInView } from 'framer-motion';
import { profile } from '../data/profile.js';
import Icon from './Icon.jsx';

export default function ArchitectureDiagram({ architecture, compact = false, motionEnabled }) {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: 0.1 });
  const captionId = useId();
  const { site } = profile;

  return (
    <figure ref={ref} className={`architecture${compact ? ' architecture-compact' : ''}`}
      data-animated={motionEnabled && visible ? 'true' : 'false'} aria-labelledby={captionId}>
      <figcaption id={captionId}><Icon name="branch" size={14} />{site.labels.simplifiedArchitecture}</figcaption>
      <p className="sr-only">{architecture.summary}</p>
      <ol className="architecture-flow" role="list" style={{ '--flow-count': architecture.flow.length }}>
        {architecture.flow.map((node) => (
          <li className="architecture-node" key={node.id}>
            <span className="architecture-node-label">{node.label}</span>
            {node.technologies.length > 0 && <span className="architecture-tech">{node.technologies.join(' · ')}</span>}
            <span className="architecture-connector" aria-hidden="true"><i /></span>
          </li>
        ))}
      </ol>
      {architecture.support.length > 0 && (
        <ul className="architecture-support" role="list" aria-label={site.projects.supportingLabel}>
          {architecture.support.map((node) => (
            <li key={node.label}><span className="support-marker" aria-hidden="true" />{node.label}
              <span className="architecture-tech">{node.technologies.join(' · ')}</span></li>
          ))}
        </ul>
      )}
      {!compact && <p className="architecture-note">{site.projects.architectureNote}</p>}
    </figure>
  );
}
