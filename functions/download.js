const axios = require('axios');
const { createWriteStream } = require('fs');
const { join } = require('path');
const { getTempFolder } = require('../util/init');

module.exports.download = async function(url) {
  try {
    const { data } = await axios.get(url, {
      responseType: 'stream'
    });
    data.pipe(createWriteStream(join(getTempFolder(), url.split('/').pop())));
  } catch (e) {
    process.exit(0);
  }
};
