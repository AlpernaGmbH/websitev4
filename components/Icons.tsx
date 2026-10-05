type P = { className?: string }

const basis = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const

export const Pfeil = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const Haken = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M5 13l4 4L19 7" />
  </svg>
)
export const Plus = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const Schliessen = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const Menue = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
export const Browser = ({ className }: P) => (
  <svg {...basis} className={className}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 9.5h18M7 7h.01M10 7h.01" />
  </svg>
)
export const Pin = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0113 0c0 5.3-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
)
export const Kamera = ({ className }: P) => (
  <svg {...basis} className={className}>
    <rect x="3" y="7" width="18" height="12" rx="2.5" />
    <path d="M8.5 7l1.2-2h4.6l1.2 2" />
    <circle cx="12" cy="13" r="3.2" />
  </svg>
)
export const Kalender = ({ className }: P) => (
  <svg {...basis} className={className}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const Chat = ({ className }: P) => (
  <svg {...basis} className={className}>
    <path d="M4 5.5h16a1 1 0 011 1v9.5a1 1 0 01-1 1h-8l-5 3.5V17H4a1 1 0 01-1-1V6.5a1 1 0 011-1z" />
  </svg>
)
export const Mail = ({ className }: P) => (
  <svg {...basis} className={className}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.5 7.5l8.5 6 8.5-6" />
  </svg>
)
export const Zitat = ({ className }: P) => (
  <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
    <path d="M0 24V13.6C0 6 4 1.2 11.2 0l1.2 2.8C8.4 4 6.4 6.8 6.4 10.4h5.2V24H0zm18.4 0V13.6C18.4 6 22.4 1.2 29.6 0L30.8 2.8c-4 1.2-6 4-6 7.6H30V24H18.4z" />
  </svg>
)
