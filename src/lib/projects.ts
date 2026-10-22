import { getCollection, type CollectionEntry } from 'astro:content'

export type Project = CollectionEntry<'projects'>['data'] & { id: string }

export const MAX_FEATURED = 5

/** All Projects, newest first. Fails the build if more than five are Featured. */
export async function getProjects(): Promise<Project[]> {
  const all = (await getCollection('projects'))
    .map((e) => ({ ...e.data, id: e.id }))
    .sort((a, b) => a.order - b.order)
  const featured = all.filter((p) => p.featured)
  if (featured.length > MAX_FEATURED)
    throw new Error(
      `At most ${MAX_FEATURED} Projects may be Featured; found ${featured.length}: ${featured.map((p) => p.name).join(', ')}`,
    )
  return all
}

const LINK_LABELS = [
  ['website', 'Website'],
  ['appStore', 'App Store'],
  ['googlePlay', 'Google Play'],
  ['code', 'Code'],
] as const

/** Links in display order with written-out labels. */
export function projectLinks(p: Project) {
  return LINK_LABELS.flatMap(([key, label]) => (p.links[key] ? [{ label, href: p.links[key]! }] : []))
}
