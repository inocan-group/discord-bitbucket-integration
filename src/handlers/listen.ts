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
  // await axios.put(`https://discordapp.com/api/webhooks/`)

  callback(null, {
    statusCode: AWSGatewayStatusCode.Success,
    body: {
      foo: "bar"
    }
  });
}
