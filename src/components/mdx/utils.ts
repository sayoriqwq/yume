export function slugify(title: string) {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/-{2,}/g, '-')
}
