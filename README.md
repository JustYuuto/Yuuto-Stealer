# Token Grabber

Didn't find a better name for it.

--------------------------

## Functionalities

Some of these functionalities are customisable in the [`config.js`](config.js) file.

Items in bold are functionalities you can get hyped with!

* Works on both Windows, Linux and macOS
* Can add itself to startup programs
* Can get IP info using an API
* Can get OS info, like RAM, CPUs, Kernel version
* Can get Windows product key
* Can kill Discord
* **Can take a screenshot of all monitors**
* **Can get Chrome-based browsers logins and passwords, credit cards, cookies, history** 
* Can get Minecraft[*](#minecraft-launchers-that-the-grabber-try-to-get-login-infos) and Roblox login
* Can trigger a BSOD if the grabber is run from a virtual machine
* **Can get Discord token (killing the Discord client is not needed)**
* **Can auto-buy Nitro as soon as the user has launched the grabber** (only works if the user have a payment method attached to their Discord account)

All that are sent to a Discord webhook. 

## Building

Use this command:

```bash
yarn build
```

This will build the Chrome-based browsers encryption key decryptor, the Discord token decryptor, build the icon to a ``.ico`` file, and then build the final exe.

> The EXE build can be **very long** (about 20 minutes), so be very patient ^^

## Notes

### Minecraft Launchers that the grabber try to get login infos:

* Minecraft Launcher (the official one)

## Responsability

I, Yuuto, and other contributors, will not accept any responsability case for damage done using this tool. This was made for educational and demonstration purposes only.
