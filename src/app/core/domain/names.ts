/** Best-effort display name from an email's local part: `maria.lopez_92@x.com` → `Maria Lopez`. */
export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const words = local
    .split(/[._+-]+/)
    .map((word) => word.replace(/\d+/g, ''))
    .filter((word) => word.length > 0);
  if (words.length === 0) return local || email;
  return words.map((word) => word.charAt(0).toLocaleUpperCase('es') + word.slice(1)).join(' ');
}
