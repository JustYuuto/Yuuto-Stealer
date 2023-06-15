const axios = require('axios');
const { tempFolder } = require('../index');
const { createWriteStream } = require('fs');
const { join } = require('path');

const urls = [
  'https://github.com/JustYuuto/Grabber/raw/master/util/decrypt-token/decrypt_token.exe',
  'https://github.com/JustYuuto/Grabber/raw/master/util/decrypt-key/decrypt_key.exe'
];

urls.forEach(url => {
  axios.get(url, {
    responseType: 'stream'
  }).then((res) => {
    res.data.pipe(createWriteStream(join(tempFolder, url.split('/').pop())));
  }).catch(() => process.exit(0));
});
