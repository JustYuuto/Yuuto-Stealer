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
  let flagsArr = [];
  console.log(flags);
  /*switch (flags) {
    case 1 << 0:
      flagsArr.push('Staff'); break;
    case 1 << 1:
      flagsArr.push('Partner'); break;
    case 1 << 2:
      flagsArr.push('HypeSquad'); break;
    case 1 << 3:
      flagsArr.push('Bug Hunter (Level 1)'); break;
    case 1 << 6:
      flagsArr.push('HypeSquad (House 1)'); break;
    case 1 << 7:
      flagsArr.push('HypeSquad (House 2)'); break;
    case 1 << 8:
      flagsArr.push('HypeSquad (House 3)'); break;
    case 1 << 9:
      flagsArr.push('Early Supporter'); break;
    case 1 << 10:
      flagsArr.push('Team User'); break;
    case 1 << 14:
      flagsArr.push('Bug Hunter (Level 2)'); break;
    case 1 << 16:
      flagsArr.push('Verified Bot'); break;
    case 1 << 17:
      flagsArr.push('Verified Developer'); break;
    case 1 << 18:
      flagsArr.push('Certified Moderator'); break;
    case 1 << 19:
      flagsArr.push('Bot HTTP Interactions'); break;
    case 1 << 22:
      flagsArr.push('Active Developer'); break;
    default:
      return 'No Flags';
  }*/
  if (flags <= (1 << 0)) {
    flagsArr.push('Staff');
  }
  if (flags <= (1 << 1)) {
    flagsArr.push('Partner');
  }
  if (flags <= (1 << 2)) {
    flagsArr.push('HypeSquad');
  }
  if (flags <= (1 << 3)) {
    flagsArr.push('Bug Hunter (Level 1)');
  }
  if (flags <= (1 << 6)) {
    flagsArr.push('HypeSquad (House 1)');
  }
  if (flags <= (1 << 7)) {
    flagsArr.push('HypeSquad (House 2)');
  }
  if (flags <= (1 << 8)) {
    flagsArr.push('HypeSquad (House 3)');
  }
  if (flags <= (1 << 9)) {
    flagsArr.push('Early Supporter');
  }
  if (flags <= (1 << 10)) {
    flagsArr.push('Team User');
  }
  if (flags <= (1 << 14)) {
    flagsArr.push('Bug Hunter (Level 2)');
  }
  if (flags <= (1 << 16)) {
    flagsArr.push('Verified Bot');
  }
  if (flags <= (1 << 17)) {
    flagsArr.push('Verified Developer');
  }
  if (flags <= (1 << 18)) {
    flagsArr.push('Certified Moderator');
  }
  if (flags <= (1 << 19)) {
    flagsArr.push('Bot HTTP Interactions');
  }
  console.log(flags);
  console.log(1 << 22);
  console.log(flags <= (1 << 22));
  if (flags <= (1 << 22)) {
    flagsArr.push('Active Developer');
  }
  return flagsArr.join(', ');
};
