import logSymbols from 'log-symbols';
import ansi from 'ansi-colors';
import { ApplicationCommand, ApplicationCommandType, DiscordRESTError } from 'slash-create';
import fs from 'fs/promises';

export const DISCORD_EPOCH = 1_420_070_400_000;

export const groupNames = {
  opts: 'Options',
  config: 'Configuration',
  util: 'Utility'
};

export function handleRESTError(err: DiscordRESTError): void {
  if (err.response.message === '401: Unauthorized') {
    return console.error(
      logSymbols.error,
      ansi.red('The token provided is invalid. Make sure the token and application ID are correct.')
    );
  } else if (err.response.code === 10002)
    return console.error(logSymbols.error, ansi.red('This application ID does not exist.'));
  else if (err.response.code === 50001)
    return console.error(logSymbols.error, ansi.red('This bot does not have access to this guild.'));
}

export function formatAutocompleteCommand(command: ApplicationCommand) {
  return `${command.type === ApplicationCommandType.CHAT_INPUT ? '/' : `[${ApplicationCommandType[command.type!]}]`}${
    command.name
  }`;
}

export function snowflakeToTimestamp(snowflake: string): number {
  return Number(BigInt(snowflake) >> 22n) + DISCORD_EPOCH;
}

export async function fileExists(file: string) {
  try {
    await fs.access(file);
    return true;
  } catch (err) {
    return false;
  }
}
