import nodeCron from 'node-cron';
import { EmailConnectionDetails, Job, PostgreSQLConnectionDetails } from './models.js';
import { closePostgreSQLClient, getPostgreSQLClient } from './databases.js';
import { sendEmail } from './notifications.js';

async function runJob(
  job: Job,
  selectedDatabaseConnectionDetails: PostgreSQLConnectionDetails,
  selectedNotificationsConnectionDetails: EmailConnectionDetails,
): Promise<void> {
  try {
    const database = await getPostgreSQLClient(selectedDatabaseConnectionDetails);

    const result = await database.query(job.expression);

    if (result.rows.length > 0) {
      sendEmail(job, selectedNotificationsConnectionDetails);
    }

    closePostgreSQLClient(database);
  } catch (error) {
    console.error('Error in job:', error);
    throw error;
  }
}

export function registerThreshold(
  jobs: Job[],
  selectedDatabaseConnectionDetails: PostgreSQLConnectionDetails,
  selectedNotificationsConnectionDetails: EmailConnectionDetails,
): void {
  jobs.forEach((job) => {
    const isCronValid = nodeCron.validate(job.cron);

    if (isCronValid) {
      nodeCron.schedule(job.cron, () => {
        runJob(job, selectedDatabaseConnectionDetails, selectedNotificationsConnectionDetails);
      });
    } else {
      console.error(`cron ${job.cron} is not valid`);
    }
  });
}
