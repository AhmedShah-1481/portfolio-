import { profile } from '../data/profile.js';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';

export default function SiteFooter({ navigate, onOpenPalette }) {
  const { site, identity, contact } = profile;
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-main">
          <div><Brand navigate={navigate} /><p>{site.footer.description}</p></div>
          <button type="button" className="palette-trigger" onClick={onOpenPalette}>
            <Icon name="command" size={17} />{site.footer.quickNavigation}<kbd>{site.footer.shortcut}</kbd>
          </button>
          <a className="back-to-top" href="#home" onClick={(event) => navigate(event, 'home')}>{site.footer.backToTop}<Icon name="arrow" size={16} /></a>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} {identity.name}</p><span>{contact.location}</span></div>
      </div>
    </footer>
  );
}
