import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

export const MARKER = 'TODO(michael)'

// Netlify sets CONTEXT=production on production deploys only
// (deploy-preview and branch-deploy otherwise). CI and local builds don't set it.
export const isProductionBuild = (env = process.env) => env.CONTEXT === 'production'

function jsonFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? jsonFiles(path) : name.endsWith('.json') ? [path] : []
  })
}

// Walk a parsed JSON value and report the dotted path of every string holding the marker.
function findMarkers(value, path = '') {
  if (typeof value === 'string') return value.includes(MARKER) ? [path] : []
  if (Array.isArray(value)) return value.flatMap((v, i) => findMarkers(v, `${path}[${i}]`))
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => findMarkers(v, path ? `${path}.${k}` : k))
  return []
}

export function scanContent(contentDir, root) {
  return jsonFiles(contentDir).flatMap((file) =>
    findMarkers(JSON.parse(readFileSync(file, 'utf8'))).map((field) => ({ file: relative(root, file), field })),
  )
}

// Fails a production build while any content field still contains the marker.
export default function todoGuard() {
  let root
  return {
    name: 'todo-guard',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root)
      },
      'astro:build:start': () => {
        if (!isProductionBuild()) return
        const found = scanContent(join(root, 'src/content'), root)
        if (found.length === 0) return
        const lines = found.map((f) => `  ${f.file}: field "${f.field}"`).join('\n')
        throw new Error(
          `Production build blocked: ${found.length} content field(s) still contain ${MARKER}.\n${lines}\n` +
            `Replace each with the confirmed value before deploying to production.`,
        )
      },
    },
  }
}
