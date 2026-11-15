export default function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M5 19 19 5M5 5h14v14" /></>,
    down: <><path d="M12 4v16m-6-6 6 6 6-6" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <><path d="m6 6 12 12M6 18 18 6" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" /></>,
    location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.7-1.6 6.7-7.3a5.7 5.7 0 0 0-1.5-4A5.3 5.3 0 0 0 19 0s-1.3-.4-4.2 1.5a14.3 14.3 0 0 0-7.6 0C4.3-.4 3 0 3 0a5.3 5.3 0 0 0-.2 4.1 5.7 5.7 0 0 0-1.5 4c0 5.7 3.4 6.9 6.7 7.3A3.4 3.4 0 0 0 7 18v4" transform="translate(1 1) scale(.9)" /></>,
    linkedin: <><rect x="3" y="8" width="4" height="13" rx="1" /><circle cx="5" cy="4" r="2" /><path d="M11 21V8h4v2c1-3 6-3 6 2v9m-6 0v-8" /></>,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    play: <><path d="m8 4 12 8-12 8V4Z" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>,
    branch: <><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 7v10m0-5h7a5 5 0 0 0 5-3" /></>,
    message: <><path d="M21 11a9 9 0 0 1-13 8l-5 2 2-5A9 9 0 1 1 21 11Z" /><path d="M8 10h8m-8 4h5" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    command: <><path d="M8 8V5a3 3 0 1 0-3 3h14a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H5a3 3 0 1 0 3 3V8Z" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}
