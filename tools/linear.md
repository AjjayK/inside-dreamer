# Tool Server: linear

**ID:** 365b7805-0a17-46bb-b909-905d069a1c0c

**Short Description:** Integrate with Linear

## Description

Integrate with Linear

## Tools (23)

### list_comments

**Description:** List comments for a specific Linear issue

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "issueId"
  ],
  "properties": {
    "issueId": {
      "type": "string",
      "description": "The issue ID"
    }
  },
  "additionalProperties": false
}
```

### create_comment

**Description:** Create a comment on a specific Linear issue

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "issueId",
    "body"
  ],
  "properties": {
    "body": {
      "type": "string",
      "description": "The content of the comment as Markdown"
    },
    "issueId": {
      "type": "string",
      "description": "The issue ID"
    },
    "parentId": {
      "type": "string",
      "description": "A parent comment ID to reply to"
    }
  },
  "additionalProperties": false
}
```

### list_cycles

**Description:** Retrieve cycles for a specific Linear team

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId"
  ],
  "properties": {
    "type": {
      "enum": [
        "current",
        "previous",
        "next"
      ],
      "type": "string",
      "description": "Retrieve the current, previous, next, or all cycles. If no type is provided all cycles in the team will be returned"
    },
    "teamId": {
      "type": "string",
      "description": "The team ID"
    }
  },
  "additionalProperties": false
}
```

### get_document

**Description:** Retrieve a Linear document by ID or slug

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "The document ID or slug"
    }
  },
  "additionalProperties": false
}
```

### list_documents

**Description:** List documents in the user's Linear workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "after": {
      "type": "string",
      "description": "An ID to start from"
    },
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 250,
      "description": "The number of results to return (Max is 250)"
    },
    "query": {
      "type": "string",
      "description": "An optional search query"
    },
    "before": {
      "type": "string",
      "description": "An ID to end at"
    },
    "orderBy": {
      "enum": [
        "createdAt",
        "updatedAt"
      ],
      "type": "string",
      "default": "updatedAt",
      "description": "The order in which to return results"
    },
    "createdAt": {
      "type": "string",
      "description": "Return only documents created on or after this ISO-8601 date-time or duration. e.g. -P1D to get documents created in the last day"
    },
    "creatorId": {
      "type": "string",
      "description": "Filter by creator ID"
    },
    "projectId": {
      "type": "string",
      "description": "Filter by project ID"
    },
    "updatedAt": {
      "type": "string",
      "description": "Return only documents updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get documents updated in the last day"
    },
    "initiativeId": {
      "type": "string",
      "description": "Filter by initiative ID"
    },
    "includeArchived": {
      "type": "boolean",
      "default": false,
      "description": "Whether to include archived documents"
    }
  },
  "additionalProperties": false
}
```

### get_issue

**Description:** Retrieve detailed information about an issue by ID, including attachments and git branch name

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "The issue ID"
    }
  },
  "additionalProperties": false
}
```

### list_issues

