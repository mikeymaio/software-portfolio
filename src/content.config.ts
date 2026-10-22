import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const profile = defineCollection({
  loader: glob({ pattern: 'profile.json', base: './src/content' }),
  schema: ({ image }) =>
    z.object({
    name: z.string().min(1),
    positioningLine: z.string().min(1),
    contextSentence: z.string().min(1),
    // The one place the public email lives. Draft value until Michael decides.
    contactEmail: z.string().email(),
    // Site-relative path of the resume PDF in public/. Rendered through url().
    resumePath: z.string().min(1),
    aboutText: z.string().min(1),
    toolkit: z.string().min(1),
    githubUrl: z.string().url(),
    linkedinUrl: z.string().url(),
    closingLine: z.string().min(1),
    // Optional. Image path is relative to profile.json; alt text is required with it.
    portrait: z.object({ src: image(), alt: z.string().min(1) }).optional(),
  }),
})

export const collections = { profile }
