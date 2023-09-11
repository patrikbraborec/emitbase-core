import nodemailer from 'nodemailer';
import { EmailConnectionDetails, Job } from './models.js';

export async function sendEmail(job: Job, selectedNotificationsConnectionDetails: EmailConnectionDetails): Promise<void> {
  try {
    const transport = nodemailer.createTransport({
      host: selectedNotificationsConnectionDetails.host,
      port: selectedNotificationsConnectionDetails.port,
      auth: {
        user: selectedNotificationsConnectionDetails.user,
        pass: selectedNotificationsConnectionDetails.password,
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
