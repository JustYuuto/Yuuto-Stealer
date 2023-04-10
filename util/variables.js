const os = require('os');
const { isDarwin, isWindows } = require('./os');

const { homedir } = os.userInfo();
const roamingAppData = process.env.APPDATA || (isDarwin() ? `${homedir}/Library/Preferences` : `${homedir}/.local/share`);

module.exports = {
  paths: {
    localAppData: process.env.LOCALAPPDATA, roamingAppData,
    startupPrograms: (() => {
      if (isDarwin()) {
        // https://www.developerfiles.com/location-of-startup-items-and-applications-on-mac-os-x/
        return `${homedir}/Library/StartupItems`;
      } else if (isWindows()) {
        return `${roamingAppData}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\`;
      }
    })()
  }
};
