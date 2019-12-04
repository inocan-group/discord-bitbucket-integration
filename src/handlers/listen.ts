import {
  IAWSLambdaProxyIntegrationRequest,
  getBodyFromPossibleLambdaProxyRequest,
  IAWSLambaContext,
  IDictionary
} from "common-types";
import axios from "axios";
import { logger } from "aws-log";
import { SSM, ISsmExportsOutput, parseForNameComponents } from "aws-ssm";
import { createMessage } from "../shared/messages";
import { BitbucketType } from "../shared/types";
import { log } from "util";

let _secrets: ISsmExportsOutput;
const getSecrets = async () => {
  if (!_secrets) {
    const ssm = new SSM();
    _secrets = await ssm.modules(["discord"]);
  }
  return _secrets;
};

interface ISuccessResponse {
  statusCode: string | number;
  body?: string;
}

export async function handler(
  event: IAWSLambdaProxyIntegrationRequest,
  context: IAWSLambaContext
) {
  const log = logger().lambda(event, context);
  const requestBody = getBodyFromPossibleLambdaProxyRequest<IDictionary>(event);
  const changeEvent = (event.headers as IDictionary)["X-Event-Key"];

  const payload = { ...requestBody, ...{ kind: changeEvent } } as BitbucketType;
  log.info("Payload from bitbucket", payload);

  const secrets = (await getSecrets()).discord;
  if (secrets[requestBody.repository.name] === undefined) {
    throw new Error(
      `The secret you are looking for doesn't exist. [${requestBody.repository.name}]`
    );
  }
  const discordWebhookUrl = secrets[requestBody.repository.name];
  log.debug("Discord webhook url", { discordWebhookUrl });

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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    } as ISuccessResponse;
  } catch (e) {
    log.error("There was an issue sending the message to Discord: ", {
      e,
      discordWebhookUrl,
      message
    });
    return e;
  }
}