**Description:** List issues in the user's Linear workspace. For my issues, use "me" as the assignee.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team": {
      "type": "string",
      "description": "The team name or ID to filter by"
    },
    "after": {
      "type": "string",
      "description": "An ID to start from"
    },
    "cycle": {
      "type": "string",
      "description": "The cycle name or ID to filter by"
    },
    "label": {
      "type": "string",
      "description": "A label name or ID to filter by"
    },
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 250,
      "description": "The number of results to return (Max is 250)"
    },
    "query": {
      "type": "string",
      "description": "Search for content in the issue title or description"
    },
    "state": {
      "type": "string",
      "description": "The state name or ID to filter by"
    },
    "before": {
      "type": "string",
      "description": "An ID to end at"
    },
    "orderBy": {
      "enum": [
        "createdAt",
        "updatedAt"
      ],
      "type": "string",
      "default": "updatedAt",
      "description": "The order in which to return results"
    },
    "project": {
      "type": "string",
      "description": "The project name or ID to filter by"
    },
    "assignee": {
      "type": "string",
      "description": "The assignee to filter by (User ID, name, email, or \"me\")"
    },
    "delegate": {
      "type": "string",
      "description": "An agent name or ID to filter by"
    },
    "parentId": {
      "type": "string",
      "description": "The parent issue ID to filter by"
    },
    "createdAt": {
      "type": "string",
      "description": "Return only issues created on or after this ISO-8601 date-time or duration. e.g. -P1D to get issues created in the last day"
    },
    "updatedAt": {
      "type": "string",
      "description": "Return only issues updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get issues updated in the last day"
    },
    "includeArchived": {
      "type": "boolean",
      "default": true,
      "description": "Whether to include archived issues"
    }
  },
  "additionalProperties": false
}
```

### create_issue

**Description:** Create a new Linear issue

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "title",
    "team"
  ],
  "properties": {
    "team": {
      "type": "string",
      "description": "The team name or ID"
    },
    "cycle": {
      "type": "string",
      "description": "The cycle name, number, or ID to add the issue to"
    },
    "links": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "url",
          "title"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "title": {
            "type": "string",
            "minLength": 1
          }
        },
        "additionalProperties": false
      },
      "description": "Array of link objects to attach to the issue. Each object must contain a valid `url` and a non-empty `title`."
    },
    "state": {
      "type": "string",
      "description": "The issue state type, name, or ID"
    },
    "title": {
      "type": "string",
      "description": "The issue title"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of label names or IDs to set on the issue (you can use label names directly, no need to look up IDs)"
    },
    "dueDate": {
      "type": "string",
      "description": "The due date for the issue in ISO format"
    },
    "project": {
      "type": "string",
      "description": "The project name or ID to add the issue to"
    },
    "assignee": {
      "type": "string",
      "description": "The user to assign (User ID, name, email, or \"me\")"
    },
    "delegate": {
      "type": "string",
      "description": "The agent name, displayName, or ID to delegate"
    },
    "parentId": {
      "type": "string",
      "description": "The parent issue ID, if this is a sub-issue"
    },
    "priority": {
      "type": "number",
      "description": "The issue priority. 0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low. Do not set this field unless explicitly requested."
    },
    "description": {
      "type": "string",
      "description": "The issue description as Markdown"
    }
  },
  "additionalProperties": false
}
```

### update_issue

**Description:** Update an existing Linear issue

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "The issue ID"
    },
    "cycle": {
      "type": "string",
      "description": "The cycle name, number, or ID"
    },
    "links": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "url",
          "title"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "title": {
            "type": "string",
            "minLength": 1
          }
        },
        "additionalProperties": false
      },
      "description": "Array of link objects to attach to the issue. Each object must contain a valid `url` and a non-empty `title`."
    },
    "state": {
      "type": "string",
      "description": "The issue state type, name, or ID"
    },
    "title": {
      "type": "string",
      "description": "The issue title"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of label names or IDs to set on the issue (you can use label names directly, no need to look up IDs)"
    },
    "dueDate": {
      "type": "string",
      "description": "The due date for the issue in ISO format"
    },
    "project": {
      "type": "string",
      "description": "The project name or ID to add the issue to"
    },
    "assignee": {
      "type": "string",
      "description": "The user to assign (User ID, name, email, or \"me\")"
    },
    "delegate": {
      "type": "string",
      "description": "The agent name, displayName, or ID to delegate"
    },
    "estimate": {
      "type": "number",
      "description": "The numerical issue estimate value"
    },
    "parentId": {
      "type": "string",
      "description": "The parent issue ID, if this is a sub-issue"
    },
    "priority": {
      "type": "number",
      "description": "The issue priority. 0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low. Do not set this field unless explicitly requested."
    },
    "description": {
      "type": "string",
      "description": "The issue description as Markdown"
    }
  },
  "additionalProperties": false
}
```

### list_issue_statuses

**Description:** List available issue statuses in a Linear team

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "team"
  ],
  "properties": {
    "team": {
      "type": "string",
      "description": "The team name or ID"
    }
  },
  "additionalProperties": false
}
```

