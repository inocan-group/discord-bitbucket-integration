import {
  LambdaCallback,
  IAWSLambdaProxyIntegrationRequest,
  getBodyFromPossibleLambdaProxyRequest,
  APIGatewayStatusCode,
  IAWSLambaContext,
  IDictionary
} from "common-types";
import axios from "axios";
import * as path from "path";
import { createMessage } from "../shared/messages";
import { IBitbucketRepository, IBitbucketOwner, BitbucketType } from "../shared/types";
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

  const repository: IBitbucketRepository = requestBody.repository;
  const actor: IBitbucketOwner = requestBody.actor;

  const payload = { ...requestBody, ...{ kind: changeEvent } } as BitbucketType;

  console.log("Repository\n", repository);
  console.log("Owner\n", actor);

  const discordInfo = (await getParameter(repository.name)).Value;
  const { id, token } = JSON.parse(discordInfo);
  const discordPath = `${id}/${token}`;
  // TODO change discordWebhookUrl to accept entire url
  const discordWebhookUrl = path.join(
    `https://discordapp.com/api/webhooks/`,
    discordPath
  );
  console.log("URL", discordWebhookUrl);

  try {
    await axios({
      method: "post",
      url: discordPath,
      baseURL: `https://discordapp.com/api/webhooks/`,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot"
      },
      data: createMessage(payload)
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
