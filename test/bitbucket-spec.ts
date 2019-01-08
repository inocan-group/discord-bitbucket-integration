// tslint:disable:no-implicit-dependencies
import { handler } from "../src/handlers/listen";
import * as chai from "chai";
import { loadData } from "./testing/helpers";
import { createMessage } from "../src/shared/messages";
import { IBitbucketRepositoryPushPayload } from "../src/shared/types";

const expect = chai.expect;

describe("Bitbucket", () => {
  it("createMessage should return a message for repo:push", async () => {
    const repoPush = await loadData('repo-push.json');
    const parsedPayload = JSON.parse(repoPush);
    const payload: IBitbucketRepositoryPushPayload = {
      kind: "repo:push",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("ksnyder has pushed changes to inocan_move/discord-webhook");
  });

  it("createMessage should return no message found", async () => {
    const repoPush = await loadData('repo-push.json');
    const parsedPayload = JSON.parse(repoPush);
    const payload: IBitbucketRepositoryPushPayload = {
      kind: "repo:test",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("No message found");
  });
});
