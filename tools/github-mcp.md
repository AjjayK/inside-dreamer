# Tool Server: github-mcp

**ID:** 36c200ea-124c-4730-9895-2b629023f899

**Short Description:** Provides access to various GitHub functions

## Tools (46)

### add_comment_to_pending_review

**Description:** Add review comment to the requester's latest pending pull request review. A pending review needs to already exist to call this (check with the user if not sure).

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "pullNumber",
    "path",
    "body",
    "subjectType"
  ],
  "properties": {
    "body": {
      "type": "string",
      "description": "The text of the review comment"
    },
    "line": {
      "type": "number",
      "description": "The line of the blob in the pull request diff that the comment applies to. For multi-line comments, the last line of the range"
    },
    "path": {
      "type": "string",
      "description": "The relative path to the file that necessitates a comment"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "side": {
      "enum": [
        "LEFT",
        "RIGHT"
      ],
      "type": "string",
      "description": "The side of the diff to comment on. LEFT indicates the previous state, RIGHT indicates the new state"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "startLine": {
      "type": "number",
      "description": "For multi-line comments, the first line of the range that the comment applies to"
    },
    "startSide": {
      "enum": [
        "LEFT",
        "RIGHT"
      ],
      "type": "string",
      "description": "For multi-line comments, the starting side of the diff that the comment applies to. LEFT indicates the previous state, RIGHT indicates the new state"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number"
    },
    "subjectType": {
      "enum": [
        "FILE",
        "LINE"
      ],
      "type": "string",
      "description": "The level at which the comment is targeted"
    }
  }
}
```

### add_issue_comment

**Description:** Add a comment to a specific issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number",
    "body"
  ],
  "properties": {
    "body": {
      "type": "string",
      "description": "Comment content"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "issue_number": {
      "type": "number",
      "description": "Issue number to comment on"
    }
  }
}
```

### add_sub_issue

**Description:** Add a sub-issue to a parent issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number",
    "sub_issue_id"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "issue_number": {
      "type": "number",
      "description": "The number of the parent issue"
    },
    "sub_issue_id": {
      "type": "number",
      "description": "The ID of the sub-issue to add. ID is not the same as issue number"
    },
    "replace_parent": {
      "type": "boolean",
      "description": "When true, replaces the sub-issue's current parent issue"
    }
  }
}
```

### assign_copilot_to_issue

**Description:** Assign Copilot to a specific issue in a GitHub repository.

This tool can help with the following outcomes:
- a Pull Request created with source code changes to resolve the issue


More information can be found at:
- https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/about-assigning-tasks-to-copilot


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issueNumber"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "issueNumber": {
      "type": "number",
      "description": "Issue number"
    }
  }
}
```

### create_branch

**Description:** Create a new branch in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "branch"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "branch": {
      "type": "string",
      "description": "Name for new branch"
    },
    "from_branch": {
      "type": "string",
      "description": "Source branch (defaults to repo default)"
    }
  }
}
```

### create_issue

**Description:** Create a new issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "title"
  ],
  "properties": {
    "body": {
      "type": "string",
      "description": "Issue body content"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "type": {
      "type": "string",
      "description": "Type of this issue"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "title": {
      "type": "string",
      "description": "Issue title"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Labels to apply to this issue"
    },
    "assignees": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Usernames to assign to this issue"
    },
    "milestone": {
      "type": "number",
      "description": "Milestone number"
    }
  }
}
```

### create_or_update_file

**Description:** Create or update a single file in a GitHub repository. If updating, you must provide the SHA of the file you want to update. Use this tool to create or update a file in a GitHub repository remotely; do not use it for local file operations.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "path",
    "content",
    "message",
    "branch"
  ],
  "properties": {
    "sha": {
      "type": "string",
      "description": "Required if updating an existing file. The blob SHA of the file being replaced."
    },
    "path": {
      "type": "string",
      "description": "Path where to create/update the file"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner (username or organization)"
    },
    "branch": {
      "type": "string",
      "description": "Branch to create/update the file in"
    },
    "content": {
      "type": "string",
      "description": "Content of the file"
    },
    "message": {
      "type": "string",
      "description": "Commit message"
    }
  }
}
```

### create_pull_request

**Description:** Create a new pull request in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "title",
    "head",
    "base"
  ],
  "properties": {
    "base": {
      "type": "string",
      "description": "Branch to merge into"
    },
    "body": {
      "type": "string",
      "description": "PR description"
    },
    "head": {
      "type": "string",
      "description": "Branch containing changes"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "draft": {
      "type": "boolean",
      "description": "Create as draft PR"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "title": {
      "type": "string",
      "description": "PR title"
    },
    "maintainer_can_modify": {
      "type": "boolean",
      "description": "Allow maintainer edits"
    }
  }
}
```

