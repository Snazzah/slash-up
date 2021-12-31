import findUp from 'find-up';
import { prompt } from 'enquirer';
import dotenv from 'dotenv';
import path from 'path';
import ansi from 'ansi-colors';
import { SlashCreator } from 'slash-create';
import fs from 'fs/promises';
import { transpileModule } from 'typescript';
import logSymbols from 'log-symbols';

interface Argv {
  [argName: string]: unknown;
  _: (string | number)[];
  $0: string;
  env?: string;
  token?: string;
  globalToGuild?: string;
  applicationId?: string;
  commandPath?: string;
  beforeSync?: string;
  debug?: boolean;
  config?: string;
}

interface Config {
  token: string;
  applicationId: string;
  commandPath?: string;
  globalToGuild?: string;
  beforeSync?: string;
  debug?: boolean;
}

interface ConfigFile extends Config {
  env?: { [env: string]: Config };
}

export async function getConfig(argv: Argv, requireCommandPath = false): Promise<Config> {
  const config: Partial<Config> = {
    token: argv.token,
    applicationId: argv.applicationId,
    globalToGuild: argv.globalToGuild,
    debug: argv.debug
  };
  const configFilePath = argv.config || (await findUp('slash-up.config.js'));
  if (configFilePath) {
    const envFile = await findUp('.env');
    if (envFile) dotenv.config({ path: envFile });
    const configFile: ConfigFile = require(configFilePath);
    if (argv.env && configFile.env && configFile.env[argv.env]) {
      config.token = config.token || configFile.env[argv.env].token;
      config.applicationId = config.applicationId || configFile.env[argv.env].applicationId;
      config.globalToGuild = config.globalToGuild || configFile.env[argv.env].globalToGuild;
      config.commandPath = config.commandPath || configFile.env[argv.env].commandPath;
      config.debug = config.debug === undefined ? configFile.env[argv.env].debug : config.debug;
      config.beforeSync = config.beforeSync || configFile.env[argv.env].beforeSync;
    }
    config.token = config.token || configFile.token;
    config.applicationId = config.applicationId || configFile.applicationId;
    config.globalToGuild = config.globalToGuild || configFile.globalToGuild;
    config.commandPath = config.commandPath || configFile.commandPath;
    config.debug = config.debug === undefined ? configFile.debug : config.debug;
    config.beforeSync = config.beforeSync || configFile.beforeSync;
  }

  if (!config.applicationId) {
    const { applicationId } = await prompt<{ applicationId: string }>({
      type: 'input',
      name: 'applicationId',
      message: 'Enter your Discord bot application ID'
    });
    config.applicationId = applicationId;
  }

  if (!config.token) {
    const { token } = await prompt<{ token: string }>({
      type: 'password',
      name: 'token',
      message: 'Enter your Discord bot token'
    });
    config.token = token;
  }

  if (config.commandPath)
    config.commandPath = path.join(configFilePath ? path.dirname(configFilePath) : process.cwd(), config.commandPath);
  else if (!config.commandPath && requireCommandPath) {
    const { commandPath } = await prompt<{ commandPath: string }>({
      type: 'input',
      name: 'commandPath',
      message: 'Enter the path to your commands'
    });
    config.commandPath = path.join(process.cwd(), commandPath);
  }

  if (!/^\d{17,19}$/.test(config.applicationId)) throw new Error('Invalid application ID.');
  if (config.commandPath) {
    if (!(await fs.stat(config.commandPath)).isDirectory()) throw new Error('Invalid command path.');
  }
  if (config.globalToGuild === 'false') delete config.globalToGuild;

  return config as Config;
}

export async function makeCreator(config: Config, loadCommands = false) {
  const creator = new SlashCreator({
    token: config.token,
    applicationID: config.applicationId
  });
  creator.on('warn', (m) => console.error(logSymbols.warning, m));
  if (config.debug) creator.on('debug', (m) => console.log(ansi.magenta('debug '), m));
  if (config.commandPath && loadCommands) {
    const files = (await getFiles(config.commandPath)).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
    for (const file of files) {
      try {
        const mod = file.endsWith('.ts')
          ? eval(transpileModule(await fs.readFile(file, { encoding: 'utf-8' }), {}).outputText)
          : require(file);
        if (!mod) continue;
        try {
          creator.registerCommand(mod);
        } catch (e) {
          /* Ignore */
        }
      } catch (e) {
        console.error(logSymbols.error, ansi.underline.red('Failed to load command at file:'), file);
        throw e;
      }
    }
  }
  return creator;
}

export async function getFiles(folderPath: string) {
  const fileList = await fs.readdir(folderPath);
  const files: string[] = [];
  for (const file of fileList) {
    const filePath = path.join(folderPath, file);
    const stat = await fs.lstat(filePath);
    if (stat.isDirectory()) files.push(...(await getFiles(filePath)));
    else files.push(filePath);
  }
  return files;
}
