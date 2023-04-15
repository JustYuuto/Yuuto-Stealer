module.exports.nitroSubscriptionType = (type) => {
  switch (type) {
    case 0:
      return 'No Nitro Subscription';
    case 1:
      return 'Nitro Classic';
    case 2:
      return 'Nitro';
    case 3:
      return 'Nitro Basic';
    default:
      return 'Unknown Nitro Subscription';
  }
};

module.exports.billingType = (type) => {
  switch (type) {
    case 1:
      return 'Credit Card';
    case 2:
      return 'PayPal';
    default:
      return 'Unknown';
  }
};

module.exports.accountFlags = (flags) => {
  const badges = {
    Discord_Employee: {
      value: 1 << 0, // 1
      emoji: 'Discord Employee',
      rare: true
    },
    Partnered_Server_Owner: {
      value: 1 << 1, // 2
      emoji: 'Partnered Server Owner',
      rare: true
    },
    HypeSquad_Events: {
      value: 1 << 2, // 4
      emoji: 'HypeSquad Events',
      rare: true
    },
    Bug_Hunter_Level_1: {
      value: 1 << 3, // 8
      emoji: 'Bug_Hunter_Level_1:1096801975758233600',
      rare: true
    },
    Early_Supporter: {
      value: 1 << 9, // 512
      emoji: 'Early_Supporter:1096801974541893743',
      rare: true
    },
    Bug_Hunter_Level_2: {
      value: 1 << 14, // 16384
      emoji: 'Bug_Hunter_Level_2:1096801977788284948',
      rare: true
    },
    Verified_Bot_Developer: {
      value: 1 << 17, // 131072
      emoji: 'Verified_Bot_Developer:1096802086575939595',
      rare: true
    },
    House_Bravery: {
      value: 1 << 6, // 64
      emoji: 'HypeSquad_Bravery:1096802037137686590',
      rare: false
    },
    House_Brilliance: {
      value: 1 << 7, // 128
      emoji: 'HypeSquad_Brilliance:1096802032620425296',
      rare: false
    },
    House_Balance: {
      value: 1 << 8, // 256
      emoji: 'HypeSquad_Balance:1096802036286242889',
      rare: false
    },
    Active_Developer: {
      value: 1 << 22, // 4194304
      emoji: 'Active Developer',
      rare: false
    }
  };

  const result = [];
  for (let prop in badges) {
    prop = badges[prop];
    if ((flags & prop.value) === prop.value) result.push(`<:${prop.emoji}>`);
  }
  return result.join(' ');
};

module.exports.avatarURL = (id, avatar) => {
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}`;
};
