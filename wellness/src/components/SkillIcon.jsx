const iconMap = {
  health: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#3f7f32" />
      <path d="M12 5C10.5 2 7 2 5.5 3.5C4 5 4 8 6 10L12 16L18 10C20 8 20 5 18.5 3.5C17 2 13.5 2 12 5Z" stroke="#5b9f45" fill="#f4fbef" />
    </svg>
  ),
  journal: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#3f7f32" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#3f7f32" fill="#f7faf4" />
      <path d="M12 7c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4z" stroke="#5b9f45" fill="#e2edda" />
      <path d="M8 15l8-8" stroke="#5b9f45" />
    </svg>
  ),
  coach: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" stroke="#3f7f32" fill="#f4fbef" />
      <path d="M12 2v4M12 4a3 3 0 0 1 3 3v2H9V7a3 3 0 0 1 3-3z" stroke="#5b9f45" />
      <circle cx="8" cy="16" r="1" fill="#3f7f32" />
      <circle cx="16" cy="16" r="1" fill="#3f7f32" />
      <path d="M10 18h4" stroke="#3f7f32" />
      <path d="M2 14h1M21 14h1" stroke="#3f7f32" />
    </svg>
  ),
  suggest: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="#3f7f32" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="#3f7f32" fill="#f7faf4" />
      <path d="M6 2v3M10 2v3M14 2v3" stroke="#5b9f45" />
      <path d="M10 11c1.5 0 2.5 1 2.5 2.5S11.5 16 10 16s-2.5-1-2.5-2.5S8.5 11 10 11z" fill="#e2edda" stroke="#5b9f45" />
    </svg>
  ),
  workout: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="4" height="8" rx="1" fill="#3f7f32" stroke="#3f7f32" />
      <rect x="6" y="6" width="2" height="12" rx="1" fill="#5b9f45" stroke="#3f7f32" />
      <rect x="16" y="6" width="2" height="12" rx="1" fill="#5b9f45" stroke="#3f7f32" />
      <rect x="18" y="8" width="4" height="8" rx="1" fill="#3f7f32" stroke="#3f7f32" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#3f7f32" strokeWidth="3" />
    </svg>
  ),
  challenges: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="#3f7f32" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="#3f7f32" />
      <path d="M4 22h16" stroke="#3f7f32" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" stroke="#3f7f32" />
      <path d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" stroke="#3f7f32" fill="#fffaf0" />
      <circle cx="12" cy="7" r="1.5" fill="#d99b25" stroke="#d99b25" />
    </svg>
  ),
  reports: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" fill="#5b9f45" stroke="#3f7f32" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="#3f7f32" fill="#f7faf4" />
      <path d="M8 16l3-3 2 2 4-5" stroke="#d99b25" />
      <circle cx="17" cy="10" r="1" fill="#d99b25" />
      <line x1="8" y1="18" x2="16" y2="18" stroke="#3f7f32" strokeOpacity="0.4" />
    </svg>
  ),
  'drug-check': (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 12h.01M12 17h.01" stroke="#3f7f32" strokeWidth="3" />
      <rect x="4" y="4" width="7" height="16" rx="3.5" transform="rotate(-45 7.5 12)" stroke="#3f7f32" fill="#f4fbef" />
      <path d="M6.5 11l4-4" stroke="#3f7f32" />
      <circle cx="17" cy="7" r="4" stroke="#e53e3e" fill="#fff5f5" />
      <line x1="15" y1="7" x2="19" y2="7" stroke="#e53e3e" />
    </svg>
  ),
  family: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="#3f7f32" fill="#f7faf4" />
      <path d="M9 22V12h6v10" stroke="#3f7f32" />
      <path d="M12 7.5c-.8-1-2-1.2-2.8-.5-.8.7-.7 1.8 0 2.5l2.8 2.8 2.8-2.8c.7-.7.8-1.8 0-2.5-.8-.7-2-.5-2.8.5z" stroke="#e53e3e" fill="#fff5f5" />
    </svg>
  ),
  pro: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9z" stroke="#d99b25" fill="#fffaf0" />
      <path d="M11 3L8 9l4 12 4-12-3-6" stroke="#d99b25" />
      <path d="M2 9h20" stroke="#d99b25" />
    </svg>
  ),
  settings: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" stroke="#3f7f32" fill="#f4fbef" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#3f7f32" />
    </svg>
  ),
  profile: (className) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#3f7f32" fill="#f4fbef" />
      <circle cx="12" cy="7" r="4" stroke="#3f7f32" fill="#e2edda" />
    </svg>
  ),
};

export default function SkillIcon({ icon, fallback, className = 'w-6 h-6' }) {
  const renderSvg = iconMap[icon];

  if (renderSvg) {
    return renderSvg(className);
  }

  // Fallback to emoji with styled container if icon not found
  return (
    <span className={`${className} flex items-center justify-center text-xl select-none`} aria-hidden="true">
      {fallback}
    </span>
  );
}
