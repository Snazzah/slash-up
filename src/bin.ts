#!/usr/bin/env node
import yargs from 'yargs';
import logSymbols from 'log-symbols';
import ansi from 'ansi-colors';
import { listCommand } from './commands/list';
import { viewCommand } from './commands/view';
import { localCommand } from './commands/local';
import { syncCommand } from './commands/sync';
import { configCommand } from './commands/config';
import { initCommand } from './commands/init';
const { version } = require('../package.json');

yargs
  .scriptName('slash-up')
  .command(listCommand)
  .command(viewCommand)
  .command(localCommand)
  .command(syncCommand)
  .command(initCommand)
  .command(configCommand)
  .strictCommands()
  .help('help', 'Show usage information & exit')
  .alias('help', 'h')
  .version('version', 'Show version number & exit', version)
  .alias('version', 'v')
  .demandCommand(1, '')
  .fail((msg, err, yargs) => {
    if (msg === null && err === undefined) return yargs.showHelp();
    console.error(`${logSymbols.error} ${ansi.red('error')} ${msg}`);
    process.exitCode = 1;
  })
  .updateStrings({
    'Positionals:': 'Positional Arguments',
    'Options:': 'Other Options',
    'Commands:': 'Commands'
  })
  .wrap(process.stdout.columns ? Math.min(process.stdout.columns, 100) : 100)
  .parse();
