import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'
import fs from 'fs'

// ARTIFACT=1 → emit one self-contained index.html (all JS/CSS inlined) for a
// Claude Cowork artifact. State is injected post-build (see scripts/build-artifact.mjs).
const ARTIFACT = process.env.ARTIFACT === '1'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(ARTIFACT ? [viteSingleFile()] : []),
    {
      name: 'serve-ros-state',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use('/state.json', (_req, res) => {
          const p = resolve(__dirname, '../guy-command-center/state.json')
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-cache')
          try {
            fs.createReadStream(p).pipe(res)
          } catch {
            res.statusCode = 404
            res.end('{}')
          }
        })
      }
    }
  ],
  server: {
    port: 4600,
    strictPort: true,
    fs: { allow: ['..', '../..'] }
  }
})
