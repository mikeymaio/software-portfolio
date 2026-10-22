import { defineConfig } from 'astro/config'
import todoGuard from './src/integrations/todo-guard.mjs'

// The single place the site URL and base path are configured.
// Move the site by changing these two values; internal links use `url()` from src/lib/url.ts.
export default defineConfig({
  site: 'https://michaelmaio.com',
  base: '/',
  trailingSlash: 'ignore',
  // Fails production builds that still contain `TODO(michael)` content markers.
  integrations: [todoGuard()],
})
