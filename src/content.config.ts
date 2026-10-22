import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const profile = defineCollection({
  loader: glob({ pattern: 'profile.json', base: './src/content' }),
  schema: z.object({
    name: z.string().min(1),
    positioningLine: z.string().min(1),
    contextSentence: z.string().min(1),
    // The one place the public email lives. Draft value until Michael decides.
    contactEmail: z.string().email(),
    // Site-relative path of the resume PDF in public/. Rendered through url().
    resumePath: z.string().min(1),
  }),
})

const link = z.string().url()

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string().min(1),
        client: z.string().min(1),
        // Credits Michael supplies; `TODO(michael)` marks a gap (see the production guard, #56).
        role: z.string().min(1),
        years: z.string().min(1),
        summary: z.string().min(1),
        stack: z.array(z.string().min(1)).min(1),
        links: z
          .object({
            website: link.optional(),
            appStore: link.optional(),
            googlePlay: link.optional(),
            code: link.optional(),
          })
          .strict()
          .default({}),
        // Newest first: 1 is the newest Project.
        order: z.number().int(),
        featured: z.boolean().default(false),
        retired: z.boolean().default(false),
        // Name of a Retired companion product credited inside this Project, e.g. JOKR.
        retiredCompanion: z.string().min(1).optional(),
        screenshot: z.object({ src: image(), alt: z.string().min(1) }).optional(),
      })
      .superRefine((p, ctx) => {
        const hasLinks = Object.values(p.links).some(Boolean)
        if (p.retired && hasLinks)
          ctx.addIssue({ code: 'custom', path: ['links'], message: `Retired Project "${p.name}" must have no links` })
        if (p.featured && !hasLinks)
          ctx.addIssue({ code: 'custom', path: ['links'], message: `Featured Project "${p.name}" needs at least one link` })
      }),
})

export const collections = { profile, projects }
