const Module = require('module')
const path = require('path')

const argv = require('minimist')(process.argv.slice(1), {
  stopEarly: true,
  boolean: [
    'version',
    'help'
  ],
  string: [
    'import-map'
  ],
  alias: {
    version: 'v',
    help: 'h',
    'import-map': 'm'
  }
})

const argc = argv._.length

process.argv.splice(1, argc, ...argv._)

if (argv.v) {
  const pkg = require('../package.json')

  console.log(`v${pkg.version}`)

  process.exit()
}

if (argv.h) {
  console.log('usage: bare [-m, --import-map <path>] [<filename>]')

  process.exit(argv.h || argc > 0 ? 0 : 1)
}

if (argv.m) {
  const { exports: map } = Module.load(
    Module.resolve(path.resolve(process.cwd(), argv.m))
  )

  if (map && map.imports) {
    for (const [from, to] of Object.entries(map.imports)) {
      if (/^([a-z]:)?([/\\]|\.{1,2}[/\\]?)/.test(to)) {
        Module._imports[from] = path.resolve(process.cwd(), path.dirname(argv.m), to)
      } else {
        Module._imports[from] = to
      }
    }
  }
}

if (argc === 0) {
  const REPL = require('bare-repl')
  const repl = new REPL()
  repl.start()
} else {
  Module.load(
    process.argv[1] = Module.resolve(
      path.resolve(process.cwd(), process.argv[1])
    )
  )
}
