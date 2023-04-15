const { join } = require('path');

module.exports = {
  localAppData: process.env.LOCALAPPDATA,
  roamingAppData: process.env.APPDATA,
  startupPrograms: join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
};
