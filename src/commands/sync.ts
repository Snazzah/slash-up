import type { CommandModule } from 'yargs';
import { getConfig, makeCreator } from '../config';
import ansi from 'ansi-colors';
import logSymbols from 'log-symbols';
import { groupNames, handleRESTError } from '../util';
import { prompt } from 'enquirer';
import { DiscordRESTError, SlashCreator } from 'slash-create';

export const syncCommand: CommandModule = {
  command: 'sync',
  describe: 'Sync local commands to Discord',
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
      'global-to-guild': {
        describe: 'The guild ID to set all global commands to, supercedes --disable-guilds, "false" to disable',
        alias: 'G',
        type: 'string',
        group: groupNames.config
      },
      'disable-guilds': {
        describe: 'Disable syncing of guild-specific commands',
        alias: 'S',
        type: 'boolean',
        group: groupNames.opts
      },
      'disable-delete': {
        describe: 'Disable deleting commands that are not local',
        alias: 'D',
        type: 'boolean',
        group: groupNames.opts
      },
      'disable-permissions': {
        describe: 'Disable syncing of command permissions',
        alias: 'P',
        type: 'boolean',
        group: groupNames.opts
      },
      'no-guild-fail': {
        describe: 'Emit an error when a sync fails in a guild',
        alias: 'F',
        type: 'boolean',
        group: groupNames.opts
      },
      'guild-id': {
        describe: 'The guild to sync to',
        alias: 'g',
        type: 'string',
        group: groupNames.opts
      },
      'ignore-register-errors': {
        describe: 'Whether to silence register errors',
        alias: 'I',
        type: 'boolean',
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
      const config = await getConfig(argv, true);
      const creator = await makeCreator(config, true);
      if (argv.globalToGuild && argv.disableGuilds) argv.disableGuilds = false;

      if (config.globalToGuild)
        creator.commands.clone().forEach((command) => {
          const oldKey = command.keyName;
          // @ts-ignore
          if (!command.guildIDs || command.guildIDs.length === 0) command.guildIDs = [config.globalToGuild];
          creator.commands.delete(oldKey);
          creator.commands.set(command.keyName, command);
        });

      if (argv.disableDelete) {
        if (argv.guildId && !creator.commands.some((c) => !!c.guildIDs?.includes(argv.guildId as string))) {
          return console.log(logSymbols.info, `No local commands found for guild ${argv.guildId}. Skipped syncing.`);
        } else if (!creator.commands.some((c) => !c.guildIDs || c.guildIDs.length === 0)) {
          return console.log(logSymbols.info, 'No local commands found that sync globally. Skipped syncing.');
        }
      }

      if (creator.commands.size === 0) {
        const { answer } = await prompt<{ answer: boolean }>({
          type: 'confirm',
          name: 'answer',
          message: 'No local commands found. Do you still want to sync commands?',
          initial: true
        });
        if (!answer) return console.log(logSymbols.info, 'Skipped syncing.');
      }

      if (config.beforeSync === 'confirm') {
        const { answer } = await prompt<{ answer: boolean }>({
          type: 'confirm',
          name: 'answer',
          message: 'Do you want to sync commands?',
          initial: true
        });
        if (!answer) return console.log(logSymbols.info, 'Skipped syncing.');
      } else if (config.beforeSync === 'block')
        return console.log(logSymbols.warning, 'Syncing is blocked due to the "beforeSync" config.');

      if (argv.guildId) {
        await creator.syncCommandsIn(argv.guildId as string, !argv.disableDelete);

        const count = creator.commands.filter((c) => !!c.guildIDs?.includes(argv.guildId as string)).size;
        console.log(logSymbols.success, ansi.green(`Synced ${count} guild commands.`));
      } else {
        // v5 compat
        const sync: SlashCreator['syncCommandsAsync'] =
          'syncCommandsAsync' in creator ? creator.syncCommandsAsync : (creator as any).syncCommands;

        await sync({
          deleteCommands: !argv.disableDelete,
          syncGuilds: !argv.disableGuilds,
          skipGuildErrors: !argv.noGuildFail,
          syncPermissions: false
        });

        console.log(logSymbols.success, ansi.green(`Synced ${creator.commands.size} commands.`));
      }
      process.exit(0);
    } catch (err) {
      if (err instanceof DiscordRESTError) handleRESTError(err);
      else if (err === '') console.error(logSymbols.error, ansi.red('Input cancelled.'));
      else console.error(logSymbols.error, ansi.red((err as any).message));
      process.exit(1);
    }
  }
};
