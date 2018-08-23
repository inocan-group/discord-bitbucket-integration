import {
  IAWSGatewayResponse,
  LambdaCallback,
  IAWSLambdaProxyIntegrationRequest,
  getBodyFromPossibleLambdaProxyRequest,
  AWSGatewayStatusCode,
  IAWSLambaContext,
  IDictionary
} from "common-types";
import axios from "axios";
import * as path from "path";

export async function handler(
  event: IAWSLambdaProxyIntegrationRequest,
  context: IAWSLambaContext,
  callback: LambdaCallback
) {
  console.log("EVENT\n", JSON.stringify(event, null, 2));
  const payload = getBodyFromPossibleLambdaProxyRequest(event);
  const changeEvent = (event.headers as IDictionary)["X-Event-Key"];
  const correlationId = (event.headers as IDictionary)["X-Request-UUID"];
  console.log(`changeEvent: ${changeEvent}; correlationId: ${correlationId}`);
  console.log("payload\n", JSON.stringify(payload, null, 2));
  console.log("context\n", JSON.stringify(context, null, 2));
  process.env.repo =
    "481570289558355969/KKKrc3eUn5mIGvUDVz4_UKqx5tQOHhMAroReVBLXGsDtPD-PmefsNkoX6sm92nJASWa0";
  const discordWebhookUrl = path.join(
    `https://discordapp.com/api/webhooks/`,
    process.env.repo
  );
  console.log("URL", discordWebhookUrl);

  try {
    await axios({
      method: "post",
      url: process.env.repo,
      baseURL: `https://discordapp.com/api/webhooks/`,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot"
      },
      data: {
        content: "hello from listen bot"
      }
    });
  } catch (e) {
    console.error(e);
    callback(e, { statusCode: e.statusCode });
    process.exit();
  }

  callback(null, {
    statusCode: AWSGatewayStatusCode.Success,
    body: {
      foo: "bar"
    }
  });
}