### create_repository

**Description:** Create a new GitHub repository in your account or specified organization

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "Repository name"
    },
    "private": {
      "type": "boolean",
      "description": "Whether repo should be private"
    },
    "autoInit": {
      "type": "boolean",
      "description": "Initialize with README"
    },
    "description": {
      "type": "string",
      "description": "Repository description"
    },
    "organization": {
      "type": "string",
      "description": "Organization to create the repository in (omit to create in your personal account)"
    }
  }
}
```

### delete_file

**Description:** Delete a file from a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "path",
    "message",
    "branch"
  ],
  "properties": {
    "path": {
      "type": "string",
      "description": "Path to the file to delete"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner (username or organization)"
    },
    "branch": {
      "type": "string",
      "description": "Branch to delete the file from"
    },
    "message": {
      "type": "string",
      "description": "Commit message"
    }
  }
}
```

### fork_repository

**Description:** Fork a GitHub repository to your account or specified organization

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "organization": {
      "type": "string",
      "description": "Organization to fork to"
    }
  }
}
```

### get_commit

**Description:** Get details for a commit from a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "sha"
  ],
  "properties": {
    "sha": {
      "type": "string",
      "description": "Commit SHA, branch name, or tag name"
    },
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    },
    "include_diff": {
      "type": "boolean",
      "default": true,
      "description": "Whether to include file diffs and stats in the response. Default is true."
    }
  }
}
```

### get_file_contents

**Description:** Get the contents of a file or directory from a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "ref": {
      "type": "string",
      "description": "Accepts optional git refs such as `refs/tags/{tag}`, `refs/heads/{branch}` or `refs/pull/{pr_number}/head`"
    },
    "sha": {
      "type": "string",
      "description": "Accepts optional commit SHA. If specified, it will be used instead of ref"
    },
    "path": {
      "type": "string",
      "default": "/",
      "description": "Path to file/directory (directories must end with a slash '/')"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner (username or organization)"
    }
  }
}
```

### get_issue

**Description:** Get details of a specific issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "The name of the repository"
    },
    "owner": {
      "type": "string",
      "description": "The owner of the repository"
    },
    "issue_number": {
      "type": "number",
      "description": "The number of the issue"
    }
  }
}
```

### get_issue_comments

**Description:** Get comments for a specific issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    },
    "issue_number": {
      "type": "number",
      "description": "Issue number"
    }
  }
}
```

### get_label

**Description:** Get a specific label from a repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "Label name."
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner (username or organization name)"
    }
  }
}
```

### get_latest_release

**Description:** Get the latest release in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    }
  }
}
```

### get_me

**Description:** Get details of the authenticated GitHub user. Use this when a request is about the user's own profile for GitHub. Or when information is missing to build other tool calls.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### get_release_by_tag

**Description:** Get a specific release by its tag name in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "tag"
  ],
  "properties": {
    "tag": {
      "type": "string",
      "description": "Tag name (e.g., 'v1.0.0')"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    }
  }
}
```

### get_tag

**Description:** Get details about a specific git tag in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "tag"
  ],
  "properties": {
    "tag": {
      "type": "string",
      "description": "Tag name"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    }
  }
}
```

### get_team_members

**Description:** Get member usernames of a specific team in an organization. Limited to organizations accessible with current credentials

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "org",
    "team_slug"
  ],
  "properties": {
    "org": {
      "type": "string",
      "description": "Organization login (owner) that contains the team."
    },
    "team_slug": {
      "type": "string",
      "description": "Team slug"
    }
  }
}
```

### get_teams

**Description:** Get details of the teams the user is a member of. Limited to organizations accessible with current credentials

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "user": {
      "type": "string",
      "description": "Username to get teams for. If not provided, uses the authenticated user."
    }
  }
}
```

### list_branches

**Description:** List branches in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### list_commits

**Description:** Get list of commits of a branch in a GitHub repository. Returns at least 30 results per page by default, but can return more if specified using the perPage parameter (up to 100).

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "sha": {
      "type": "string",
      "description": "Commit SHA, branch or tag name to list commits of. If not provided, uses the default branch of the repository. If a commit SHA is provided, will list commits up to that SHA."
    },
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "author": {
      "type": "string",
      "description": "Author username or email address to filter commits by"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### list_issue_types

**Description:** List supported issue types for repository owner (organization).

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner"
  ],
  "properties": {
    "owner": {
      "type": "string",
      "description": "The organization owner of the repository"
    }
  }
}
```

