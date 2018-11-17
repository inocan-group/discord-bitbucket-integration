// tslint:disable:no-invalid-template-strings
import { IServerlessFunction, IDictionary } from "common-types";

const listen: IServerlessFunction = {
  description: "listens for BitBucket events",
  handler: "lib/handlers/listen.handler",
  timeout: 2,
  memorySize: 512,
  events: [
    {
      http: {
        method: "post",
        path: "/bitbucket",
        cors: true
      }
    }
  ]
};

const functions: IDictionary<IServerlessFunction> = {
  listen
};

export default functions;
