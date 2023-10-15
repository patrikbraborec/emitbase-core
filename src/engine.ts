import nodeCron from 'node-cron';
import { EmailConnectionDetails, Job, PostgreSQLConnectionDetails, SlackConnectionDetails } from './models.js';
import { closePostgreSQLClient, getPostgreSQLClient } from './databases.js';
import { sendEmail, sendSlackMessage } from './notifications.js';

async function sendMessages(job: Job, emailConnectionDetails: EmailConnectionDetails, slackConnectionDetails: SlackConnectionDetails): Promise<void> {
  if (job.notifications.email) {
    if (emailConnectionDetails) {
      sendEmail(job, emailConnectionDetails);
    } else {
      console.log(job.notifications.email.message);
    }
  }

  if (job.notifications.slack) {
    if (slackConnectionDetails) {
      sendSlackMessage(job, slackConnectionDetails);
    } else {
      console.log(job.notifications.slack.message);
    }
  }
}

async function runJob(
  job: Job,
  selectedDatabaseConnectionDetails: PostgreSQLConnectionDetails,
  emailConnectionDetails: EmailConnectionDetails,
  slackConnectionDetails: SlackConnectionDetails,
): Promise<void> {
  try {
    if (!job.notifications.email && !job.notifications.slack) {
      throw new Error('Notification files do not contain any messages. Email or Slack messages are required.');
    }

    const database = await getPostgreSQLClient(selectedDatabaseConnectionDetails);
    const result = await database.query(job.expression);
    /**
     * The main logic of Emitbase core. If a SELECT query returs *any* rows from a database, a notifications are send.
     */
    const shouldSendMessages = result.rows.length > 0;

    if (shouldSendMessages) {
      sendMessages(job, emailConnectionDetails, slackConnectionDetails);
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
        throw new Error(`cron ${job.cron} is not valid.`);
      }
    } catch (error) {
      console.error(`Error in register threshold: ${error}`);
      throw error;
    }
  });
}
