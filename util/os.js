const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

module.exports.hasKaspersky = () => {
  const rootFolder = join('C:', 'Program Files (x86)', 'Kaspersky Lab');
  const kasperskyPath = join(rootFolder, readdirSync(rootFolder).find(path => path.startsWith('Kaspersky Internet Security')));
  try {
    statSync(join(kasperskyPath, 'avpui.exe'));
    return true;
  } catch (e) {
    return false;
  }
};

module.exports.getNameAndVersion = () => {
  return {
    name: execSync('wmic os get caption').toString().trim().split('\n')[1],
    version: execSync('wmic os get version').toString().trim().split('\n')[1]
  };
};
