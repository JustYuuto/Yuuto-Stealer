const axios = require('axios');
const { getCookies } = require('../util/cookies');
const { writeFileSync } = require('fs');
const { tempFolder } = require('../index');
const { join } = require('path');
const cookies = getCookies();

const twitter = async () => {
  const findCookie = async (c) => (await cookies).find(cookie => cookie.host.includes('.twitter.com') && cookie.name === c).value;
  const { data: profile } = await axios.post('https://twitter.com/i/api/1.1/account/update_profile.json', {}, {
    headers: {
      Cookie: `ct0=${await findCookie('ct0')}; auth_token=${await findCookie('auth_token')}`,
      Host: 'twitter.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
      Accept: '*/*',
      'Accept-Language': 'fr-FR',
      'Accept-Encoding': 'gzip, deflate, br',
      Prefer: 'safe',
      authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-csrf-token': await findCookie('ct0'),
      'x-twitter-client-language': 'en',
      'x-twitter-active-user': 'yes',
      Origin: 'https://twitter.com',
      Connection: 'keep-alive',
      Referer: 'https://twitter.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    }
  });
  writeFileSync(join(tempFolder, 'Twitter.json'), JSON.stringify(profile));
};

twitter();
