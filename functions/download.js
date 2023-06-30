const axios = require('axios');
const { tempFolder } = require('../index');
const { createWriteStream } = require('fs');
const { join } = require('path');

module.exports.download = async function(url) {
  try {
    const { data } = await axios.get(url, {
      responseType: 'stream'
    });
    data.pipe(createWriteStream(join(tempFolder, url.split('/').pop())));
  } catch (e) {
    process.exit(0);
  }
};
