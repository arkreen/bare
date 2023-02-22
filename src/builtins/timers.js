const timers = module.exports = require('@pearjs/timers')

global.setTimeout = timers.setTimeout
global.clearTimeout = timers.clearTimeout

global.setInterval = timers.setInterval
global.clearInterval = timers.clearInterval

global.setImmediate = timers.setImmediate
global.clearImmediate = timers.clearImmediate

process
  .on('suspend', () => timers.pause())
  .on('resume', () => timers.resume())
