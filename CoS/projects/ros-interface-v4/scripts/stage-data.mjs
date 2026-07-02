/* stage-data — copies the live state.json into public/ so a *local* static build
   (`vite preview`) renders with real data.
   ⚠️ public/state.json is gitignored and confidential. NEVER deploy a public build
   that contains it — see DEPLOY.md. For the login-gated prod deploy the data is
   served via an auth-gated path, not a public static file. */
import fs from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, '../../guy-command-center/state.json')
const outDir = resolve(here, '../public')
fs.mkdirSync(outDir, { recursive: true })
fs.copyFileSync(src, resolve(outDir, 'state.json'))
console.log('[stage-data] staged state.json → public/ (LOCAL ONLY, gitignored — do NOT deploy publicly)')
