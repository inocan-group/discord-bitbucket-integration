import {
  LambdaCallback,
  IAWSLambdaProxyIntegrationRequest,
  getBodyFromPossibleLambdaProxyRequest,
  APIGatewayStatusCode,
  IAWSLambaContext,
  IDictionary
} from "common-types";
import axios from "axios";
import { createMessage } from "../shared/messages";
import { BitbucketType } from "../shared/types";
import { getParameter } from "../shared/secrets";

export async function handler(
  event: IAWSLambdaProxyIntegrationRequest,
  context: IAWSLambaContext,
  callback: LambdaCallback
) {
  console.log("EVENT\n", JSON.stringify(event, null, 2));
  const requestBody = getBodyFromPossibleLambdaProxyRequest<IDictionary>(event);
  const changeEvent = (event.headers as IDictionary)["X-Event-Key"];
  const correlationId = (event.headers as IDictionary)["X-Request-UUID"];
  console.log(`changeEvent: ${changeEvent}; correlationId: ${correlationId}`);
  console.log("payload\n", JSON.stringify(requestBody, null, 2));
  console.log("context\n", JSON.stringify(context, null, 2));

  const payload = { ...requestBody, ...{ kind: changeEvent } } as BitbucketType;

  console.log("Payload\n", payload);

  const discordWebhookUrl = (await getParameter(requestBody.repository.name)).Value;
  console.log("URL", discordWebhookUrl);

  const message = createMessage(payload);
  console.log("Discord Payload\n", message);

  try {
    await axios({
      method: "post",
      url: discordWebhookUrl,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot"
      },
      data: message
    });
  } catch (e) {
    console.error(e);
    callback(e, { statusCode: e.statusCode });
    process.exit();
  }

  callback(null, {
    statusCode: APIGatewayStatusCode.Success,
    body: {
      foo: "bar"
    }
  });
}
