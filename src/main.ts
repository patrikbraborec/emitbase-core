#!/usr/bin/env node

import { loadProfile, loadThresholds, loadNotifications } from './files.js';
import { registerThreshold } from './engine.js';
import { getJobs } from './services.js';
import path from 'path';
import { EmailConnectionDetails, SlackConnectionDetails } from './models.js';

if (process.argv.length === 2) {
  console.error('Expected folder with profiles and declarative files');
  process.exit(1);
}

const declarativeFiles = process.argv[2];

(async function main() {
  /**
   * TODO: Obvious problem is that currently the whole system supports only PostgreSQL connections / quesries. For POC it is sufficient.
   */
  const profile = loadProfile(path.join(declarativeFiles, 'profiles.yml'));
  const profileTarget: string = profile.emitbase.target;
  const selectedDatabaseConnectionDetails = profile.emitbase.databases[profileTarget];
  const thresholds = loadThresholds(path.join(declarativeFiles, 'thresholds'));
  const notifications = loadNotifications(path.join(declarativeFiles, 'notifications'));

  let emailConnectionDetails: EmailConnectionDetails;
  let slackConnectionDetails: SlackConnectionDetails;

  if (profile.emitbase.notifications) {
    if (profile.emitbase.notifications[profileTarget].email) {
      emailConnectionDetails = profile.emitbase.notifications[profileTarget].email;
    }
    if (profile.emitbase.notifications[profileTarget].slack) {
      slackConnectionDetails = profile.emitbase.notifications[profileTarget].slack;
    }
  }

  try {
    const jobs = getJobs(thresholds, notifications);

    registerThreshold(jobs, selectedDatabaseConnectionDetails, emailConnectionDetails, slackConnectionDetails);

    console.log('Emitbase is running! 🚀');
  } catch (error) {
    process.exit(1);
  }
})();
