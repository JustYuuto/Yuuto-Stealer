// https://gist.github.com/khaledosman/205e079bfbc1df34f08d6fedc330445b
const fs = require('fs');
const { join, parse } = require('path');
const JSZip = require('jszip');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

const addFilesToZip = (jsZip, directoryPath, filesToInclude) => {
  const promiseArr = filesToInclude.map(async file => {
    const filePath = join(directoryPath, file);
    try {
      const fileStats = await lstat(filePath);
      const isDirectory = fileStats.isDirectory();
      if (isDirectory) {
        const directory = jsZip.folder(file);
        const subFiles = await readDir(filePath);
        return addFilesToZip(directory, filePath, subFiles);
      } else {
        const fileContent = await readFile(filePath);
        return jsZip.file(file, fileContent);
      }
    } catch (e) {
      return Promise.resolve();
    }
  });
  return Promise.all(promiseArr);
};

const createZipFromFiles = async (directoryPaths, filesToInclude, dontCreateTopLevelFolder = false) => {
  const jsZip = new JSZip();
  await Promise.all(
    directoryPaths.map(directoryPath => {
      const parsed = parse(directoryPath);
      const folder = dontCreateTopLevelFolder ? jsZip : jsZip.folder(parsed.base);
      return addFilesToZip(folder, directoryPath, filesToInclude);
    })
  );
  return jsZip;
};

module.exports.generateZipFromFiles = (directoryPaths, filesToInclude, outputPath) => {
  return new Promise((resolve) => {
    createZipFromFiles(directoryPaths, filesToInclude, true).then(jsZip => {
      jsZip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(outputPath))
        .on('finish', () => resolve(outputPath));
    });
  });
};
