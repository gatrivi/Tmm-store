import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findSocialPage, injectSocialMetadata, socialPages } from './social-pages.mjs'

const rootDir = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

/** Social crawlers do not reliably execute the React SPA. */
function socialHtmlShells() {
  return {
    name: 'social-html-shells',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const meta = findSocialPage(url)
        if (!meta) return next()
        try {
          const raw = readFileSync(resolve(rootDir, 'index.html'), 'utf8')
          const transformed = await server.transformIndexHtml(url, injectSocialMetadata(raw, meta))
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(transformed)
        } catch { next() }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const meta = findSocialPage(url)
        if (!meta) return next()
        try {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(readFileSync(resolve(rootDir, `dist/${meta.output}`), 'utf8'))
        } catch { next() }
      })
    },
    closeBundle() {
      const builtIndex = readFileSync(resolve(rootDir, 'dist/index.html'), 'utf8')
      for (const meta of socialPages) {
        writeFileSync(resolve(rootDir, `dist/${meta.output}`), injectSocialMetadata(builtIndex, meta), 'utf8')
      }
    },
  }
}

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [socialHtmlShells(), react(), tailwindcss()],
  build: { rollupOptions: { input: { main: resolve(rootDir, 'index.html') } } },
})
