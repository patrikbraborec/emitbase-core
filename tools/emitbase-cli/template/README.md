# Emitbase

Welcome to your Emitbase project! 💪 We hope Emitbase will help you not miss any important alerts!

## Prerequisites

- [Node.js 18.12](https://nodejs.org/en/blog/release/v18.12.0) or later.
- [Docker](https://www.docker.com/) on your machine.
- Read about [how Emitbase works](https://emitbase.github.io/emitbase-website/docs/introduction#how-does-it-work); it will make the following tutorial much easier for you! 👩‍🏫

## Step 1: Set up your profiles.yml

First, create a credentials file (don't worry, it's in `.gitignore` 👌).

```bash
$ touch profiles.yml
```

In the `profiles.yml` file, please define your credentials:

```bash
emitbase:
  databases:
    dev:
      host: <database-host>
      database: <database-name>
      port: <database-port>
      user: <database-username>
      password: <database-password>

  notifications:
    dev:
      email:
        host: <email-host>
        port: <email-port>
        user: <email-user>
        password: <email-password>
      slack:
        port: <slack-port>
        channel: <slack-channel>
        signingSecret: <slack-signing-secret>
        token: <slack-token>

  target: dev
```

:::tip

You do not need to define notifications. The messages will be printed to the console. You might find it useful during testing.

:::

## Step 2: Set up your first threshold

Go to the `thresholds` folder where you will find `first_threshold.yml`. Here, you can define your first threshold. For example:

```bash
first_threshold:
  expression: 'select * from metrics where temp > 30'
  cron: '*/5 * * * *'
```

The above declaration will cause the SQL query to run in the defined database every 5 minutes. If the query returns any rows, you will receive messages on your channels (see the next step).

## Step 3: Set up your first notifications

Go to the `notifications` folder where you will find `first_notification.yml`. Here, you can define your first notification. For example:

```bash
first_threshold:
  email:
    from: 'from@company.io'
    reciever: 'to@company.io'
    message: 'Hello mate! 👋 The temperature is too high! Please help! 🔥'
  slack:
    message: 'Hello mate! 👋 The temperature is too high! Please help! 🔥'
```

## Step 4: Build docker image

To run the project, you will need to build a Docker image:

```bash
$ docker build -t emitbase .
```

## Step 5: Run docker image 🚀

Now, you can run it! 

```bash
$ docker run -it emitbase
```

## Conclusion

Thank you for using Emitbase! If you run into any problem, please open [an issue](https://github.com/emitbase/emitbase-core/issues/new). 🙏 