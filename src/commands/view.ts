import type { CommandModule } from 'yargs';
import { getConfig, makeCreator } from '../config';
import { DiscordRESTError } from 'slash-create';
import ansi from 'ansi-colors';
import { displayExpandedCommand } from '../display';
import logSymbols from 'log-symbols';
import { formatAutocompleteCommand, groupNames, handleRESTError } from '../util';
import { prompt } from 'enquirer';

export const viewCommand: CommandModule = {
  command: 'view [command]',
  describe: 'View a command on Discord',
  builder: (yargs) =>
    yargs
      .options({
        env: {
          describe: 'The environment to use',
          alias: 'e',
          type: 'string',
          group: groupNames.config
        },
        token: {
          describe: 'The token of the Discord bot',
          alias: 't',
          type: 'string',
          group: groupNames.config
        },
        'application-id': {
          describe: 'The application ID of the Discord bot',
          alias: 'i',
          type: 'string',
          group: groupNames.config
        },
        'guild-id': {
          describe: 'The guild to list from',
          alias: 'g',
          type: 'string',
          group: groupNames.opts
        },
        config: {
          describe: 'The path to the config file, defaults to slash-up.config.js',
          alias: 'c',
          type: 'boolean',
          group: groupNames.opts
        },
        debug: {
          describe: 'Whether to print debug logs',
          alias: 'd',
          type: 'boolean',
          group: groupNames.opts
        }
      })
      .positional('command', {
        description: 'The command to view',
        type: 'string'
      }),
  handler: async (argv) => {
    try {
      if (argv.guildId && !/^\d{17,19}$/.test(argv.guildId as string)) throw new Error('Invalid guild ID.');
      const config = await getConfig(argv);
      const creator = await makeCreator(config);
      const commands = await creator.api.getCommands(argv.guildId as string);
      if (commands.length === 0) return console.error(logSymbols.warning, ansi.yellow('No commands found.'));

      let command = commands.find((c) => c.id === argv.command || c.name === argv.command);
      if (!command && argv.command) throw new Error('Command not found.');
      else if (!command) {
        const { cmd } = await prompt<{ cmd: string }>({
          type: 'autocomplete',
          name: 'cmd',
          message: 'Enter a command to view:',
          limit: 10,
          choices: commands.map(formatAutocompleteCommand)
        } as any);
        command = commands.find((c) => formatAutocompleteCommand(c) === cmd);
      }

      return console.log(displayExpandedCommand(command!));
    } catch (err) {
      process.exitCode = 1;
      if (err instanceof DiscordRESTError) return handleRESTError(err);
      if (err === '') return console.error(logSymbols.error, ansi.red('Input cancelled.'));
      return console.error(logSymbols.error, ansi.red((err as any).message));
    }
  }
};
