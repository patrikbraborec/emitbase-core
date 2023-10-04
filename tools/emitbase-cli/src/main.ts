#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const template = path.join(__dirname, 'template');

program.name('emitbase-cli').description('Command Line Interface for Emitbase').version('0.0.1');

program
  .command('init')
  .description('Init of Emibase project 🐣')
  .argument('<name>', 'Name of the project')
  .action(async (name) => {
    try {
      await fs.mkdir(name);

      fsExtra.copy(template, path.join(name), (err) => {
        if (err) {
          throw new Error(`Error copying directory: ${err}`);
        }
      });

      console.log(`Emitbase project ${name} successfully created! 🎉 Happy Alerting!`);
    } catch (error) {
      console.error(error);
    }
  });

program.parse();
