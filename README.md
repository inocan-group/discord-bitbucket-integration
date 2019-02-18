# discord-bitbucket-integration

![license](http://img.shields.io/badge/license-MIT-brightgreen.svg)

Connects webhook events emitted from **BitBucket** and sends them to **Discord**.

## Getting started

### Prerequisites

You will need the following things properly setup on your computer.

- Git
- Node.js (with npm)
- Typescript
- AWS Account

### Installation

#### 1. Fetch Source

Clone this repo by running the following command in your command line tool

```bash
git clone https://github.com/inocan-group/discord-bitbucket-integration.git
```

#### 2. Install dependencies
Now change into the project's directory and install the dependencies

```bash
cd discord-bitbucket-integration
npm install
```

### Configuration

Edit `serverless-config/provider.ts` and enter your `ACCOUNT_ID` by replacing the placeholder text `xxxx-xxxx-xxxx`.

Configuration is done with SSM variables:

To ensure this repo doesn't contain any explicit reference to the ENV variables you must use SSM properties which you can set with `set-secret`.

You can do this by using the command below, but make sure you are referencing the correct AWS profile before doing this.

```bash
npm run set-secret [key] [value] -- --profile [profileName]
```

In this case the `[key]` will be the repository short name for instance `discord-bitbucket-integration` and `[value]` will be the webhook url you get from Discord.

### Deployment

Once you have completed all of your configuration setup, you can now deploy the project to AWS Lambda.

```bash
npm run deploy -- --profile [profileName]
```
