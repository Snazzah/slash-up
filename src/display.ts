import {
  ApplicationCommand,
  ApplicationCommandOption,
  ApplicationCommandType,
  CommandOptionType,
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

export function displayExpandedCommand(command: ApplicationCommand): string {
  return `${[
    displayCommandHeader(command),
    displayProperty('Created At', new Date(snowflakeToTimestamp(command.id)).toLocaleString()),
    displayProperty('Last Updated', new Date(snowflakeToTimestamp(command.version)).toLocaleString()),
    displayProperty('Default Permission', command.default_permission)
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
    displayCommandHeader(command.commandJSON as ApplicationCommand),
    displayProperty('Default Permission', command.defaultPermission),
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
