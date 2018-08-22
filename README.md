# discord-webhook

![license](http://img.shields.io/badge/license-MIT-brightgreen.svg)

Connects webhook events emitted from **BitBucket** and sends them to **Discord**.

Configuration is done with environment variables:

- `[REPO]` - you look-up an incoming repo by it's fully qualified name and the value points to the Discord ID and token

To ensure this repo doesn't contain any explicit reference to the ENV variables you must use SSM properties which you can set with `set-secret` but make sure your `serverless.yml` has the right AWS profile referenced before doing this.
