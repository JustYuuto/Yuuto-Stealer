module.exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.runningFromExecutable = () => {
  return process.argv0.endsWith('.exe') && !process.argv0.includes('node.exe');
};
