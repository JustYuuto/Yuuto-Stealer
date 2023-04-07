module.exports.nitroSubscriptionType = (type) => {
  switch (type) {
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
