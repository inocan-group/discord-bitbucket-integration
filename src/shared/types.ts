import { url } from "common-types";

interface ILinks {
  commits?: {
    href: url;
  };
  self?: {
    href: url;
  };
  html: {
    href: url;
  };
  avatar?: {
    href: url;
  };
  diff?: {
    href: url;
  };
  comments?: {
    href: url;
  };
  patch?: {
    href: url;
  };
  approve?: {
    href: url;
  };
  statuses?: {
    href: url
  };
}

interface ISummary {
  raw: string;
  markup: string;
  html: string;
  type: string;
}

interface IParent {
  type: string;
  hash: string;
  links: ILinks;
}

interface IAuthor {
  raw: string;
  type: string;
  user: IBitbucketOwner;
}

interface IBranchState {
  target: {
    hash: string;
    links: ILinks;
    author: IAuthor;
    summary: ISummary;
    parents: IParent[];
    date: string;
    message: string;
    type: string;
  };
  links: ILinks;
  default_merge_strategy: string;
  merge_strategies?: string[];
  type?: string;
  name?: string;
}

interface IBranchCommits {
  hash: string;
  links: ILinks;
  author: IAuthor;
  summary: ISummary;
  parents: IParent[];
  date: string;
  message: string;
  type: string;
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
  account_id?: string;
  uuid: string;
  links: ILinks;
}

export interface IBitbucketPushChanges {
  force: boolean;
  old: IBranchState,
  links: ILinks;
  truncated: boolean;
  commits: IBranchCommits[];
  created: boolean;
  closed: boolean;
  new: IBranchState
}

export interface IBitbucketPullRequest {
  id: number;
  title: string;
  description: string;
  state: PullRequestState;
  author: IBitbucketOwner,
  source: {
    branch: { name: string },
    commit: { hash: string },
    repository: IBitbucketRepository
  },
  destination: {
    branch: { name: string },
    commit: { hash: string },
    repository: IBitbucketRepository
  },
  merge_commit: { hash: string },
  participants: IBitbucketOwner[];
  reviewers: IBitbucketOwner[];
  close_source_branch: boolean,
  closed_by: IBitbucketOwner,
  reason: string;
  created_on: string;
  updated_on: string;
  links: ILinks;
}


