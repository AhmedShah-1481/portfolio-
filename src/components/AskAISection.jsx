import { profile } from '../data/profile.js';
import SectionHeading from './SectionHeading.jsx';
import Icon from './Icon.jsx';

export default function AskAISection({ onOpen }) {
  return <section id="ask-ai" className="content-section ask-ai-section" tabIndex={-1} aria-labelledby="ask-ai-heading">
    <SectionHeading id="ask-ai" index={6} copy={profile.site.ai} />
    <button type="button" className="primary-cta" onClick={onOpen}>{profile.site.ai.sectionCta}<span className="cta-icon"><Icon name="message" size={19} /></span></button>
  </section>;
}
