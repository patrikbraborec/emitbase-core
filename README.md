# Emitbase Core

Emitbase is an open-source tool for declarative alerts and notifications.

## Introducing Emitbase 0.0.1-alpha 🚀

I have spent a few hours on a tool that I named Emitbase. My vision is to create a simple and declarative tool for alerts, notifications, and messaging for developer products. It is not something random. When I built my last product (a failed startup), I always wished such a tool existed; a tool that does not interfere with your business logic but serves as a simple layer directly above your database, where you can define simple logic for alerting, messaging, and notifications.

## Developer Experience (DX) 💻

I aim for the best possible developer experience. In recent months, I had the pleasure of working with [dbt](https://www.getdbt.com/), and it was truly inspirational for me regarding DX. If you check the `demo` folder, you can see its significant influence.

### Thresholds

A threshold is a YAML file where you define the threshold for when a particular alert/notification (still not decided on how to call it) should be sent. You can write *any* SQL `SELECT` query, and if the result contains something (i.e., if the `SELECT` query returns a row from the database), the alert/notification is sent.

```yaml
temp_high:
  expression: 'select * from demo where temp > 10'
  cron: '* * * * *'
```

### Notifications

A notification is a YAML file where you define what notifications should be sent. In the current version, Emitbase supports only email notifications, but in the future, it can be Slack, Github, your system, etc.

```yaml
temp_high:
  email:
    reciever: 'patrikbraborec@gmail.com'
    message: 'the temperature is too high'
```

## Try it!

You can create `profiles.yml` file in the `demo` folder:

```yaml
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

If you define your connection details, you can then simply run it:

```bash
$ npm install
$ npm run build
$ npm start
```
## Why announce it so soon?

Well, I love the idea of building things in public. Also, I know that I can sometimes think about things the wrong way, and this early release may serve as a feedback loop, which is usually very valuable. Lastly, there is still some chance (though small) that I will find some contributors who would love this idea as much as I do.

## Next Steps

The `0.0.1-alpha` is truly alpha, and there is still a lot of work to be done! The following list contains a high-level plan for the next steps (to actually release `0.0.1`):

- [ ] Docker image (right now, the Docker image is not working properly)
- [ ] CLI (a CLI tool would create a demo-like folder with a built-in Docker file that you could run)
- [ ] Slack messaging
- [ ] Validation (there is missing validation for almost all inputs)
- [ ] Ensure that Emitbase performs only `SELECT` queries.
- [ ] Tests for core functionalities
- [ ] Documentation