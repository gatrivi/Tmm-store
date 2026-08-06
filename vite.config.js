import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

/** Serve dedicated HTML shells for OG crawlers (mirrors vercel.json rewrites). */
function demoHtmlShells() {
  const shells = [
    { prefix: '/demo/carniceria', file: 'demo-carniceria.html' },
    { prefix: '/demo/verduleria', file: 'demo-verduleria.html' },
  ]
  function match(url) {
    return shells.find(s => url === s.prefix || url.startsWith(`${s.prefix}/`))
  }
  return {
    name: 'demo-html-shells',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const hit = match(url)
        if (hit) {
          try {
            const raw = readFileSync(resolve(rootDir, hit.file), 'utf8')
            const html = await server.transformIndexHtml(url, raw)
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
            return
          } catch {
            next()
            return
          }
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const hit = match(url)
        if (hit) {
          try {
            res.setHeader('Content-Type', 'text/html')
            res.end(readFileSync(resolve(rootDir, `dist/${hit.file}`), 'utf8'))
            return
          } catch {
            /* fall through */
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    demoHtmlShells(),
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        carniceria: resolve(rootDir, 'demo-carniceria.html'),
        verduleria: resolve(rootDir, 'demo-verduleria.html'),
      },
    },
  },
})
