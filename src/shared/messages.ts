import { IDictionary } from "common-types";
import { BitbucketType, IBitbucketPushChanges, IBitbucketComment, IBitbucketIssue, IBitbucketPullRequest, IBitbucketOwner, IBitbucketRepoChanges, IBitbucketRepository, IBitbucketApproval } from "./types";

interface IMessageEmbeds {
  title?: string;
  description?: string;
  url: string;
  author?: {
    name?: string;
    url?: string;
    icon_url?: string;
  }
}

interface IMessageFormat {
  content?: string;
  embeds?: IMessageEmbeds[]
}

export function createMessage(payload: BitbucketType) {
  switch (payload.kind) {
    case "repo:push":
      return createEmbedPayload(createRepoPushEmbed(payload.push.changes[0], payload.actor));
    case "repo:updated":
      return createEmbedPayload(createRepoUpdatedEmbed(payload.changes, payload.actor));
    case "repo:transfer":
      return createEmbedPayload(createRepoTransferEmbed(payload.repository, payload.actor, payload.previous_owner));
    case "repo:commit_comment_created":
      return createEmbedPayload(createCommitCommentEmbed(payload.comment, payload.actor));
    case "pullrequest:created":
      return createEmbedPayload(createPullRequestEmbed(payload.pullrequest, payload.actor));
    case "pullrequest:updated":
      return createEmbedPayload(createPullRequestEmbed(payload.pullrequest, payload.actor));
    case "pullrequest:approved":
      return createEmbedPayload(createPullRequestApprovedEmbed(payload.pullrequest, payload.actor));
    case "pullrequest:unapproved":
      return createEmbedPayload(createPullRequestUnApprovedEmbed(payload.pullrequest, payload.actor));
    case "pullrequest:fulfilled":
      return createEmbedPayload(createPullRequestEmbed(payload.pullrequest, payload.actor));
    case "pullrequest:rejected":
      return createEmbedPayload(createPullRequestEmbed(payload.pullrequest, payload.actor));
    case "pullrequest:comment_created":
      return createEmbedPayload(createPullRequestCommentEmbed(payload.pullrequest, payload.comment, payload.actor));
    case "pullrequest:comment_updated":
      return createEmbedPayload(createPullRequestCommentEmbed(payload.pullrequest, payload.comment, payload.actor));
    case "pullrequest:comment_deleted":
      return createEmbedPayload(createPullRequestCommentEmbed(payload.pullrequest, payload.comment, payload.actor));
    case "issue:created":
      return createMessagePayload(
        `${payload.actor.username} has created an issue in ${payload.repository.full_name}`,
        createIssueEmbed(payload.issue, payload.actor)
      );
    case "issue:updated":
      return createMessagePayload(
        `${payload.actor.username} has updated an issue in ${payload.repository.full_name}`,
        createIssueEmbed(payload.issue, payload.actor)
      );
    case "issue:comment_created":
      return createMessagePayload(
        `${payload.actor.username} has left a comment on a Issue in ${payload.repository.full_name}`,
        createCommentEmbed(payload.issue, payload.comment, payload.actor)
      );
    default:
      return createMessagePayload(`No message found`);
  }
};

const createMessagePayload = (message: string, embed?: IMessageEmbeds): IMessageFormat => ({
  content: message,
  embeds: [embed],
});

const createEmbedPayload = (embed: IMessageEmbeds): IMessageFormat => ({
  embeds: [embed]
});

const createRepoPushEmbed = (pushChangesPayload: IBitbucketPushChanges, user: IBitbucketOwner): IMessageEmbeds => ({
  title: pushChangesPayload.new.name,
  description: pushChangesPayload.commits[0].message,
  url: pushChangesPayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createRepoUpdatedEmbed = (changesPayload: IBitbucketRepoChanges, user: IBitbucketOwner): IMessageEmbeds => ({
  title: changesPayload.name.new,
  description: changesPayload.description.new,
  url: changesPayload.links.new.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createRepoTransferEmbed = (repoPayload: IBitbucketRepository, user: IBitbucketOwner, prev: IBitbucketOwner): IMessageEmbeds => ({
  title: repoPayload.name,
  description: `${repoPayload.name} was transferred from ${prev.username}`,
  url: repoPayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createPullRequestEmbed = (pullRequestPayload: IBitbucketPullRequest, user: IBitbucketOwner): IMessageEmbeds => ({
  title: pullRequestPayload.title,
  description: pullRequestPayload.description,
  url: pullRequestPayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createPullRequestApprovedEmbed = (pullRequestPayload: IBitbucketPullRequest, user: IBitbucketOwner): IMessageEmbeds => ({
  title: pullRequestPayload.title,
  description: `${user.nickname} has approved ${pullRequestPayload.source.branch.name}`,
  url: pullRequestPayload.links.html.href,
  author: {
    name: pullRequestPayload.author.username,
    url: pullRequestPayload.author.links.html.href,
    icon_url: pullRequestPayload.author.links.avatar.href
  }
});

const createPullRequestUnApprovedEmbed = (pullRequestPayload: IBitbucketPullRequest, user: IBitbucketOwner): IMessageEmbeds => ({
  title: pullRequestPayload.title,
  description: `${user.nickname} has unapproved ${pullRequestPayload.source.branch.name}`,
  url: pullRequestPayload.links.html.href,
  author: {
    name: pullRequestPayload.author.username,
    url: pullRequestPayload.author.links.html.href,
    icon_url: pullRequestPayload.author.links.avatar.href
  }
});

const createPullRequestCommentEmbed = (pullRequestPayload: IBitbucketPullRequest, commentPayload: IBitbucketComment, user: IBitbucketOwner): IMessageEmbeds => ({
  title: pullRequestPayload.title,
  description: commentPayload.content.raw,
  url: commentPayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createCommitCommentEmbed = (commentPayload: IBitbucketComment, user: IBitbucketOwner): IMessageEmbeds => ({
  title: commentPayload.content.raw,
  url: commentPayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createCommentEmbed = (issuePayload: IBitbucketIssue, commentPayload: IBitbucketComment, user: IBitbucketOwner): IMessageEmbeds => ({
  title: issuePayload.content.raw,
  description: commentPayload.content.raw,
  url: commentPayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});

const createIssueEmbed = (issuePayload: IBitbucketIssue, user: IBitbucketOwner): IMessageEmbeds => ({
  title: issuePayload.title,
  description: issuePayload.content.raw,
  url: issuePayload.links.html.href,
  author: {
    name: user.username,
    url: user.links.html.href,
    icon_url: user.links.avatar.href
  }
});
