# Michael Maio — Portfolio

Static [Astro](https://astro.build) site, deployed by Netlify from `master`. See `GLOSSARY.md` for terms and `docs/adr/` for decisions. There is no CMS and no credentials are needed to build.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm test` — builds, serves the production build and runs the Playwright suite (390px and 1440px)

Site URL and base path live only in `astro.config.mjs`. Node version is pinned in `.nvmrc` and `netlify.toml`.

## Updating the site

Every change is a commit to `master`; Netlify rebuilds and redeploys. Editing on github.com works for all of this.

### Resume

Upload a new PDF to `public/resume.pdf` (same filename, replacing the old file) on GitHub and commit to `master`. The header, hero and contact links all point at it, so nothing else changes.

### Projects

Each Project is one file in `src/content/projects/`, for example `chatcec.json`. Add a file to add a Project; delete one to remove it.

- `name`, `client`, `role`, `years`, `summary`, `stack` (list), `links` (any of `website`, `appStore`, `googlePlay`, `code`).
- `order`: position on the page. `1` is the newest; the list sorts ascending. Renumber neighbours when you insert one.
- `featured: true` puts a Project in the first group (numbered from 01). At most 5 may be Featured, and a Featured Project needs at least one link. The rest sit under the "All projects (N)" toggle.
- `retired: true` marks a product that no longer exists. A Retired Project must have no links. `retiredCompanion` credits a retired product inside another Project (shown as "JOKR (retired)").
- `screenshot` is optional: `{ "src": "./file.png", "alt": "..." }`, with the image next to the JSON file.

The build fails with a message naming the file if a rule is broken.

### Copy

Name, Positioning Line, context sentence, about text, toolkit line, closing line, contact email, GitHub and LinkedIn URLs and the optional portrait are all in `src/content/profile.json` (validated by `src/content.config.ts`). The public email lives only there.

If you change the name, the Positioning Line or the palette in `src/styles/global.css`, regenerate the favicon and link preview card and commit the result:

```
node scripts/generate-brand-assets.mjs
```

### The `TODO(michael)` guard

A value of `TODO(michael)` in any `src/content/**/*.json` field marks a gap still to fill. In dev, preview and CI it renders as muted italic text. On a Netlify production build (`CONTEXT=production`) the build fails and lists each file and field, so the site cannot launch with a gap. Deploy previews are not blocked. Render any new content text through `src/components/Marked.astro` so it follows the same convention.
