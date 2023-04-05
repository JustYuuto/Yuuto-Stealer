const wifi = require('node-wifi');

wifi.init();

wifi.scan().then(networks => {
  console.log(networks);
});