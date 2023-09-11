import * as fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import { EmitbaseProfiles, Threshold, Notification } from './models.js';

export function loadProfile(filePath: string): EmitbaseProfiles {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);

    return data;
  } catch (error) {
    console.error(`Error loading profile file: ${error}`);
    throw error;
  }
}

export function loadDefintions(folderPath: string): Threshold[] | Notification[] {
  try {
    const files = fs.readdirSync(folderPath);
    const yamlFiles = files.filter((file) => {
      const ext = path.extname(file);
      return ext === '.yaml' || ext === '.yml';
    });

    const definitionsArrays: Threshold[] | Notification[] = [];

    for (const yamlFile of yamlFiles) {
      const filePath = path.join(folderPath, yamlFile);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents);

      definitionsArrays.push(data);
    }

    return definitionsArrays;
  } catch (error) {
    console.error(`Error loading definition files: ${error}`);
    throw error;
  }
}
