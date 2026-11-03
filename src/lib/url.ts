/** Build an internal link relative to the configured base (see astro.config.mjs). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}
