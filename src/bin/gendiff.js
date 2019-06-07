#!/usr/bin/env node
import program from 'commander';
import path from 'path';
import gendiff from '..';

program
  .version('1.5.0')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfigPath, secondConfigPath) => {
    const firstConfigFullPath = path.resolve(firstConfigPath);
    const secondConfigFullPath = path.resolve(secondConfigPath);
    const result = gendiff(firstConfigFullPath, secondConfigFullPath, program.format);
    console.log(result);
  })
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .parse(process.argv);
