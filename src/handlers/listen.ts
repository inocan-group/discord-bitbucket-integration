import {
  IAwsLambdaCallback,
  IAWSLambdaProxyIntegrationRequest,
  getBodyFromPossibleLambdaProxyRequest,
  ApiGatewayStatusCode,
  IAWSLambaContext,
  IDictionary
} from "common-types";
import axios from "axios";
import { logger } from "aws-log";
import { createMessage } from "../shared/messages";
import { BitbucketType } from "../shared/types";
import { getParameter } from "../shared/secrets";

interface ISuccessResponse { 
  statusCode: string | number,
  body?: IDictionary
}

export async function handler(
  event: IAWSLambdaProxyIntegrationRequest,
  context: IAWSLambaContext,
  callback: IAwsLambdaCallback<ISuccessResponse>
) {
  const log = logger().lambda(event, context);
  const requestBody = getBodyFromPossibleLambdaProxyRequest<IDictionary>(event);
  const changeEvent = (event.headers as IDictionary)["X-Event-Key"];

  const payload = { ...requestBody, ...{ kind: changeEvent } } as BitbucketType;
  log.info("Payload", payload);

  const discordWebhookUrl = (await getParameter(requestBody.repository.name)).Value;
  log.info("Discord webhook url", { discordWebhookUrl });

  const message = createMessage(payload);
  log.info("Payload being sent to Discord", message);

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

    callback(null, {
      statusCode: ApiGatewayStatusCode.Success,
      body: {
        foo: "bar"
      }
    });
  } catch (e) {
    log.error("There was an issue sending the message to Discord: ", {
      e,
      discordWebhookUrl,
      message
    });
    callback(e);
    process.exit();
  }
}
