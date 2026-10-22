import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const profile = defineCollection({
  loader: glob({ pattern: 'profile.json', base: './src/content' }),
  schema: z.object({
    name: z.string().min(1),
    positioningLine: z.string().min(1),
  }),
})

export const collections = { profile }
