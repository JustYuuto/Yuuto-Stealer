const { spawnSync } = require('child_process');

const productKey = spawnSync('wmic', ['csproduct', 'get', 'uuid']).stdout.toString().split('\n')[1].trim();
const backupProductKey = spawnSync('powershell', ['Get-ItemPropertyValue', '-Path', '\'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform\'', '-Name', 'BackupProductKeyDefault']).stdout.toString().trim();

module.exports = { productKey, backupProductKey };
