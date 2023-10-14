import nodeCron from 'node-cron';
import { EmailConnectionDetails, Job, PostgreSQLConnectionDetails, SlackConnectionDetails } from './models.js';
import { closePostgreSQLClient, getPostgreSQLClient } from './databases.js';
import { sendEmail, sendSlackMessage } from './notifications.js';

async function runJob(
  job: Job,
  selectedDatabaseConnectionDetails: PostgreSQLConnectionDetails,
  emailConnectionDetails: EmailConnectionDetails,
  slackConnectionDetails: SlackConnectionDetails,
): Promise<void> {
  try {
    const database = await getPostgreSQLClient(selectedDatabaseConnectionDetails);

    const result = await database.query(job.expression);

    /**
     * The main logic of Emitbase core. If a SELECT query returs *any* rows from a database, a notifications are send.
     */
    if (result.rows.length > 0) {
      sendEmail(job, emailConnectionDetails);
      sendSlackMessage(job, slackConnectionDetails);
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
  emailConnectionDetails: EmailConnectionDetails,
  slackConnectionDetails: SlackConnectionDetails,
): void {
  jobs.forEach((job) => {
    try {
      const isCronValid = nodeCron.validate(job.cron);

      if (isCronValid) {
        nodeCron.schedule(job.cron, () => {
          runJob(job, selectedDatabaseConnectionDetails, emailConnectionDetails, slackConnectionDetails);
        });
      } else {
        throw new Error(`cron ${job.cron} is not valid`);
      }
    } catch (error) {
      console.error(`cron ${job.cron} is not valid`);
      throw error;
    }
  });
}
