export function safeSelect(s: string) {
  return s
    .replace(/\s+/g, ' ')
    .replace(/^\s*,\s*/, '')
    .replace(/,\s*,+/g, ',')
    .trim();
}