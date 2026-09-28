export const ACCENT_COLORS = [
  'red',
  'coral',
  'orange',
  'amber',
  'lime',
  'mint',
  'teal',
  'sky',
  'indigo',
  'violet',
  'pink',
  'slate',
] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];
