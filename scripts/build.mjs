import ScriptLinker from 'script-linker'
import childProcess from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import includeStatic from 'include-static'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.dirname(__dirname)

const s = new ScriptLinker({
  bare: true,
  map (path) {
    return '<pearjs>' + path
  },
  mapResolve (req, basedir) {
    if (req === 'node-gyp-build') return '/lib/load-addon.js'
    return req
  },
  readFile (filename) {
    return fs.readFile(path.join(root, filename))
  }
})

const bundle = await s.bundle('/lib/bootstrap.js', {
  header: '(function (pear) {',
  footer: '//# sourceURL=<pearjs>/bootstrap.js\n})',
})

await fs.mkdir(path.join(root, 'build'), { recursive: true })

// just for debugging write the js file
await fs.writeFile(path.join(root, 'build/bootstrap.js'), bundle)
await fs.writeFile(path.join(root, 'build/bootstrap.h'), includeStatic('pear_bootstrap', Buffer.from(bundle)))

let proc = null

proc = childProcess.spawnSync('cmake', ['-S', '.', '-B', 'build', '-DCMAKE_BUILD_TYPE=Release'], {
  cwd: root,
  stdio: 'inherit'
})

if (proc.status) process.exit(proc.status)

proc = childProcess.spawnSync('cmake', ['--build', 'build'], {
  cwd: root,
  stdio: 'inherit'
})

if (proc.status) process.exit(proc.status)
