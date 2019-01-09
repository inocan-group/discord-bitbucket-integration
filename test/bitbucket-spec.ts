// tslint:disable:no-implicit-dependencies
import { handler } from "../src/handlers/listen";
import * as chai from "chai";
import { loadData } from "./testing/helpers";
import { createMessage } from "../src/shared/messages";
import { IBitbucketRepositoryPushPayload, IBitbucketRepositoryIssueCreated } from "../src/shared/types";

const expect = chai.expect;

describe("Bitbucket", () => {
  it("createMessage should return a message for repo:push", async () => {
    const data = await loadData('repo-push.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPushPayload = {
      kind: "repo:push",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("ksnyder has pushed changes to inocan_move/discord-webhook");
  });

  it("createMessage should return a message for issue:created", async () => {
    const data = await loadData('issue-created.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryIssueCreated = {
      kind: "issue:created",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("inocan-group has created an issue in inocan_move/move-admin");
  });

  it("createMessage should return no message found", async () => {
    const data = await loadData('repo-push.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPushPayload = {
      kind: "repo:test",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("No message found");
  });
});
