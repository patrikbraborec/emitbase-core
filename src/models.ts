export interface PostgreSQLConnectionDetails {
  host: string;
  database: string;
  port: number;
  user: string;
  password: string;
}

export interface EmailConnectionDetails {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface SlackConnectionDetails {
  port: number;
  channel: string;
  signingSecret: string;
  token: string;
}

export interface EmitbaseProfiles {
  emitbase: {
    databases: {
      [key: string]: PostgreSQLConnectionDetails;
    };
    notifications?: {
      [key: string]: {
        email?: EmailConnectionDetails;
        slack?: SlackConnectionDetails;
      };
    };
    target: string;
  };
}

export interface Threshold {
  [id: string]: {
    expression: string;
    cron: string;
  };
}

export interface Notification {
  [id: string]: {
    email: {
      from: string;
      reciever: string;
      message: string;
    };
    slack: {
      message: string;
    };
  };
}

export interface Job {
  id: string;
  expression: string;
  cron: string;
  notifications: {
    email: {
      from: string;
      reciever: string;
      message: string;
    };
    slack: {
      message: string;
    };
  };
}
