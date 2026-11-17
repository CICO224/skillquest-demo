import { BookOpen, HeartPulse, House, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { Category } from '../types';
import { cx } from './utils';

export const CATEGORY_META: Record<Category, { icon: LucideIcon; text: string; bg: string }> = {
  Chores: { icon: House, text: 'text-orange-600 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-500/20' },
  Study: { icon: BookOpen, text: 'text-indigo-600 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
  Health: { icon: HeartPulse, text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-100 dark:bg-teal-500/20' },
  Responsibility: { icon: ShieldCheck, text: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-500/20' },
};

export function CategoryIcon({ category, size = 'md' }: { category: Category; size?: 'md' | 'lg' }) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  return (
    <span
      aria-hidden
      className={cx(
        'inline-flex shrink-0 items-center justify-center',
        meta.bg,
        meta.text,
        size === 'lg' ? 'size-12 rounded-2xl' : 'size-10 rounded-xl',
      )}
    >
      <Icon className={size === 'lg' ? 'size-6' : 'size-5'} strokeWidth={2} />
    </span>
  );
}
