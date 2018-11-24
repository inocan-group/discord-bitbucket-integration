import { IDictionary } from "common-types";
import { IBitbucketRepository, IBitbucketOwner } from "./types";

export function createMessage(repository: IBitbucketRepository, user: IBitbucketOwner) {
    const messages: IDictionary = {
        'repo:push': `${user.username} has pushed changes to ${repository.full_name}`,
        'pullrequest:created': `${user.username} has created an Pull Request on ${repository.full_name}`,
        'pullrequest:updated': `${user.username} has updated an Pull Request on ${repository.full_name}`,
        'pullrequest:rejected': `${user.username} has rejected an Pull Request on ${repository.full_name}`,
        'pullrequest:comment_created': `${user.username} has left a comment on a Pull Request in ${repository.full_name}`,
        'pullrequest:comment_updated': `${user.username} has updated a comment on a Pull Request in ${repository.full_name}`,
        'issue:created': `${user.username} has created an issue in ${repository.full_name}`,
        'issue:updated': `${user.username} has updated an issue in ${repository.full_name}`,
        'issue:comment_created': `${user.username} has left a comment on a Issue in ${repository.full_name}`,
    };

    return (evKey: string) :string => {
        return messages[evKey] !== undefined
            ? messages[evKey]
            : `No message found for the following event key: ${evKey}`;
    }
};
