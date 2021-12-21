import type { CommandModule } from 'yargs';
import { stripIndent } from 'common-tags';
import path from 'path';
import fs from 'fs/promises';
import ansi from 'ansi-colors';
import logSymbols from 'log-symbols';
import { fileExists } from '../util';

const defaultConfig = stripIndent`
// This is the slash-up config file.
// Make sure to fill in "token" and "applicationId" before using.
// You can also use environment variables from the ".env" file if any.

module.exports = {
  // The Token of the Discord bot
  token: '',
  // The Application ID of the Discord bot
  applicationId: '',
  // This is where the path to command files are, .ts files are supported!
  commandsPath: './commands',
  // You can use different environments with --env (-e)
  env: {
    development: {
      // The "globalToGuild" option makes global commands sync to the specified guild instead.
      globalToGuild: process.env.GUILD_ID
    }
  }
}`;

export const configCommand: CommandModule = {
  command: 'config [dir]',
  describe: 'Create a config file in the specified directory',
  builder: (yargs) =>
    yargs.positional('dir', {
      description: 'The directory to create the config file in',
      type: 'string'
    }),
  handler: async (argv) => {
    const configFilePath = argv.dir ? path.join(argv.dir as string, 'slash-up.config.js') : 'slash-up.config.js';
    if (await fileExists(configFilePath)) return console.log(logSymbols.error, ansi.red('Config file already exists.'));
    await fs.writeFile(configFilePath, defaultConfig);
    console.log(logSymbols.success, ansi.green(`Created config file at ${configFilePath}`));
  }
};