### get_issue_status

**Description:** Retrieve detailed information about an issue status in Linear by name or ID

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "id",
    "name",
    "team"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "The ID of the issue status to retrieve"
    },
    "name": {
      "type": "string",
      "description": "The name of the issue status to retrieve"
    },
    "team": {
      "type": "string",
      "description": "The team name or ID"
    }
  },
  "additionalProperties": false
}
```

### list_issue_labels

**Description:** List available issue labels in a Linear workspace or team

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "name": {
      "type": "string",
      "description": "Filter by label name"
    },
    "team": {
      "type": "string",
      "description": "The team name or ID"
    },
    "after": {
      "type": "string",
      "description": "An ID to start from"
    },
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 250,
      "description": "The number of results to return (Max is 250)"
    },
    "before": {
      "type": "string",
      "description": "An ID to end at"
    },
    "orderBy": {
      "enum": [
        "createdAt",
        "updatedAt"
      ],
      "type": "string",
      "default": "updatedAt",
      "description": "The order in which to return results"
    }
  },
  "additionalProperties": false
}
```

### create_issue_label

**Description:** Create a new Linear issue label

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the label"
    },
    "color": {
      "type": "string",
      "description": "The color of the label (hex color code)"
    },
    "teamId": {
      "type": "string",
      "description": "The team UUID. If not provided, the label will be created as a workspace label"
    },
    "isGroup": {
      "type": "boolean",
      "default": false,
      "description": "Whether this is label group (cannot be applied to issues directly)"
    },
    "parentId": {
      "type": "string",
      "description": "The parent label UUID, if this is a child of a label group"
    },
    "description": {
      "type": "string",
      "description": "An optional description of the label"
    }
  },
  "additionalProperties": false
}
```

### list_projects

**Description:** List projects in the user's Linear workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team": {
      "type": "string",
      "description": "The team name or ID to filter by"
    },
    "after": {
      "type": "string",
      "description": "An ID to start from"
    },
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 250,
      "description": "The number of results to return (Max is 250)"
    },
    "query": {
      "type": "string",
      "description": "Search for content in the project name"
    },
    "state": {
      "type": "string",
      "description": "The state name or ID to filter by"
    },
    "before": {
      "type": "string",
      "description": "An ID to end at"
    },
    "member": {
      "type": "string",
      "description": "A team member to filter by (User ID, name, email, or \"me\")"
    },
    "orderBy": {
      "enum": [
        "createdAt",
        "updatedAt"
      ],
      "type": "string",
      "default": "updatedAt",
      "description": "The order in which to return results"
    },
    "createdAt": {
      "type": "string",
      "description": "Return only projects created on or after this ISO-8601 date-time or duration. e.g. -P1D to get projects created in the last day"
    },
    "updatedAt": {
      "type": "string",
      "description": "Return only projects updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get projects updated in the last day"
    },
    "initiative": {
      "type": "string",
      "description": "The initiative name or ID to filter by"
    },
    "includeArchived": {
      "type": "boolean",
      "default": false,
      "description": "Whether to include archived projects"
    }
  },
  "additionalProperties": false
}
```

### get_project

