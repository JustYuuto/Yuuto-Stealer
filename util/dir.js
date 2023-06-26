const { generateString } = require('./string');
const os = require('os');
const { join } = require('path');
const { openSync, existsSync } = require('fs');
const { sleep } = require('./general');

module.exports.randomFileCreator = (dir = os.tmpdir()) => {
  const path = join(dir, generateString(32));
  openSync(path, 777);
  return path;
};

module.exports.searchForFile = async (path, retryInterval) => {
  if (!existsSync(path)) {
    await sleep(retryInterval);
    this.searchForFile(path, retryInterval);
  } else {
    return true;
  }
};
