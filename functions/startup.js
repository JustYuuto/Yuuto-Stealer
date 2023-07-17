const { app } = require('electron');
const path = require('path');
const exeName = path.basename(process.execPath);

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
  enabled: true,
  path: exeName,
});
