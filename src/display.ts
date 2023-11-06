import {
  ApplicationCommand,
  ApplicationCommandOption,
  ApplicationCommandType,
  CommandOptionType,
  Permissions,
  SlashCommand
} from 'slash-create';
import { stripIndents, oneLine } from 'common-tags';
import ansi from 'ansi-colors';
import { snowflakeToTimestamp } from './util';

export function displayCommandOption(option: ApplicationCommandOption): string {
  const isSubCommand =
    option.type === CommandOptionType.SUB_COMMAND || option.type === CommandOptionType.SUB_COMMAND_GROUP;
  return oneLine`
    ${
      isSubCommand
        ? ansi.bold(option.name)
        : `${ansi.green(option.name)}${!option.required ? ansi.magentaBright('?') : ''}${
            'autocomplete' in option && option.autocomplete ? ansi.blue('*') : ''
          }`
    }
    ${!isSubCommand ? ansi.cyan(CommandOptionType[option.type].toLowerCase()) : ''}
    - ${ansi[isSubCommand ? 'yellowBright' : 'white'](option.description)}
  `;
}

export function displayCommandHeader(command: ApplicationCommand): string {
  return stripIndents`
    ${oneLine`
      ${command.type === ApplicationCommandType.CHAT_INPUT ? ansi.dim('/') : ''}${ansi.bold(command.name)}
      ${command.description ? `- ${ansi.yellow(command.description!)}` : ''}
      ${
        !command.id && command.type === ApplicationCommandType.CHAT_INPUT
          ? ''
          : ansi.gray(
              `(${[
                command.type !== ApplicationCommandType.CHAT_INPUT ? ApplicationCommandType[command.type!] : '',
                command.id || ''
              ]
                .filter((v) => !!v)
                .join(', ')})`
            )
      }
    `}
  `;
}

export function displayCommand(command: ApplicationCommand): string {
  return `${displayCommandHeader(command)}${
    command.options
      ? '\n    ' +
        command.options
          .map((option) => {
            return `${displayCommandOption(option)}${
              'options' in option && option.options
                ? '\n        ' +
                  option.options
                    .map((option) => {
                      return `${displayCommandOption(option)}${
                        'options' in option && option.options
                          ? '\n            ' + option.options.map(displayCommandOption).join('\n            ')
                          : ''
                      }`;
                    })
                    .join('\n        ')
                : ''
            }`;
          })
          .join('\n    ')
      : ''
  }`;
}

export function displayProperty(name: string, value: any): string {
  return `    ${ansi.red(name)}: ${value}`;
}

export function displayLocalizations(name: string, value: { [lang: string]: string }): string {
  return (
    `    ${ansi.red(name)}:` +
    `      ${Object.keys(value)
      .map((lang) => `${lang}: ${value[lang]}`)
      .join('\n      ')}`
  );
}

export function displayExpandedCommand(command: ApplicationCommand): string {
  return `${[
    displayCommandHeader(command),
    displayProperty('Created At', new Date(snowflakeToTimestamp(command.id)).toLocaleString()),
    displayProperty('Last Updated', new Date(snowflakeToTimestamp(command.version)).toLocaleString()),
    command.default_permission === false ? displayProperty('Default Permission', command.default_permission) : '',
    command.nsfw === true ? displayProperty('NSFW', command.nsfw) : '',
    typeof command.dm_permission === 'boolean' ? displayProperty('DM Permission', command.dm_permission) : '',
    typeof command.default_member_permissions === 'string'
      ? displayProperty(
          'Default Member Permissions',
          new Permissions(command.default_member_permissions).toArray().join(', ')
        )
      : '',
    command.name_localizations ? displayLocalizations('Name Localizations', command.name_localizations) : '',
    command.description_localizations
      ? displayLocalizations('Description Localizations', command.description_localizations)
      : ''
  ]
    .filter((line) => !!line)
    .join('\n')}${
    command.options
      ? '\n\n    ' +
        command.options
          .map((option) => {
            return `${displayCommandOption(option)}${
              'options' in option && option.options
                ? '\n        ' +
                  option.options
                    .map((option) => {
                      return `${displayCommandOption(option)}${
                        'options' in option && option.options
                          ? '\n            ' + option.options.map(displayCommandOption).join('\n            ')
                          : ''
                      }`;
                    })
                    .join('\n        ')
                : ''
            }`;
          })
          .join('\n    ')
      : ''
  }`;
}

export function displayLocalCommand(command: SlashCommand): string {
  return `${[
    displayCommandHeader(
      ('toCommandJSON' in command ? command.toCommandJSON() : (command as any).commandJSON) as ApplicationCommand
    ),
    displayProperty('DM Permission', command.dmPermission),
    displayProperty('NSFW', command.nsfw),
    command.requiredPermissions
      ? displayProperty('Default Member Permissions', new Permissions(command.requiredPermissions).toArray().join(', '))
      : '',
    command.guildIDs?.length ? displayProperty('Guilds', command.guildIDs.join(', ')) : ''
  ]
    .filter((line) => !!line)
    .join('\n')}${
    command.options
      ? '\n\n    ' +
        command.options
          .map((option) => {
            return `${displayCommandOption(option)}${
              'options' in option && option.options
                ? '\n        ' +
                  option.options
                    .map((option) => {
                      return `${displayCommandOption(option)}${
                        'options' in option && option.options
                          ? '\n            ' + option.options.map(displayCommandOption).join('\n            ')
                          : ''
                      }`;
                    })
                    .join('\n        ')
                : ''
            }`;
          })
          .join('\n    ')
      : ''
  }`;
}
