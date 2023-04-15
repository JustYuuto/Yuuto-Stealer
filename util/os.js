const { readdirSync, statSync } = require('fs');
const { join } = require('path');

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
