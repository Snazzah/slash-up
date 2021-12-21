import type { CommandModule } from 'yargs';
import { fileExists, groupNames } from '../util';
import degit from 'degit';
import { prompt } from 'enquirer';
import ansi from 'ansi-colors';
import logSymbols from 'log-symbols';
import spawn from 'cross-spawn';
import fs from 'fs/promises';
import path from 'path';

interface Template {
  name: string;
  aliases: string[];
  repo: string;
}

const templates: Template[] = [
  {
    name: 'JavaScript',
    aliases: ['js', 'javascript'],
    repo: 'Snazzah/slash-create-template#master'
  },
  {
    name: 'TypeScript',
    aliases: ['ts', 'typescript'],
    repo: 'Snazzah/slash-create-template#typescript'
  },
  {
    name: 'Vercel',
    aliases: ['vercel'],
    repo: 'Snazzah/slash-create-vercel'
  },
  {
    name: 'Cloudflare Worker',
    aliases: ['worker', 'cfworker', 'cloudflare-worker', 'cloudflare'],
    repo: 'Snazzah/slash-create-worker'
  }
];

export const initCommand: CommandModule = {
  command: 'init [template] [dest]',
  describe: 'Clone a slash-create template into a new directory',
  builder: (yargs) =>
    yargs
      .options({
        force: {
          describe: 'Overwrite existing files?',
          alias: 'f',
          type: 'boolean',
          default: false,
          group: groupNames.config
        },
        cache: {
          describe: 'Use cached version?',
          alias: 'c',
          type: 'boolean',
          default: false,
          group: groupNames.config
        },
        debug: {
          describe: 'Whether to print debug logs',
          alias: 'd',
          type: 'boolean',
          group: groupNames.opts
        }
      })
      .positional('template', {
        description: 'Which template to use',
        type: 'string'
      })
      .positional('dest', {
        description: 'The directory to create the template in',
        type: 'string'
      }),
  handler: async (argv) => {
    try {
      if (!argv.template) {
        const options = await prompt<{ template: string; dest: string }>([
          {
            type: 'select',
            name: 'template',
            message: 'Template to clone?',
            choices: templates.map((t) => t.name)
          },
          {
            type: 'input',
            name: 'dest',
            message: 'Destination directory?',
            initial: '.'
          }
        ]);

        const empty = !(await fileExists(options.dest)) || (await fs.readdir(options.dest)).length === 0;

        if (!empty) {
          const { force } = await prompt<{ force: boolean }>([
            {
              type: 'confirm',
              name: 'force',
              message: 'Overwrite existing files?'
            }
          ]);
          if (!force) return console.error(logSymbols.error, 'Aborted.');
          argv.force = true;
        }

        argv.template = options.template;
        argv.dest = options.dest;
      }

      const template = templates.find(
        (t) => t.name === argv.template || t.aliases.includes((argv.template as string).toLowerCase())
      );
      if (!template) return console.error(logSymbols.error, `Unknown template ${argv.template}.`);

      const { pm } = await prompt<{ pm: string }>([
        {
          type: 'select',
          name: 'pm',
          message: 'Which package manager do you use?',
          choices: ['npm', 'yarn', 'pnpm']
        }
      ]);

      const d = degit(template.repo, {
        force: argv.force as boolean,
        cache: argv.cache as boolean
      });

      d.on('info', (event) => {
        console.log(logSymbols.info, event.message.replace('options.', '--'));
      });

      d.on('warn', (event) => {
        console.error(logSymbols.warning, ansi.yellow(event.message.replace('options.', '--')));
      });

      await d.clone(argv.dest as string);

      spawn.sync(pm, ['install'], {
        cwd: argv.dest as string,
        stdio: 'inherit'
      });

      const envExists = await fileExists(path.join(argv.dest as string, '.env.example'));
      if (envExists)
        await fs.rename(path.join(argv.dest as string, '.env.example'), path.join(argv.dest as string, '.env'));

      console.log(logSymbols.success, `Created a ${template.name} project in ${path.resolve(argv.dest as string)}`);
      if (envExists)
        console.log(logSymbols.info, `Make sure to edit the '.env' file to set your environment variables.`);
    } catch (err) {
      process.exitCode = 1;
      if (err === '') return console.error(logSymbols.error, ansi.red('Input cancelled.'));
      return console.error(logSymbols.error, ansi.red((err as any).message));
    }
  }
};
