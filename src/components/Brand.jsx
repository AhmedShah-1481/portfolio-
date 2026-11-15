import { profile } from '../data/profile.js';

export default function Brand({ navigate }) {
  return (
    <a className="brand" href="#home" aria-label={profile.site.brand.homeLabel}
      onClick={(event) => navigate(event, 'home')}>
      <svg className="brand-mark" width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <path d="m7 24 10-17 10 17M7 24h20M17 7v17" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17" cy="7" r="3" fill="#090b10" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="7" cy="24" r="3" fill="#090b10" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="27" cy="24" r="3" fill="#090b10" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span className="brand-wordmark">{profile.site.brand.wordmark}<span className="brand-period">.</span></span>
    </a>
  );
}
