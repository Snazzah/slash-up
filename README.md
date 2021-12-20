<div align="center">

<img src="https://get.snaz.in/5uCf4Qg.svg" height="50">

[![NPM version](https://img.shields.io/npm/v/slash-up?maxAge=3600)](https://www.npmjs.com/package/slash-up) [![NPM downloads](https://img.shields.io/npm/dt/slash-up?maxAge=3600)](https://www.npmjs.com/package/slash-up) [![ESLint status](https://github.com/Snazzah/slash-up/workflows/ESLint/badge.svg)](https://github.com/Snazzah/slash-up/actions?query=workflow%3A%22ESLint%22) [![DeepScan grade](https://deepscan.io/api/teams/11596/projects/19549/branches/510637/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11596&pid=19549&bid=510637) [![discord chat](https://img.shields.io/discord/311027228177727508?logo=discord&logoColor=white)](https://snaz.in/discord)

CLI to view Discord commands and sync commands with [slash-create](https://github.com/Snazzah/slash-create).


</div>

![](https://get.snaz.in/8BY7i6M.png)

```
slash-up <command>

Commands
  slash-up list                    View the list of commands on Discord
  slash-up view [command]          View a command on Discord
  slash-up local                   View the list of local commands
  slash-up sync                    Sync local commands to Discord
  slash-up init [template] [dest]  Clone a slash-create template into a new directory
  slash-up config [dir]            Create a config file in the specified directory

Other Options
  -h, --help     Show usage information & exit                                             [boolean]
  -v, --version  Show version number & exit                                                [boolean]
```

## Config
Config files are taken from `slash-up.config.js` file or the file set from `--config` flag. You can create a config template file from `npx slash-up config`.
| Property | Type | Description |
|----------|------|-------------|
| token | `string` | The token of the Discord bot |
| applicationId | `string` | The application ID of the Discord bot |
| commandPath | `string` | The path to the local commands directory |
| globalToGuild | `string`? | The guild ID to set all global commands to when syncing, best for development environments |
| beforeSync | `'block'/'confirm'`? | What to do before syncing, 'confirm' prompts you before syncing |
| env | `object`? | An object with keys as environment names and values as configs. You can use `--env (-e)` to use an environment's config |


## Useful Links
- [slash-create](https://github.com/Snazzah/slash-create)
- [GitHub](https://github.com/Snazzah/slash-up)
- [NPM](https://www.npmjs.com/package/slash-up)

<div align="center">
    <a target="_blank" href="https://snaz.in/discord" title="Join the Discord!">
        <img  src="https://discordapp.com/api/guilds/311027228177727508/widget.png?style=banner2" height="76px" draggable="false" alt="Join the Discord!">
    </a>
</div>
