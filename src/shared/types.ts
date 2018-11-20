import { url, IDictionary } from "common-types";

interface ILinks {
    self?: {
        href: url;
    };
    html: {
        href: url;
    };
    avatar?: {
        href: url;
    }
}

export interface IBitbucketProject {
    type: string;
    project: string;
    uuid: string;
    links: ILinks;
    key: string;
}

export interface IBitbucketOwner {
    type: string;
    username: string;
    nickname: string;
    display_name: string;
    uuid: string;
    links: ILinks;
}

export interface IBitbucketRepository {
    type: string;
    links: ILinks;
    uuid: string;
    project?: IBitbucketProject;
    full_name: string;
    name: string;
    website: url;
    owner?: IBitbucketOwner;
    scm: string;
    is_private?: boolean;
}

type IssuePriority = 'trivial' | 'minor' | 'major' | 'critical' | 'blocker';
type IssueState = 'new' | 'open' | 'on hold' | 'resolved' | 'duplicate' | 'invalid' | 'wontfix' | 'closed';
type IssueType = 'bug' | 'enhancement' | 'proposal' | 'task';

interface IBitbucketContent {
    raw: string;
    html: string;
    markup: string;
}

export interface IBitbucketIssue {
    id: number;
    component: string;
    title: string;
    content: IBitbucketContent;
    priority: IssuePriority;
    state: IssueState;
    type: IssueType;
    milestone: { name: string };
    version: { name: string };
    links: ILinks;
}

export interface IBitbucketComment {
    id: number;
    parent: { id: number };
    content: IBitbucketContent;
    inline: {
        path: string;
        from?: number | null;
        to?: number
    };
    links: ILinks;
}

export interface IBitbucketRepositoryPushPayload {
    actor: IBitbucketOwner;
    repository: IBitbucketRepository;
}

export interface IBitbucketRepositoryCommitCommentCreatedPayload {
    actor: IBitbucketOwner;
    comment: IBitbucketComment;
    repository: IBitbucketRepository;
    commit: {
        hash: string;
    }
}