### list_issues

**Description:** List issues in a GitHub repository. For pagination, use the 'endCursor' from the previous response's 'pageInfo' in the 'after' parameter.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "after": {
      "type": "string",
      "description": "Cursor for pagination. Use the endCursor from the previous page's PageInfo for GraphQL APIs."
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "since": {
      "type": "string",
      "description": "Filter by date (ISO 8601 timestamp)"
    },
    "state": {
      "enum": [
        "OPEN",
        "CLOSED"
      ],
      "type": "string",
      "description": "Filter by state, by default both open and closed issues are returned when not provided"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Filter by labels"
    },
    "orderBy": {
      "enum": [
        "CREATED_AT",
        "UPDATED_AT",
        "COMMENTS"
      ],
      "type": "string",
      "description": "Order issues by field. If provided, the 'direction' also needs to be provided."
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    },
    "direction": {
      "enum": [
        "ASC",
        "DESC"
      ],
      "type": "string",
      "description": "Order direction. If provided, the 'orderBy' also needs to be provided."
    }
  }
}
```

### list_label

**Description:** List labels from a repository or an issue

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name - required for all operations"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner (username or organization name) - required for all operations"
    },
    "issue_number": {
      "type": "number",
      "description": "Issue number - if provided, lists labels on the specific issue"
    }
  }
}
```

### list_pull_requests

**Description:** List pull requests in a GitHub repository. If the user specifies an author, then DO NOT use this tool and use the search_pull_requests tool instead.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "base": {
      "type": "string",
      "description": "Filter by base branch"
    },
    "head": {
      "type": "string",
      "description": "Filter by head user/org and branch"
    },
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "sort": {
      "enum": [
        "created",
        "updated",
        "popularity",
        "long-running"
      ],
      "type": "string",
      "description": "Sort by"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "state": {
      "enum": [
        "open",
        "closed",
        "all"
      ],
      "type": "string",
      "description": "Filter by state"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    },
    "direction": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort direction"
    }
  }
}
```

### list_releases

**Description:** List releases in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### list_sub_issues

**Description:** List sub-issues for a specific issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number"
  ],
  "properties": {
    "page": {
      "type": "number",
      "description": "Page number for pagination (default: 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "per_page": {
      "type": "number",
      "description": "Number of results per page (max 100, default: 30)"
    },
    "issue_number": {
      "type": "number",
      "description": "Issue number"
    }
  }
}
```

### list_tags

**Description:** List git tags in a GitHub repository

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### merge_pull_request

**Description:** Merge a pull request in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "pullNumber"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number"
    },
    "commit_title": {
      "type": "string",
      "description": "Title for merge commit"
    },
    "merge_method": {
      "enum": [
        "merge",
        "squash",
        "rebase"
      ],
      "type": "string",
      "description": "Merge method"
    },
    "commit_message": {
      "type": "string",
      "description": "Extra detail for merge commit"
    }
  }
}
```

### pull_request_read

**Description:** Get information on a specific pull request in GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "method",
    "owner",
    "repo",
    "pullNumber"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "method": {
      "enum": [
        "get",
        "get_diff",
        "get_status",
        "get_files",
        "get_review_comments",
        "get_reviews"
      ],
      "type": "string",
      "description": "Action to specify what pull request data needs to be retrieved from GitHub. \nPossible options: \n 1. get - Get details of a specific pull request.\n 2. get_diff - Get the diff of a pull request.\n 3. get_status - Get status of a head commit in a pull request. This reflects status of builds and checks.\n 4. get_files - Get the list of files changed in a pull request. Use with pagination parameters to control the number of results returned.\n 5. get_review_comments - Get the review comments on a pull request. Use with pagination parameters to control the number of results returned.\n 6. get_reviews - Get the reviews on a pull request. When asked for review comments, use get_review_comments method.\n"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number"
    }
  }
}
```

### pull_request_review_write

**Description:** Create and/or submit, delete review of a pull request.

