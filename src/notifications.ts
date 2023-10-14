import nodemailer from 'nodemailer';
import { EmailConnectionDetails, Job, SlackConnectionDetails } from './models.js';
import slack from '@slack/bolt';

export async function sendEmail(job: Job, emailConnectionDetails: EmailConnectionDetails): Promise<void> {
  try {
    const transport = nodemailer.createTransport({
      host: emailConnectionDetails.host,
      port: emailConnectionDetails.port,
      auth: {
        user: emailConnectionDetails.user,
        pass: emailConnectionDetails.password,
      },
    });

    await transport.sendMail({
      from: '"Patrik Braborec" <patrikbraborec@gmail.com>',
      to: job.notifications.email.reciever,
      subject: '🔥 Message from Emitbase! 🔥',
      text: job.notifications.email.message,
    });
  } catch (error) {
    console.error('Error during sending email:', error);
    throw error;
  }
}

export async function sendSlackMessage(job: Job, slackConnectionDetails: SlackConnectionDetails) {
  const { App } = slack;
  const app = new App({
    signingSecret: slackConnectionDetails.signingSecret,
    token: slackConnectionDetails.token,
  });

  try {
    await app.start(slackConnectionDetails.port);

    await app.client.chat.postMessage({
      token: slackConnectionDetails.token,
      channel: slackConnectionDetails.channel,
      text: job.notifications.slack.message,
    });
  } catch (error) {
    console.error(error);
  }
}
