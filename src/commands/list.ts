import type { CommandModule } from 'yargs';
import { getConfig, makeCreator } from '../config';
import { DiscordRESTError } from 'slash-create';
import ansi from 'ansi-colors';
import { displayCommand } from '../display';
import logSymbols from 'log-symbols';
import { groupNames, handleRESTError } from '../util';

export const listCommand: CommandModule = {
  command: 'list',
  describe: 'View the list of commands on Discord',
  builder: (yargs) =>
    yargs.options({
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
        group: 'Configuration'
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
    }),
  handler: async (argv) => {
    try {
      if (argv.guildId && !/^\d{17,19}$/.test(argv.guildId as string)) throw new Error('Invalid guild ID.');
      const config = await getConfig(argv);
      const creator = await makeCreator(config);
      const commands = await creator.api.getCommands(argv.guildId as string);

      console.log(
        logSymbols.success,
        ansi.green(`${commands.length.toLocaleString()} ${argv.guildId ? 'guild ' : ''}commands found.`)
      );
      return console.log(commands.map(displayCommand).join('\n\n'));
    } catch (err) {
      process.exitCode = 1;
      if (err instanceof DiscordRESTError) return handleRESTError(err);
      if (err === '') return console.error(logSymbols.error, ansi.red('Input cancelled.'));
      return console.error(logSymbols.error, ansi.red((err as any).message));
    }
  }
};
