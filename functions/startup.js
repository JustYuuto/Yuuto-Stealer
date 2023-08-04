const { app } = require('electron');

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
  enabled: true,
  path: process.execPath
});