export interface IBitbucketApproval {
  date: string;
  user: IBitbucketOwner
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
type PullRequestState = 'OPEN' | 'MERGED' | 'DECLINED';
type IssueType = 'bug' | 'enhancement' | 'proposal' | 'task';
export type BitbucketKind =
  "repo:push"
  | "repo:updated"
  | "repo:commit_comment_created"
  | "repo:transfer"
  | "pullrequest:created"
  | "pullrequest:updated"
  | "pullrequest:approved"
  | "pullrequest:unapproved"
  | "pullrequest:fulfilled"
  | "pullrequest:rejected"
  | "pullrequest:comment_created"
  | "pullrequest:comment_updated"
  | "pullrequest:comment_deleted"
  | "issue:created"
  | "issue:updated"
  | "issue:comment_created";

export interface IBitbucketRepositoryBase {
  kind: BitbucketKind;
}

export type BitbucketType =
  IBitbucketRepositoryPush
  | IBitbucketRepositoryUpdated
  | IBitbucketRepositoryTransfer
  | IBitbucketRepositoryCommitCommentCreated
  | IBitbucketRepositoryPullRequestCreated
  | IBitbucketRepositoryPullRequestUpdated
  | IBitbucketRepositoryPullRequestApproved
  | IBitbucketRepositoryPullRequestUnapproved
  | IBitbucketRepositoryPullRequestMerged
  | IBitbucketRepositoryPullRequestRejected
  | IBitbucketRepositoryPullRequestCommentCreated
  | IBitbucketRepositoryPullRequestCommentUpdated
  | IBitbucketRepositoryPullRequestCommentDeleted
  | IBitbucketRepositoryIssueCreated
  | IBitbucketRepositoryIssueUpdated
  | IBitbucketRepositoryIssueCommentCreated;

interface IBitbucketContent {
  raw: string;
  html: string;
  markup: string;
}

export interface IBitbucketRepoChanges {
  name: IBitbucketOldNew;
  website: IBitbucketOldNew;
  language: IBitbucketOldNew;
  links: {
    new: ILinks,
    old: ILinks;
  };
  description: IBitbucketOldNew;
  full_name: IBitbucketOldNew;
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

export interface IBitbucketRepositoryPush extends IBitbucketRepositoryBase {
  kind: "repo:push";
  actor: IBitbucketOwner;
  repository: IBitbucketRepository;
  push: {
    changes: IBitbucketPushChanges[]
  }
}

interface IBitbucketOldNew {
  new: string;
  old: string;
}

export interface IBitbucketRepositoryUpdated extends IBitbucketRepositoryBase {
  kind: "repo:updated";
  actor: IBitbucketOwner;
  repository: IBitbucketRepository;
  changes: IBitbucketRepoChanges
}

export interface IBitbucketRepositoryTransfer extends IBitbucketRepositoryBase {
  kind: "repo:transfer";
  actor: IBitbucketOwner;
  repository: IBitbucketRepository;
  previous_owner: IBitbucketOwner
}

export interface IBitbucketRepositoryCommitCommentCreated extends IBitbucketRepositoryBase {
  kind: "repo:commit_comment_created";
  actor: IBitbucketOwner;
  comment: IBitbucketComment;
  repository: IBitbucketRepository;
  commit: {
    hash: string;
  }
}

export interface IBitbucketRepositoryPullRequestCreated extends IBitbucketRepositoryBase {
  kind: "pullrequest:created";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
}

export interface IBitbucketRepositoryPullRequestUpdated extends IBitbucketRepositoryBase {
  kind: "pullrequest:updated";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
}

export interface IBitbucketRepositoryPullRequestApproved extends IBitbucketRepositoryBase {
  kind: "pullrequest:approved";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
  approval: IBitbucketApproval;
}

export interface IBitbucketRepositoryPullRequestUnapproved extends IBitbucketRepositoryBase {
  kind: "pullrequest:unapproved";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
  approval: {
    date: string;
    user: IBitbucketOwner
  }
}

export interface IBitbucketRepositoryPullRequestMerged extends IBitbucketRepositoryBase {
  kind: "pullrequest:fulfilled";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
}

export interface IBitbucketRepositoryPullRequestRejected extends IBitbucketRepositoryBase {
  kind: "pullrequest:rejected";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
}

export interface IBitbucketRepositoryPullRequestCommentCreated extends IBitbucketRepositoryBase {
  kind: "pullrequest:comment_created";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
  comment: IBitbucketComment;
}

export interface IBitbucketRepositoryPullRequestCommentUpdated extends IBitbucketRepositoryBase {
  kind: "pullrequest:comment_updated";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
  comment: IBitbucketComment;
}

export interface IBitbucketRepositoryPullRequestCommentDeleted extends IBitbucketRepositoryBase {
  kind: "pullrequest:comment_deleted";
  actor: IBitbucketOwner;
  pullrequest: IBitbucketPullRequest;
  repository: IBitbucketRepository;
  comment: IBitbucketComment;
}

export interface IBitbucketRepositoryIssueCreated extends IBitbucketRepositoryBase {
  kind: "issue:created";
  actor: IBitbucketOwner;
  issue: IBitbucketIssue;
  repository: IBitbucketRepository;
}

export interface IBitbucketRepositoryIssueUpdated extends IBitbucketRepositoryBase {
  kind: "issue:updated";
  actor: IBitbucketOwner;
  issue: IBitbucketIssue;
  repository: IBitbucketRepository;
  comment: IBitbucketComment;
  changes: {
    status: {
      old: string;
      new: string;
    }
  }
}

export interface IBitbucketRepositoryIssueCommentCreated extends IBitbucketRepositoryBase {
  kind: "issue:comment_created";
  actor: IBitbucketOwner;
  repository: IBitbucketRepository;
  issue: IBitbucketIssue;
  comment: IBitbucketComment;
}
