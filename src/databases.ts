import { Client } from 'pg';
import { PostgreSQLConnectionDetails } from './models.js';

export async function getPostgreSQLClient(connectionDetails: PostgreSQLConnectionDetails): Promise<Client> {
  try {
    const connectionString = `postgresql://${connectionDetails.user}:${connectionDetails.password}@${connectionDetails.host}:${connectionDetails.port}/${connectionDetails.database}`;
    const client = new Client(connectionString);

    await client.connect();
    await client.query('SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY');

    return client;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    throw error;
  }
}

export async function closePostgreSQLClient(client: Client): Promise<void> {
  try {
    await client.end();
  } catch (error) {
    console.error('Error in main:', error);
  }
}
