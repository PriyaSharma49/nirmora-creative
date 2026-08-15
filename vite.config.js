import 'dotenv/config'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The /api/*.js files are written as Vercel serverless functions
// (`export default function handler(req, res)`), which only run when
// deployed to Vercel or under `vercel dev`. Plain `vite dev` has no idea
// those files are executable routes — it just serves their source text on
// GET and 404s everything else, which is exactly why every fetch to
// /api/contact or /api/bookings/* was failing locally (the frontend's
// `.json()` call throws on non-JSON, landing in the generic catch-block
// error). This dev-only middleware actually imports and invokes the
// matching handler, so the real Supabase/Apps Script/Sheets code path runs
// locally too. `apply: 'serve'` means it never touches the production
// build — Vercel handles /api natively there, unaffected by this file.
function vercelApiDevMiddleware() {
  return {
    name: 'vercel-api-dev-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()

        const url = new URL(req.url, 'http://localhost')
        const routePath = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '')
        const apiDir = path.join(process.cwd(), 'api')
        const candidates = [
          path.join(apiDir, `${routePath}.js`),
          path.join(apiDir, routePath, 'index.js'),
        ]
        const filePath = candidates.find((p) => existsSync(p))
        if (!filePath) return next()

        try {
          const mod = await server.ssrLoadModule(filePath)
          const handler = mod.default
          if (typeof handler !== 'function') return next()

          req.query = Object.fromEntries(url.searchParams)

          if (req.method !== 'GET' && req.method !== 'HEAD') {
            req.body = await new Promise((resolve, reject) => {
              let data = ''
              req.on('data', (chunk) => { data += chunk })
              req.on('end', () => {
                if (!data) return resolve({})
                try {
                  resolve(JSON.parse(data))
                } catch {
                  resolve({})
                }
              })
              req.on('error', reject)
            })
          }

          res.status = (code) => { res.statusCode = code; return res }
          res.json = (body) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }

          await handler(req, res)
        } catch (err) {
          console.error(`[api dev middleware] ${req.url} threw:`, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, message: 'Internal error (dev middleware).' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), vercelApiDevMiddleware()],
})
