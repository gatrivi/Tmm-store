import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

/** Serve carnicería HTML shell for OG crawlers (mirrors vercel.json rewrite). */
function carniceriaHtmlShell() {
  const shell = resolve(rootDir, 'demo-carniceria.html')
  return {
    name: 'carniceria-html-shell',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url === '/demo/carniceria' || url.startsWith('/demo/carniceria/')) {
          try {
            const raw = readFileSync(shell, 'utf8')
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
        if (url === '/demo/carniceria' || url.startsWith('/demo/carniceria/')) {
          try {
            res.setHeader('Content-Type', 'text/html')
            res.end(readFileSync(resolve(rootDir, 'dist/demo-carniceria.html'), 'utf8'))
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
    carniceriaHtmlShell(),
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        carniceria: resolve(rootDir, 'demo-carniceria.html'),
      },
    },
  },
})
