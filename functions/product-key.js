const { spawnSync } = require('child_process');
const { removeSpaces, removeLineReturns } = require('../util/string');

const productKey = removeLineReturns(removeSpaces(spawnSync('wmic', ['csproduct', 'get', 'uuid']).stdout.toString().split('\n')[1]));
const backupProductKey = removeLineReturns(spawnSync('powershell', ['Get-ItemPropertyValue', '-Path', '\'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform\'', '-Name', 'BackupProductKeyDefault']).stdout.toString());

module.exports = { productKey, backupProductKey };
