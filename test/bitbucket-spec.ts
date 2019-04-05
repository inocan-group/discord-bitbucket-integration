// tslint:disable:no-implicit-dependencies
import { handler } from "../src/handlers/listen";
import * as chai from "chai";
import { loadData } from "./testing/helpers";
import { createMessage } from "../src/shared/messages";
import { IBitbucketRepositoryPush, IBitbucketRepositoryIssueCreated, IBitbucketRepositoryPullRequestApproved, IBitbucketRepositoryPullRequestUnapproved, IBitbucketRepositoryPullRequestUpdated, IBitbucketRepositoryPullRequestCreated } from "../src/shared/types";

const expect = chai.expect;

describe("Bitbucket", () => {
  it("createMessage should return a message for repo:push", async () => {
    const data = await loadData('repo-push.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPush = {
      kind: "repo:push",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.embeds[0].description).to.equal("listener listens but not sending to Discord yet\n");
  });

  it("createMessage should return a message for issue:created", async () => {
    const data = await loadData('issue-created.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryIssueCreated = {
      kind: "issue:created",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("inocan-group has created an issue in inocan/discord-bitbucket-integration");
    expect(message.embeds[0].title).to.equal("Hell's freezing over");
  });

  it("createMessage should return a message for issue:comment_created", async () => {
    const data = await loadData('issue-comment.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryIssueCreated = {
      kind: "issue:comment_created",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.embeds[0].title).to.equal("another test");
  });

  it("createMessage should return a message for pullrequest:created", async () => {
    const data = await loadData('pullrequest-created.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPullRequestCreated = {
      kind: "pullrequest:created",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.embeds[0].title).to.equal("fixes namespaced dispatched actions");
    expect(message.embeds[0].description).to.equal("");
  });

  it("createMessage should return a message for pullrequest:updated", async () => {
    const data = await loadData('pullrequest-updated.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPullRequestUpdated = {
      kind: "pullrequest:updated",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.embeds[0].title).to.equal("Feature/sign in sign up email verification");
    expect(message.embeds[0].description).to.equal("* adds SignIn component adds SignUp component adds routes for signIn and signUp adds firebase auth");
  });

  it("createMessage should return a message for pullrequest:approved", async () => {
    const data = await loadData('pullrequest-approved.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPullRequestApproved = {
      kind: "pullrequest:approved",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.embeds[0].title).to.equal("fixes namespaced dispatched actions");
    expect(message.embeds[0].description).to.equal("andrew-inocan has approved hotfix/97-namespaced-action-names-fix");
  });

  it("createMessage should return a message for pullrequest:unapproved", async () => {
    const data = await loadData('pullrequest-approved.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPullRequestUnapproved = {
      kind: "pullrequest:unapproved",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.embeds[0].title).to.equal("fixes namespaced dispatched actions");
    expect(message.embeds[0].description).to.equal("andrew-inocan has unapproved hotfix/97-namespaced-action-names-fix");
  });

  it("createMessage should return no message found", async () => {
    const data = await loadData('repo-push.json');
    const parsedPayload = JSON.parse(data);
    const payload: IBitbucketRepositoryPush = {
      kind: "repo:test",
      ...parsedPayload
    };
    const message = createMessage(payload);
    expect(message.content).to.equal("No message found");
  });
});