Available methods:
- create: Create a new review of a pull request. If "event" parameter is provided, the review is submitted. If "event" is omitted, a pending review is created.
- submit_pending: Submit an existing pending review of a pull request. This requires that a pending review exists for the current user on the specified pull request. The "body" and "event" parameters are used when submitting the review.
- delete_pending: Delete an existing pending review of a pull request. This requires that a pending review exists for the current user on the specified pull request.


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "method",
    "owner",
    "repo",
    "pullNumber"
  ],
  "properties": {
    "body": {
      "type": "string",
      "description": "Review comment text"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "event": {
      "enum": [
        "APPROVE",
        "REQUEST_CHANGES",
        "COMMENT"
      ],
      "type": "string",
      "description": "Review action to perform."
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "method": {
      "enum": [
        "create",
        "submit_pending",
        "delete_pending"
      ],
      "type": "string",
      "description": "The write operation to perform on pull request review."
    },
    "commitID": {
      "type": "string",
      "description": "SHA of commit to review"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number"
    }
  }
}
```

### push_files

**Description:** Push multiple files to a GitHub repository in a single commit

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "branch",
    "files",
    "message"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "path",
          "content"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "path to the file"
          },
          "content": {
            "type": "string",
            "description": "file content"
          }
        },
        "additionalProperties": false
      },
      "description": "Array of file objects to push, each object with path (string) and content (string)"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "branch": {
      "type": "string",
      "description": "Branch to push to"
    },
    "message": {
      "type": "string",
      "description": "Commit message"
    }
  }
}
```

### remove_sub_issue

**Description:** Remove a sub-issue from a parent issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number",
    "sub_issue_id"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "issue_number": {
      "type": "number",
      "description": "The number of the parent issue"
    },
    "sub_issue_id": {
      "type": "number",
      "description": "The ID of the sub-issue to remove. ID is not the same as issue number"
    }
  }
}
```

### reprioritize_sub_issue

**Description:** Reprioritize a sub-issue to a different position in the parent issue's sub-issue list.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number",
    "sub_issue_id"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "after_id": {
      "type": "number",
      "description": "The ID of the sub-issue to be prioritized after (either after_id OR before_id should be specified)"
    },
    "before_id": {
      "type": "number",
      "description": "The ID of the sub-issue to be prioritized before (either after_id OR before_id should be specified)"
    },
    "issue_number": {
      "type": "number",
      "description": "The number of the parent issue"
    },
    "sub_issue_id": {
      "type": "number",
      "description": "The ID of the sub-issue to reprioritize. ID is not the same as issue number"
    }
  }
}
```

### request_copilot_review

**Description:** Request a GitHub Copilot code review for a pull request. Use this for automated feedback on pull requests, usually before requesting a human reviewer.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "pullNumber"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number"
    }
  }
}
```

### search_code

**Description:** Fast and precise code search across ALL GitHub repositories using GitHub's native search engine. Best for finding exact symbols, functions, classes, or specific code patterns.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "sort": {
      "type": "string",
      "description": "Sort field ('indexed' only)"
    },
    "order": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort order for results"
    },
    "query": {
      "type": "string",
      "description": "Search query using GitHub's powerful code search syntax. Examples: 'content:Skill language:Java org:github', 'NOT is:archived language:Python OR language:go', 'repo:github/github-mcp-server'. Supports exact matching, language filters, path filters, and more."
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### search_issues

**Description:** Search for issues in GitHub repositories using issues search syntax already scoped to is:issue

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Optional repository name. If provided with owner, only issues for this repository are listed."
    },
    "sort": {
      "enum": [
        "comments",
        "reactions",
        "reactions-+1",
        "reactions--1",
        "reactions-smile",
        "reactions-thinking_face",
        "reactions-heart",
        "reactions-tada",
        "interactions",
        "created",
        "updated"
      ],
      "type": "string",
      "description": "Sort field by number of matches of categories, defaults to best match"
    },
    "order": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort order"
    },
    "owner": {
      "type": "string",
      "description": "Optional repository owner. If provided with repo, only issues for this repository are listed."
    },
    "query": {
      "type": "string",
      "description": "Search query using GitHub issues search syntax"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### search_pull_requests

**Description:** Search for pull requests in GitHub repositories using issues search syntax already scoped to is:pr

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "repo": {
      "type": "string",
      "description": "Optional repository name. If provided with owner, only pull requests for this repository are listed."
    },
    "sort": {
      "enum": [
        "comments",
        "reactions",
        "reactions-+1",
        "reactions--1",
        "reactions-smile",
        "reactions-thinking_face",
        "reactions-heart",
        "reactions-tada",
        "interactions",
        "created",
        "updated"
      ],
      "type": "string",
      "description": "Sort field by number of matches of categories, defaults to best match"
    },
    "order": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort order"
    },
    "owner": {
      "type": "string",
      "description": "Optional repository owner. If provided with repo, only pull requests for this repository are listed."
    },
    "query": {
      "type": "string",
      "description": "Search query using GitHub pull request search syntax"
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### search_repositories

**Description:** Find GitHub repositories by name, description, readme, topics, or other metadata. Perfect for discovering projects, finding examples, or locating specific repositories across GitHub.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "sort": {
      "enum": [
        "stars",
        "forks",
        "help-wanted-issues",
        "updated"
      ],
      "type": "string",
      "description": "Sort repositories by field, defaults to best match"
    },
    "order": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort order"
    },
    "query": {
      "type": "string",
      "description": "Repository search query. Examples: 'machine learning in:name stars:>1000 language:python', 'topic:react', 'user:facebook'. Supports advanced search syntax for precise filtering."
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    },
    "minimal_output": {
      "type": "boolean",
      "default": true,
      "description": "Return minimal repository information (default: true). When false, returns full GitHub API repository objects."
    }
  }
}
```

