import type { Quest, RepeatInterval } from '../types';

export const PHOTO_RETENTION_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** A quest is missed when its due date has passed and no proof was sent on time. */
export function isMissed(q: Quest, now = Date.now()): boolean {
  if (q.status === 'approved') return false;
  const due = new Date(q.dueDate).getTime();
  if (due >= now) return false;
  if (q.status === 'pending_review' && q.submittedAt && new Date(q.submittedAt).getTime() <= due) return false;
  return true;
}

/** 'YYYY-MM-DD' (local) -> ISO timestamp at the end of that day. */
export function endOfDayIso(dateInput: string): string {
  const [y, m, d] = dateInput.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 0).toISOString();
}

export function toDateInput(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function formatDue(iso: string, now = new Date()): string {
  const due = new Date(iso);
  const diffDays = Math.round((startOfDay(due) - startOfDay(now)) / DAY);
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays === -1) return 'Was due yesterday';
  const label = due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return diffDays < 0 ? `Was due ${label}` : `Due ${label}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatRelative(iso: string, now = Date.now()): string {
  const mins = Math.round((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

/** Next due date for a repeating quest, always in the future. */
export function nextDue(iso: string, repeat: RepeatInterval, now = Date.now()): string {
  const d = new Date(iso);
  const step = () => {
    if (repeat === 'Daily') d.setDate(d.getDate() + 1);
    else if (repeat === 'Weekly') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
  };
  step();
  while (d.getTime() < now) step();
  return d.toISOString();
}

export function photoIsExpired(submittedAt: string | undefined, now = Date.now()): boolean {
  return !!submittedAt && now - new Date(submittedAt).getTime() > PHOTO_RETENTION_DAYS * DAY;
}

/** Downscale a picked photo so it fits comfortably in local storage. */
export function compressImage(file: File, maxSize = 1080, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new Error('Your browser could not read this photo.'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file is not a photo we can read. Please try another one.'));
    };
    img.src = url;
  });
}