**Description:** Retrieve details of a specific project in Linear

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "The ID or name of the project to retrieve"
    }
  },
  "additionalProperties": false
}
```

### create_project

**Description:** Create a new project in Linear

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "name",
    "team"
  ],
  "properties": {
    "lead": {
      "type": "string",
      "description": "The user to assign (User ID, name, email, or \"me\")"
    },
    "name": {
      "type": "string",
      "description": "A descriptive name of the project"
    },
    "team": {
      "type": "string",
      "description": "The team name or ID"
    },
    "state": {
      "type": "string",
      "description": "The state of the project"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of labels or IDs to set on the project"
    },
    "summary": {
      "type": "string",
      "description": "A concise plaintext summary of the project (max 255 chars)"
    },
    "startDate": {
      "type": "string",
      "description": "The start date of the project in ISO format"
    },
    "targetDate": {
      "type": "string",
      "description": "The target date of the project in ISO format"
    },
    "description": {
      "type": "string",
      "description": "The full project description in Markdown format"
    }
  },
  "additionalProperties": false
}
```

### update_project

**Description:** Update an existing Linear project

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "The ID of the project to update"
    },
    "lead": {
      "type": "string",
      "description": "The user to assign (User ID, name, email, or \"me\")"
    },
    "name": {
      "type": "string",
      "description": "The new name of the project"
    },
    "state": {
      "type": "string",
      "description": "The state of the project"
    },
    "labels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of labels or IDs to set on the project"
    },
    "summary": {
      "type": "string",
      "description": "A concise plaintext summary of the project (max 255 chars)"
    },
    "startDate": {
      "type": "string",
      "description": "The start date of the project in ISO format"
    },
    "targetDate": {
      "type": "string",
      "description": "The target date of the project in ISO format"
    },
    "description": {
      "type": "string",
      "description": "The full project description in Markdown format"
    }
  },
  "additionalProperties": false
}
```

### list_project_labels

**Description:** List available project labels in the Linear workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "name": {
      "type": "string",
      "description": "Filter by label name"
    },
    "after": {
      "type": "string",
      "description": "An ID to start from"
    },
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 250,
      "description": "The number of results to return (Max is 250)"
    },
    "before": {
      "type": "string",
      "description": "An ID to end at"
    },
    "orderBy": {
      "enum": [
        "createdAt",
        "updatedAt"
      ],
      "type": "string",
      "default": "updatedAt",
      "description": "The order in which to return results"
    }
  },
  "additionalProperties": false
}
```

### list_teams

**Description:** List teams in the user's Linear workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "after": {
      "type": "string",
      "description": "An ID to start from"
    },
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 250,
      "description": "The number of results to return (Max is 250)"
    },
    "query": {
      "type": "string",
      "description": "An optional search query"
    },
    "before": {
      "type": "string",
      "description": "An ID to end at"
    },
    "orderBy": {
      "enum": [
        "createdAt",
        "updatedAt"
      ],
      "type": "string",
      "default": "updatedAt",
      "description": "The order in which to return results"
    },
    "createdAt": {
      "type": "string",
      "description": "Return only teams created on or after this ISO-8601 date-time or duration. e.g. -P1D to get teams created in the last day"
    },
    "updatedAt": {
      "type": "string",
      "description": "Return only teams updated on or after this ISO-8601 date-time or duration. e.g. -P1D to get teams updated in the last day"
    },
    "includeArchived": {
      "type": "boolean",
      "default": false,
      "description": "Whether to include archived teams"
    }
  },
  "additionalProperties": false
}
```

### get_team

**Description:** Retrieve details of a specific Linear team

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "The UUID, key, or name of the team to retrieve"
    }
  },
  "additionalProperties": false
}
```

### list_users

**Description:** Retrieve users in the Linear workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "query": {
      "type": "string",
      "description": "Optional query to filter users by name or email"
    }
  },
  "additionalProperties": false
}
```

### get_user

**Description:** Retrieve details of a specific Linear user

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "The user to retrieve (User ID, name, email, or \"me\")"
    }
  },
  "additionalProperties": false
}
```

### search_documentation

**Description:** Search Linear's documentation to learn about features and usage

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "default": 0,
      "description": "The page number"
    },
    "query": {
      "type": "string",
      "description": "The search query"
    }
  },
  "additionalProperties": false
}
```

