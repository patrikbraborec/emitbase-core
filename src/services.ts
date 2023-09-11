import { Job, Notification, Threshold } from './models.js';

function validateIds(thresholdIds: string[], notificationIds: string[]): boolean {
  // TODO: Add also check, if ids are same
  return thresholdIds.length !== notificationIds.length;
}

export function getJobs(thresholds: Threshold[], notifications: Notification[]): Job[] {
  const thresholdIds = thresholds.map((threshold) => Object.keys(threshold).join(''));
  const notificationIds = notifications.map((notification) => Object.keys(notification).join(''));

  if (validateIds(thresholdIds, notificationIds)) {
    console.error('Invalid threshold or notification objects');
    return [];
  }

  const jobs: Job[] = [];

  thresholds.forEach((threshold) => {
    const key = Object.keys(threshold)[0];
    const notification = notifications.find((notification) => Object.keys(notification)[0] === key);

    jobs.push({
      ...threshold[key],
      id: key,
      notifications: {
        ...notification[key],
      },
    });
  });

  return jobs;
}
