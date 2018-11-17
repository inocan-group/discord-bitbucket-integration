import { IDictionary } from "common-types";

export function createMessage(repo_name: string, user: string) {
    const messages: IDictionary = {
        'repo:push': `${user} has pushed changes to ${repo_name}`,
        'pullrequest:created': `${user} has created an Pull Request on ${repo_name}`,
        'pullrequest:updated': `${user} has updated an Pull Request on ${repo_name}`,
        'pullrequest:rejected': `${user} has rejected an Pull Request on ${repo_name}`,
        'pullrequest:comment_created': `${user} has commentted on a Pull Request in ${repo_name}`,
        'pullrequest:comment_updated': `${user} has updated a comment on a Pull Request in ${repo_name}`,
    };

    return (evKey: string) => {
        return messages[evKey] !== undefined
            ? messages[evKey]
            : `No message found for the following event key: ${evKey}`;
    }
};
