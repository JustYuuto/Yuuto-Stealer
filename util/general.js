module.exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * @returns {boolean} `true` if it's running from the executable built or `false` if run from node
 */
module.exports.runningFromExecutable = () => {
  return process.argv0.endsWith('.exe') && !process.argv0.includes('node.exe') && !process.argv0.includes('electron.exe');
};
