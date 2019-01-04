# discord-webhook

![license](http://img.shields.io/badge/license-MIT-brightgreen.svg)

Connects webhook events emitted from **BitBucket** and sends them to **Discord**.

## Getting started

### Requirements

NodeJS
Typescript
AWS Account

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

Configuration is done with environment variables:

`[REPO]` - you look-up an incoming repo by it's fully qualified name and the value points to the Discord ID and token

To ensure this repo doesn't contain any explicit reference to the ENV variables you must use SSM properties which you can set with `set-secret`.

You can do this by using the command below, but make sure you are referencing the correct AWS profile before doing this.

```bash
npm run set-secret [key] [value] --profile [profileName]
```

### Deployment

Once you have completed all of your configuration setup, you can now deploy the project to AWS Lambda.

```bash
npm run deploy --profile [profileName]
```
