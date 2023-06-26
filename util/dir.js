const { generateString } = require('./string');
const os = require('os');
const { join } = require('path');
const { openSync, existsSync } = require('fs');
const { sleep } = require('./general');
const fs = require('fs');

module.exports.randomFileCreator = (dir = os.tmpdir()) => {
  const path = join(dir, generateString(32));
  openSync(path, 777);
  return path;
};

module.exports.searchForFile = async (path, retryInterval, maxRetries = 5, currentRetry = 0) => {
  if (currentRetry > maxRetries) { return; }
  if (!existsSync(path)) {
    sleep(retryInterval).then(() => {
      return this.searchForFile(path, retryInterval, maxRetries, currentRetry + 1);
    });
  } else {
    return fs.readFileSync(path).toString();
  }
};
