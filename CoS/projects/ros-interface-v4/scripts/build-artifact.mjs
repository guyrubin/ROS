/* build-artifact — one command → one self-contained Claude Cowork artifact.
   Refreshes state, builds the single-file bundle, inlines the data, writes
   dist-artifact/ros-cockpit.html. Cross-platform (sets ARTIFACT in the child env,
   no cross-env needed). The artifact holds confidential data → private; gitignored. */
import fs from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const proj = resolve(here, '..')
const run = (cmd, env) => execSync(cmd, { cwd: proj, stdio: 'inherit', env: { ...process.env, ...env } })

console.log('[build-artifact] 1/3 refreshing state + backlogs…')
run('node ../guy-command-center/gen-state.mjs')
run('node ../guy-command-center/gen-backlogs.mjs')

console.log('[build-artifact] 2/3 single-file vite build…')
run('npx vite build', { ARTIFACT: '1' })

console.log('[build-artifact] 3/3 inlining state…')
let html = fs.readFileSync(resolve(proj, 'dist/index.html'), 'utf8')
const stateMin = JSON.stringify(JSON.parse(fs.readFileSync(resolve(proj, '../guy-command-center/state.json'), 'utf8'))).replace(/<\/script/gi, '<\/script')
const inject =
  '<script id="ros-state" type="application/json">' + stateMin + '</script>' +
  '<script>window.__ROS_STATE__=JSON.parse(document.getElementById("ros-state").textContent);</script>'
html = html.includes('</head>') ? html.replace('</head>', inject + '</head>') : inject + html

const outDir = resolve(proj, 'dist-artifact')
fs.mkdirSync(outDir, { recursive: true })
const out = resolve(outDir, 'ros-cockpit.html')
fs.writeFileSync(out, html)
console.log('[build-artifact] ✓ ' + out + ' (' + (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB, self-contained)')