### search_users

**Description:** Find GitHub users by username, real name, or other profile information. Useful for locating developers, contributors, or team members.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "minimum": 1,
      "description": "Page number for pagination (min 1)"
    },
    "sort": {
      "enum": [
        "followers",
        "repositories",
        "joined"
      ],
      "type": "string",
      "description": "Sort users by number of followers or repositories, or when the person joined GitHub."
    },
    "order": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort order"
    },
    "query": {
      "type": "string",
      "description": "User search query. Examples: 'john smith', 'location:seattle', 'followers:>100'. Search is automatically scoped to type:user."
    },
    "perPage": {
      "type": "number",
      "maximum": 100,
      "minimum": 1,
      "description": "Results per page for pagination (min 1, max 100)"
    }
  }
}
```

### update_issue

**Description:** Update an existing issue in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "issue_number"
  ],
  "properties": {
    "body": {
      "type": "string",
      "description": "New description"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "type": {
      "type": "string",
      "description": "New issue type"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "state": {
      "enum": [
        "open",
        "closed"
      ],
      "type": "string",
      "description": "New state"
    },
    "title": {
      "type": "string",
      "description": "New title"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "New labels"
    },
    "assignees": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "New assignees"
    },
    "milestone": {
      "type": "number",
      "description": "New milestone number"
    },
    "duplicate_of": {
      "type": "number",
      "description": "Issue number that this issue is a duplicate of. Only used when state_reason is 'duplicate'."
    },
    "issue_number": {
      "type": "number",
      "description": "Issue number to update"
    },
    "state_reason": {
      "enum": [
        "completed",
        "not_planned",
        "duplicate"
      ],
      "type": "string",
      "description": "Reason for the state change. Ignored unless state is changed."
    }
  }
}
```

### update_pull_request

**Description:** Update an existing pull request in a GitHub repository.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "pullNumber"
  ],
  "properties": {
    "base": {
      "type": "string",
      "description": "New base branch name"
    },
    "body": {
      "type": "string",
      "description": "New description"
    },
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "draft": {
      "type": "boolean",
      "description": "Mark pull request as draft (true) or ready for review (false)"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "state": {
      "enum": [
        "open",
        "closed"
      ],
      "type": "string",
      "description": "New state"
    },
    "title": {
      "type": "string",
      "description": "New title"
    },
    "reviewers": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "GitHub usernames to request reviews from"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number to update"
    },
    "maintainer_can_modify": {
      "type": "boolean",
      "description": "Allow maintainer edits"
    }
  }
}
```

### update_pull_request_branch

**Description:** Update the branch of a pull request with the latest changes from the base branch.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "owner",
    "repo",
    "pullNumber"
  ],
  "properties": {
    "repo": {
      "type": "string",
      "description": "Repository name"
    },
    "owner": {
      "type": "string",
      "description": "Repository owner"
    },
    "pullNumber": {
      "type": "number",
      "description": "Pull request number"
    },
    "expectedHeadSha": {
      "type": "string",
      "description": "The expected SHA of the pull request's HEAD ref"
    }
  }
}
```

