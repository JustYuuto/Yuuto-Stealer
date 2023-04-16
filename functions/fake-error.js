const { execSync } = require('child_process');

const title = 'Error';
const content = 'An error occurred while downloading files. Please try again later.';

const cmd = `mshta "javascript:var sh=new ActiveXObject('WScript.Shell'); sh.Popup('${content}', 0, '${title}', 16);close()"`;

execSync(cmd);
