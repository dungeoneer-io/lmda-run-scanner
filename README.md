# lmda-run-scanner
Obtains snapshots, harvests unique entities, and generates entity events for: Mythic+ Runs

### Working With This
- Clone, `npm i`
- `npm run local` to fire the lambda method locally
- `npm run test` to run through jest tests written
- Deploys to lambda on commit push to `main` branch on github

### What to Have
- Blizzard API Developer Account and API Key+Secret
- AWS Account, Access to create Lambda Functions
- Github Account to deploy and use Github Actions
- Mongo database, write access connection string

### What Happens?




### Stuff
- Should be able to specify `onlyAfterTimestamp` to discard runs that are older than a specific time
- Should be able to pass in what pcr's to do










### Resource Usage
Lambda Function Using:
- 128MB Memory (~100MB used)
~~- Billable Duration over snapshot: ~4260ms~~

### Plugging into the Cloud
- Deploy to github to leverage GitHub Actions written in .github\workflows
- Add projects secrets to github repo `AWS_ACCESS_KEY_ID`, `DISCORD_NOTIFICATION_WEBHOOK`, and `AWS_SECRET_ACCESS_KEY`
- Will need to have a named lambda function already created by the name in deploy yml. `lmda-run-scanner` here
- Pre-made lambda is going to need environment variables on board, also make local uncommitted .env with those same values. It'll make sure local runs work, include `SCAN_TIMEOUT_MS` if you want to override the default of 12000ms
- Create Event Rule in Amazon EventBridge to kick off the named lambda every day

        Much of this will be in a Terraform file so it doesn't need to be done manually
- Pre-made lambda timeout increased to like 15 seconds

### @dungeoneer-io/nodejs-utils
See [@dungeoneer-io/nodejs-utils](https://github.com/dungeoneer-io/nodejs-utils) for hints on how to configure environment variables in dotenv