# Michael Maio — Portfolio

Static [Astro](https://astro.build) site, deployed by Netlify. See `GLOSSARY.md` for terms and `docs/adr/` for decisions.

- `npm run dev` — dev server
- `npm run build` — production build to `dist/` (needs no credentials)
- `npm test` — builds, serves the production build and runs the Playwright suite (390px and 1440px)

Site URL and base path live only in `astro.config.mjs`. Profile content is `src/content/profile.json`, validated by `src/content.config.ts`.
