/**
 * Tab bar icons in an SF Symbols style: outlined when inactive, filled when active.
 * Inner details are drawn in the tab bar's background color so they read as cut-outs.
 */
const CUT = 'var(--color-surface)';

interface Props {
  active: boolean;
}

const base = {
  viewBox: '0 0 24 24',
  className: 'size-[26px]',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function QuestsIcon({ active }: Props) {
  const detail = active ? CUT : 'currentColor';
  return (
    <svg {...base} stroke="currentColor">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill={active ? 'currentColor' : 'none'} />
      <path d="M7.5 9.2l1.6 1.6 2.9-3.2M7.5 15.2l1.6 1.6 2.9-3.2M14.5 9.5h2.5M14.5 15.5h2.5" stroke={detail} strokeWidth={active ? 2 : 1.8} />
    </svg>
  );
}

export function ShopIcon({ active }: Props) {
  return (
    <svg {...base} stroke="currentColor">
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      <path d="M5.2 8.5h13.6l-.9 10.7a1.6 1.6 0 0 1-1.6 1.5H7.7a1.6 1.6 0 0 1-1.6-1.5z" fill={active ? 'currentColor' : 'none'} />
      {active && <path d="M9.5 12.5a2.5 2.5 0 0 0 5 0" stroke={CUT} strokeWidth={2} />}
    </svg>
  );
}

export function ClaimsIcon({ active }: Props) {
  const detail = active ? CUT : 'currentColor';
  return (
    <svg {...base} stroke="currentColor">
      <path d="M12 7.5c-1.2-2.6-4.6-3.2-4.6-1 0 1.4 2.6 1 4.6 1zM12 7.5c1.2-2.6 4.6-3.2 4.6-1 0 1.4-2.6 1-4.6 1z" />
      <rect x="3.5" y="7.5" width="17" height="4" rx="1.3" fill={active ? 'currentColor' : 'none'} />
      <path d="M5 11.5h14v7.3a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 18.8z" fill={active ? 'currentColor' : 'none'} />
      <path d="M12 7.5v13" stroke={detail} strokeWidth={active ? 2 : 1.8} />
    </svg>
  );
}
