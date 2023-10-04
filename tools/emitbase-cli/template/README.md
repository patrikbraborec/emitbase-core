# Emitbase

Welcome to your Emitbase project! 💪 We hope Emitbase will help you not miss any important alerts!

## Prerequesities 

You need to have [docker](https://www.docker.com/) to run Emitbase.

## Getting Started

### Step 1: Set up your profiles.yml

First, create a credentials file (don't worry, it's in `.gitignore`).

```bash
$ touch profiles.yml
```

In the `profiles.yml` file, please define your credentials:

```bash
emitbase:
  databases:
    dev:
      host:
      database:
      port:
      user:
      password:

  notifications:
    dev:
      email:
        host:
        port:
        user:
        password:

  target: dev
```

### Step 2: Set up your first threshold

Go to the `thresholds` folder where you will find `first_threshold.yml`. Here, you can define your first threshold. For example:

```bash
first_threshold:
  expression: 'select * from demo where temp > 10'
  cron: '5 * * * *'
```

### Step 3: Set up your first threshold

Go to the `notifications` folder where you will find `first_notification.yml`. Here, you can define your first notification. For example:

```bash
first_notification:
  email:
    reciever: 'patrikbraborec@gmail.com'
    message: 'the temperature is too high'
```

### Step 4: Build docker image

```bash
$ docker build -t emitbase
```

### Step 5: Run docker image

```bash
$ docker run -it emitbase
```

## Conclusion

Thank you for using Emitbase! If you run into any problem, please open [an issue](https://github.com/emitbase/emitbase-core/issues/new). 🙏 