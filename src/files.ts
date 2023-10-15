import * as fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import { EmitbaseProfiles, Threshold, Notification } from './models.js';
import Joi from 'joi';

function loadDefintions(folderPath: string): Threshold[] | Notification[] {
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
}

const profileSchema = Joi.object({
  emitbase: Joi.object({
    databases: Joi.object().pattern(
      Joi.string(),
      Joi.object({
        host: Joi.string(),
        database: Joi.string(),
        port: Joi.number(),
        user: Joi.string(),
        password: Joi.string(),
      }),
    ),
    notifications: Joi.object()
      .pattern(
        Joi.string(),
        Joi.object({
          email: Joi.object({
            host: Joi.string(),
            port: Joi.number(),
            user: Joi.string(),
            password: Joi.string(),
          }).optional(),
          slack: Joi.object({
            port: Joi.number(),
            channel: Joi.string(),
            signingSecret: Joi.string(),
            token: Joi.string(),
          }).optional(),
        }),
      )
      .optional(),
    target: Joi.string(),
  }),
});

export function loadProfile(filePath: string): EmitbaseProfiles {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    const { error } = profileSchema.validate(data);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error during loading profile file: ${error}`);
    throw error;
  }
}

const thresholdSchema = Joi.array().items(
  Joi.object().pattern(
    Joi.string(),
    Joi.object({
      expression: Joi.string(),
      cron: Joi.string(),
    }),
  ),
);

export function loadThresholds(filePath: string): Threshold[] {
  try {
    const thresholds = loadDefintions(filePath);
    const { error } = thresholdSchema.validate(thresholds);

    if (error) {
      throw error;
    }

    return thresholds as Threshold[];
  } catch (error) {
    console.error(`Error during loading threshold files: ${error}`);
    throw error;
  }
}

const notificationsSchema = Joi.array().items(
  Joi.object().pattern(
    Joi.string(),
    Joi.object({
      email: Joi.object({
        from: Joi.string(),
        reciever: Joi.string(),
        message: Joi.string(),
      }).optional(),
      slack: Joi.object({
        message: Joi.string(),
      }).optional(),
    }),
  ),
);

export function loadNotifications(filePath: string): Notification[] {
  try {
    const notifications = loadDefintions(filePath);
    const { error } = notificationsSchema.validate(notifications);

    if (error) {
      throw error;
    }

    return notifications as Notification[];
  } catch (error) {
    console.error(`Error during loading notificatio files: ${error}`);
    throw error;
  }
}
