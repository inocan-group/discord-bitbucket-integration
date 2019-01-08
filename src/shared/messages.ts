import { IDictionary } from "common-types";
import { BitbucketType, IBitbucketPushChanges, IBitbucketComment } from "./types";

interface IMessageEmbeds {
  title?: string;
  description: string;
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
        createCommentEmbed(payload.comment)
      );
    case "pullrequest:created":
      return formatMessage(
        `${payload.actor.username} has created an Pull Request on ${payload.repository.full_name}`
      );
    case "pullrequest:updated":
      return formatMessage(
        `${payload.actor.username} has updated an Pull Request on ${payload.repository.full_name}`
      );
    case "pullrequest:rejected":
      return formatMessage(
        `${payload.actor.username} has rejected an Pull Request on ${payload.repository.full_name}`
      );
    case "pullrequest:comment_updated":
      return formatMessage(
        `${payload.actor.username} has updated a comment on a Pull Request in ${payload.repository.full_name}`
      );
    case "issue:created":
      return formatMessage(
        `${payload.actor.username} has created an issue in ${payload.repository.full_name}`
      );
    case "issue:updated":
      return formatMessage(
        `${payload.actor.username} has updated an issue in ${payload.repository.full_name}`
      );
    case "issue:comment_created":
      return formatMessage(
        `${payload.actor.username} has left a comment on a Issue in ${payload.repository.full_name}`
      );
    default:
      return formatMessage(`No message found`);
  }
};

const formatMessage = (message: string, embed?: IMessageEmbeds): IMessageFormat => ({
  content: message,
  embeds: [embed],
});

const createRepoPushEmbed = (payload: IBitbucketPushChanges): IMessageEmbeds => ({
  title: payload.commits[0].hash,
  description: payload.commits[0].message,
  url: payload.links.html.href
});

const createCommentEmbed = (payload: IBitbucketComment): IMessageEmbeds => ({
  description: payload.content.html,
  url: payload.links.html.href
});
