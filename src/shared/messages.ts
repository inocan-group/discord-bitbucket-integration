import { IDictionary } from "common-types";
import { BitbucketType, IBitbucketPushChanges, IBitbucketComment, IBitbucketIssue, IBitbucketPullRequest } from "./types";

interface IMessageEmbeds {
  title?: string;
  description?: string;
  url: string;
}

interface IMessageFormat {
  content: string;
  embeds?: IMessageEmbeds[]
}

export function createMessage(payload: BitbucketType) {
  switch (payload.kind) {
    case "repo:push":
      return formatMessage(
        `${payload.actor.username} has pushed changes to ${payload.repository.full_name}`,
        createRepoPushEmbed(payload.push.changes[0])
      );
    case "repo:commit_comment_created":
      return formatMessage(
        `${payload.actor.username} has left a comment on a Pull Request in ${payload.repository.full_name}`,
        createCommitCommentEmbed(payload.comment)
      );
    case "pullrequest:created":
      return formatMessage(
        `${payload.actor.username} has created an Pull Request on ${payload.repository.full_name}`,
        createPullRequestEmbed(payload.pullrequest)
      );
    case "pullrequest:updated":
      return formatMessage(
        `${payload.actor.username} has updated an Pull Request on ${payload.repository.full_name}`,
        createPullRequestEmbed(payload.pullrequest)
      );
    case "pullrequest:rejected":
      return formatMessage(
        `${payload.actor.username} has rejected an Pull Request on ${payload.repository.full_name}`,
        createPullRequestEmbed(payload.pullrequest)
      );
    case "pullrequest:comment_updated":
      return formatMessage(
        `${payload.actor.username} has updated a comment on a Pull Request in ${payload.repository.full_name}`,
        createPullRequestCommentEmbed(payload.pullrequest, payload.comment)
      );
    case "issue:created":
      return formatMessage(
        `${payload.actor.username} has created an issue in ${payload.repository.full_name}`,
        createIssueEmbed(payload.issue)
      );
    case "issue:updated":
      return formatMessage(
        `${payload.actor.username} has updated an issue in ${payload.repository.full_name}`,
        createIssueEmbed(payload.issue)
      );
    case "issue:comment_created":
      return formatMessage(
        `${payload.actor.username} has left a comment on a Issue in ${payload.repository.full_name}`,
        createCommentEmbed(payload.issue, payload.comment)
      );
    default:
      return formatMessage(`No message found`);
  }
};

const formatMessage = (message: string, embed?: IMessageEmbeds): IMessageFormat => ({
  content: message,
  embeds: [embed],
});

const createRepoPushEmbed = (pushChangesPayload: IBitbucketPushChanges): IMessageEmbeds => ({
  title: pushChangesPayload.commits[0].hash,
  description: pushChangesPayload.commits[0].message,
  url: pushChangesPayload.links.html.href
});

const createPullRequestEmbed = (pullRequestPayload: IBitbucketPullRequest): IMessageEmbeds => ({
  title: pullRequestPayload.title,
  description: pullRequestPayload.description,
  url: pullRequestPayload.links.html.href
});

const createPullRequestCommentEmbed = (pullRequestPayload: IBitbucketPullRequest, commentPayload: IBitbucketComment): IMessageEmbeds => ({
  title: pullRequestPayload.title,
  description: commentPayload.content.raw,
  url: commentPayload.links.html.href
});

const createCommitCommentEmbed = (commentPayload: IBitbucketComment): IMessageEmbeds => ({
  title: commentPayload.content.raw,
  url: commentPayload.links.html.href
});

const createCommentEmbed = (issuePayload: IBitbucketIssue, commentPayload: IBitbucketComment): IMessageEmbeds => ({
  title: issuePayload.content.raw,
  description: commentPayload.content.raw,
  url: commentPayload.links.html.href
});

const createIssueEmbed = (issuePayload: IBitbucketIssue): IMessageEmbeds => ({
  title: issuePayload.title,
  description: issuePayload.content.raw,
  url: issuePayload.links.html.href
});
