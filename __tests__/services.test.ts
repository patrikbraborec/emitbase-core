import { Job, Notification, Threshold } from '../src/models.js';
import { getJobs } from '../src/services.js';

describe('services', () => {
  const mockedThresholds: Threshold[] = [
    {
      temp_high: { expression: 'select * from demo where temp > 10', cron: '0 * * * *' },
    },
    {
      temp_low: { expression: 'select * from demo where temp < 5', cron: '0 * * * *' },
    },
  ];
  const mockedNotifications: Notification[] = [
    {
      temp_high: {
        email: { from: 'from@email.com', reciever: 'to@mail.com', message: 'the temperature is too high' },
        slack: { message: 'the temperature is too high' },
      },
    },
    {
      temp_low: {
        email: { from: 'from@email.com', reciever: 'to@mail.com', message: 'the temperature is too low' },
        slack: { message: 'the temperature is too low' },
      },
    },
  ];

  test('should return correct jobs', () => {
    const expectedJobs: Job[] = [
      {
        id: 'temp_high',
        expression: 'select * from demo where temp > 10',
        cron: '0 * * * *',
        notifications: {
          email: { from: 'from@email.com', reciever: 'to@mail.com', message: 'the temperature is too high' },
          slack: { message: 'the temperature is too high' },
        },
      },
      {
        id: 'temp_low',
        expression: 'select * from demo where temp < 5',
        cron: '0 * * * *',
        notifications: {
          email: { from: 'from@email.com', reciever: 'to@mail.com', message: 'the temperature is too low' },
          slack: { message: 'the temperature is too low' },
        },
      },
    ];

    expect(getJobs(mockedThresholds, mockedNotifications)).toStrictEqual(expectedJobs);
  });

  test('should return empty array because inputs are incorrect', () => {
    const emptyThresholds: Threshold[] = [];
    const expectedJobs: Job[] = [];

    expect(getJobs(emptyThresholds, mockedNotifications)).toStrictEqual(expectedJobs);
  });
});
