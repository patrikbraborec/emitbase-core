import { EmailConnectionDetails, Job, PostgreSQLConnectionDetails, SlackConnectionDetails } from '../src/models.js';
import * as engineApi from '../src/engine.js';
import * as messagingApi from '../src/messaging.js';
import { Client } from 'pg';

jest.mock('pg', () => {
  const mockedPostgres = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mockedPostgres) };
});

describe('engine', () => {
  const mockedJob: Job = {
    id: 'temp_high',
    expression: 'select * from demo where temp > 10',
    cron: '0 * * * *',
    notifications: {
      email: { from: 'from@email.com', reciever: 'to@mail.com', message: 'the temperature is too high' },
      slack: { message: 'the temperature is too high' },
    },
  };
  const mockedDatabaseConnectionDetails: PostgreSQLConnectionDetails = {
    host: 'test',
    database: 'test',
    port: 1111,
    user: 'admin',
    password: 'admin',
  };
  const mockedEmailConnectionDetails: EmailConnectionDetails = {
    host: 'emailhost',
    port: 2222,
    user: 'admin',
    password: 'admin',
  };
  const mockedSlackConnectionDetails: SlackConnectionDetails = {
    port: 3333,
    channel: 'general',
    signingSecret: 'secret',
    token: 'token',
  };
  let mockedPostgresClient;

  beforeEach(() => {
    mockedPostgresClient = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call every database function the correct number of times', async () => {
    mockedPostgresClient.query.mockResolvedValue({ rowCount: 0 });

    await engineApi.runJob(mockedJob, mockedDatabaseConnectionDetails, mockedEmailConnectionDetails, mockedSlackConnectionDetails);

    expect(mockedPostgresClient.connect).toHaveBeenCalledTimes(1);
    /**
     * query is called two-times because it sets READ ONLY transactions
     */
    expect(mockedPostgresClient.query).toHaveBeenCalledTimes(2);
    expect(mockedPostgresClient.end).toHaveBeenCalledTimes(1);
  });

  test('should send messages if query returns any rows', async () => {
    const spySendMessages = jest.spyOn(messagingApi, 'sendMessages').mockResolvedValue(Promise.resolve());

    mockedPostgresClient.query.mockResolvedValue({ rowCount: 1 });

    await engineApi.runJob(mockedJob, mockedDatabaseConnectionDetails, mockedEmailConnectionDetails, mockedSlackConnectionDetails);

    expect(spySendMessages).toHaveBeenCalledTimes(1);
  });

  test('should not send messages if query returns no rows', async () => {
    const spySendMessages = jest.spyOn(messagingApi, 'sendMessages').mockResolvedValue(Promise.resolve());

    mockedPostgresClient.query.mockResolvedValue({ rowCount: 0 });

    await engineApi.runJob(mockedJob, mockedDatabaseConnectionDetails, mockedEmailConnectionDetails, mockedSlackConnectionDetails);

    expect(spySendMessages).toHaveBeenCalledTimes(0);
  });
});
