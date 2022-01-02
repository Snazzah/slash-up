import type { CommandModule } from 'yargs';
import { getConfig, makeCreator } from '../config';
import ansi from 'ansi-colors';
import { displayLocalCommand } from '../display';
import logSymbols from 'log-symbols';
import { groupNames } from '../util';

export const localCommand: CommandModule = {
  command: 'local',
  describe: 'View the list of local commands',
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
        group: groupNames.config
      },
      'command-path': {
        describe: 'The path to the command directory',
        alias: 'C',
        type: 'string',
        group: groupNames.config
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
      const config = await getConfig(argv, true);
      const creator = await makeCreator(config, true);

      console.log(logSymbols.success, ansi.green(`${creator.commands.size.toLocaleString()} local commands found.`));
      return console.log(creator.commands.map(displayLocalCommand).join('\n\n'));
    } catch (err) {
      process.exitCode = 1;
      if (err === '') return console.error(logSymbols.error, ansi.red('Input cancelled.'));
      return console.error(logSymbols.error, ansi.red((err as any).message));
    }
  }
};
