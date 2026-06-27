import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-ros-state',
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
