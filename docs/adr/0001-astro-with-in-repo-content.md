# Astro with content in the repo, replacing Gatsby and Contentful

The site was a 2019 Gatsby + Contentful starter. For the 2026 redesign we are rebuilding it in Astro, with all content (bio, Projects, links) as Markdown/JSON files in this repo, and dropping Contentful entirely. The content is small and changes rarely, so a CMS added cost without benefit: builds needed Contentful credentials, entries were looked up by hard-coded IDs, and Gatsby's GraphQL layer existed mainly to serve Contentful. Astro ships close to zero client JavaScript by default, which suits a static one-page portfolio. Hosting stays on Netlify at michaelmaio.com.

## Considered Options

- **Keep Gatsby + Contentful, restyle only**: smallest change, but keeps the credential-gated build and an aging framework.
- **Next.js**: capable, but its server features are unnecessary here and it ships more client JavaScript than a static portfolio needs.
