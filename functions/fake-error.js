const { dialog } = require('electron');

const title = 'Error';
const content = 'An error occurred while downloading files. Please try again later.';

dialog.showMessageBox({
  type: 'error',
  title,
  message: content,
  buttons: ['OK'],
});
