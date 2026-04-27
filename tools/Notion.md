# Tool Server: Notion

**ID:** 3d6ce35d-3c08-410f-95b0-d9537c912f6f

**Short Description:** Connect Dreamer to Notion to allow sidekick to interact with your Notion workspace.

## Description

Connect Dreamer to Notion to allow sidekick to interact with your Notion workspace.

## Tools (12)

### notion-search

**Description:** Perform a search over:
- "internal": Semantic search over Notion workspace and connected sources (Slack, Google Drive, Github, Jira, Microsoft Teams, Sharepoint, OneDrive, Linear). Supports filtering by creation date and creator.
- "user": Search for users by name or email.

Auto-selects AI search (with connected sources) or workspace search (workspace-only, faster) based on user's access to Notion AI. Use content_search_mode to override.
Use "fetch" tool for full page/database contents after getting search results.
To search within a database: First fetch the database to get the data source URL (collection://...) from <data-source url="..."> tags, then use that as data_source_url. For multi-source databases, match by view ID (?v=...) in URL or search all sources separately.
Don't combine database URL/ID with collection:// prefix for data_source_url. Don't use database URL as page_url.
		<example description="Search with date range filter (only documents created in 2024)">
		{
			"query": "quarterly revenue report",
			"query_type": "internal",
			"filters": {
				"created_date_range": {
					"start_date": "2024-01-01",
					"end_date": "2025-01-01"
				}
			}
		}
		</example>
		<example description="Teamspace + creator filter">
		{"query": "project updates", "query_type": "internal", "teamspace_id": "f336d0bc-b841-465b-8045-024475c079dd", "filters": {"created_by_user_ids": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"]}}
		</example>
		<example description="Database with date + creator filters">
		{"query": "design review", "data_source_url": "collection://f336d0bc-b841-465b-8045-024475c079dd", "filters": {"created_date_range": {"start_date": "2024-10-01"}, "created_by_user_ids": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890", "b2c3d4e5-f6a7-8901-bcde-f12345678901"]}}
		</example>
		<example description="User search">
		{"query": "john@example.com", "query_type": "user"}
		</example>

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
      "minLength": 1,
      "description": "Semantic search query over your entire Notion workspace and connected sources (Slack, Google Drive, Github, Jira, Microsoft Teams, Sharepoint, OneDrive, or Linear). For best results, don't provide more than one question per tool call. Use a separate \"search\" tool call for each search you want to perform.\nAlternatively, the query can be a substring or keyword to find users by matching against their name or email address. For example: \"john\" or \"john@example.com\""
    },
    "filters": {
      "type": "object",
      "properties": {
        "created_date_range": {
          "type": "object",
          "properties": {
            "end_date": {
              "type": "string",
              "format": "date",
              "description": "The end date of the date range as an ISO 8601 date string, if any."
            },
            "start_date": {
              "type": "string",
              "format": "date",
              "description": "The start date of the date range as an ISO 8601 date string, if any."
            }
          },
          "description": "Optional filter to only produce search results created within the specified date range.",
          "additionalProperties": true
        },
        "created_by_user_ids": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "maxItems": 100,
          "description": "Optional filter to only produce search results created by the Notion users that have the specified user IDs."
        }
      },
      "description": "Optionally provide filters to apply to the search results. Only valid when query_type is 'internal'.",
      "additionalProperties": true
    },
    "page_url": {
      "type": "string",
      "description": "Optionally, provide the URL or ID of a page to search within. This will perform a semantic search over the content within and under the specified page. Accepts either a full page URL (e.g. https://notion.so/workspace/Page-Title-1234567890) or just the page ID (UUIDv4) with or without dashes."
    },
    "query_type": {
      "enum": [
        "internal",
        "user"
      ],
      "type": "string"
    },
    "teamspace_id": {
      "type": "string",
      "description": "Optionally, provide the ID of a teamspace to restrict search results to. This will perform a search over content within the specified teamspace only. Accepts the teamspace ID (UUIDv4) with or without dashes."
    },
    "data_source_url": {
      "type": "string",
      "description": "Optionally, provide the URL of a Data source to search. This will perform a semantic search over the pages in the Data Source. Note: must be a Data Source, not a Database. <data-source> tags are part of the Notion flavored Markdown format returned by tools like fetch. The full spec is available in the create-pages tool description."
    },
    "content_search_mode": {
      "enum": [
        "workspace_search",
        "ai_search"
      ],
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### notion-fetch

**Description:** Retrieves details about a Notion entity (page, database, or data source) by URL or ID.
Provide URL or ID in `id` parameter. Make multiple calls to fetch multiple entities.
Pages use enhanced Markdown format. For the complete specification, fetch the MCP resource at `notion://docs/enhanced-markdown-spec`.
Databases return all data sources (collections). Each data source has a unique ID shown in `<data-source url="collection://...">` tags. You can pass a data source ID directly to this tool to fetch details about that specific data source, including its schema and properties. Use data source IDs with update_data_source and query_data_sources tools. Multi-source databases (e.g., with linked sources) will show multiple data sources.
Set `include_discussions` to true to see discussion counts and inline discussion markers that correlate with the `get_comments` tool. The page output will include a `<page-discussions>` summary tag with discussion count, preview snippets, and `discussion://` URLs that match the discussion IDs returned by `get_comments`.
<example>{"id": "https://notion.so/workspace/Page-a1b2c3d4e5f67890"}</example>
<example>{"id": "12345678-90ab-cdef-1234-567890abcdef"}</example>
<example>{"id": "https://myspace.notion.site/Page-Title-abc123def456"}</example>
<example>{"id": "page-uuid", "include_discussions": true}</example>
<example>{"id": "collection://12345678-90ab-cdef-1234-567890abcdef"}</example>

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
      "description": "The ID or URL of the Notion page, database, or data source to fetch. Supports notion.so URLs, Notion Sites URLs (*.notion.site), raw UUIDs, and data source URLs (collection://...)."
    },
    "include_transcript": {
      "type": "boolean"
    },
    "include_discussions": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### notion-create-pages

**Description:** ## Overview
Creates one or more Notion pages, with the specified properties and content.
## Parent
All pages created with a single call to this tool will have the same parent. The parent can be a Notion page ("page_id") or data source ("data_source_id"). If the parent is omitted, the pages are created as standalone, workspace-level private pages, and the person that created them can organize them later as they see fit.
If you have a database URL, ALWAYS pass it to the "fetch" tool first to get the schema and URLs of each data source under the database. You can't use the "database_id" parent type if the database has more than one data source, so you'll need to identify which "data_source_id" to use based on the situation and the results from the fetch tool (data source URLs look like collection://<data_source_id>).
If you know the pages should be created under a data source, do NOT use the database ID or URL under the "page_id" parameter; "page_id" is only for regular, non-database pages.
## Content
Notion page content is a string in Notion-flavored Markdown format.
Don't include the page title at the top of the page's content. Only include it under "properties".
**IMPORTANT**: For the complete Markdown specification, always first fetch the MCP resource at `notion://docs/enhanced-markdown-spec`. Do NOT guess or hallucinate Markdown syntax. This spec is also applicable to other tools like update-page and fetch.
## Properties
Notion page properties are a JSON map of property names to SQLite values.
When creating pages in a database:
- Use the correct property names from the data source schema shown in the fetch tool results.
- Always include a title property. Data sources always have exactly one title property, but it may not be named "title", so, again, rely on the fetched data source schema.

For pages outside of a database:
- The only allowed property is "title",	which is the title of the page in inline markdown format. Always include a "title" property.

**IMPORTANT**: Some property types require expanded formats:
- Date properties: Split into "date:{property}:start", "date:{property}:end" (optional), and "date:{property}:is_datetime" (0 or 1)
- Place properties: Split into "place:{property}:name", "place:{property}:address", "place:{property}:latitude", "place:{property}:longitude", and "place:{property}:google_place_id" (optional)
- Number properties: Use JavaScript numbers (not strings)
- Checkbox properties: Use "__YES__" for checked, "__NO__" for unchecked

**Special property naming**: Properties named "id" or "url" (case insensitive) must be prefixed with "userDefined:" (e.g., "userDefined:URL", "userDefined:id")
## Templates
When creating a page in a database, you can apply a template to pre-populate it with content and property values. Use the "fetch" tool on a database to see available templates in the <templates> section of each data source.
When using a template:
- Pass the template's ID as "template_id" in the page object.
- Do NOT include "content" when using a template, as the template provides it.
- You can still set "properties" alongside the template to override template defaults.
- Template application is asynchronous. The page is created immediately but starts blank; the template content will appear shortly after.

## Examples
		<example description="Create a page from a database template">
		{
			"parent": {"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd"},
			"pages": [
				{
					"template_id": "a5da15f6-b853-455d-8827-f906fb52db2b",
					"properties": {
						"Task Name": "New urgent bug"
					}
				}
			]
		}
		</example>
		<example description="Create a standalone page with a title and content">
		{
			"pages": [
				{
					"properties": {"title": "Page title"},
					"content": "# Section 1 {color="blue"}
Section 1 content
<details>
<summary>Toggle block</summary>
	Hidden content inside toggle
</details>"
				}
			]
		}
		</example>
		<example description="Create a page under a database's data source">
		{
			"parent": {"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd"},
			"pages": [
				{
					"properties": {
						"Task Name": "Task 123",
						"Status": "In Progress",
						"Priority": 5,
						"Is Complete": "__YES__",
						"date:Due Date:start": "2024-12-25",
						"date:Due Date:is_datetime": 0
					}
				}
			]
		}
		</example>
		<example description="Create a page with an existing page as a parent">
		{
			"parent": {"page_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"},
			"pages": [
				{
					"properties": {"title": "Page title"},
					"content": "# Section 1
Section 1 content
# Section 2
Section 2 content"
				}
			]
		}
		</example>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "pages"
  ],
  "properties": {
    "pages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "content": {
            "type": "string",
            "description": "The content of the new page, using Notion Markdown."
          },
          "properties": {
            "type": "object",
            "description": "The properties of the new page, which is a JSON map of property names to SQLite values. For pages in a database, use the SQLite schema definition shown in <database>. For pages outside of a database, the only allowed property is \"title\", which is the title of the page and is automatically shown at the top of the page as a large heading.",
            "additionalProperties": {
              "type": [
                "string",
                "number",
                "null"
              ]
            }
          },
          "template_id": {
            "type": "string",
            "description": "The ID of a template to apply to this page. When specified, do not provide 'content' as the template will provide it. Properties can still be set alongside the template. Get template IDs from the <templates> section in the fetch tool results."
          }
        },
        "additionalProperties": false
      },
      "maxItems": 100,
      "description": "The pages to create."
    },
    "parent": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "page_id"
          ],
          "properties": {
            "type": {
              "enum": [
                "page_id"
              ],
              "type": "string"
            },
            "page_id": {
              "type": "string",
              "description": "The ID of the parent page (with or without dashes), for example, 195de9221179449fab8075a27c979105"
            }
          },
          "additionalProperties": true
        },
        {
          "type": "object",
          "required": [
            "database_id"
          ],
          "properties": {
            "type": {
              "enum": [
                "database_id"
              ],
              "type": "string"
            },
            "database_id": {
              "type": "string",
              "description": "The ID of the parent database (with or without dashes), for example, 195de9221179449fab8075a27c979105"
            }
          },
          "additionalProperties": true
        },
        {
          "type": "object",
          "required": [
            "data_source_id"
          ],
          "properties": {
            "type": {
              "enum": [
                "data_source_id"
              ],
              "type": "string"
            },
            "data_source_id": {
              "type": "string",
              "description": "The ID of the parent data source (collection), with or without dashes. For example, f336d0bc-b841-465b-8045-024475c079dd"
            }
          },
          "additionalProperties": true
        }
      ],
      "description": "The parent under which the new pages will be created. This can be a page (page_id), a database page (database_id), or a data source/collection under a database (data_source_id). If omitted, the new pages will be created as private pages at the workspace level. Use data_source_id when you have a collection:// URL from the fetch tool."
    }
  },
  "additionalProperties": false
}
```

### notion-update-page

**Description:** ## Overview
Update a Notion page's properties or content.
## Properties
Notion page properties are a JSON map of property names to SQLite values.
For pages in a database:
- ALWAYS use the "fetch" tool first to get the data source schema and the	exact property names.
- Provide a non-null value to update a property's value.
- Omitted properties are left unchanged.

**IMPORTANT**: Some property types require expanded formats:
- Date properties: Split into "date:{property}:start", "date:{property}:end" (optional), and "date:{property}:is_datetime" (0 or 1)
- Place properties: Split into "place:{property}:name", "place:{property}:address", "place:{property}:latitude", "place:{property}:longitude", and "place:{property}:google_place_id" (optional)
- Number properties: Use JavaScript numbers (not strings)
- Checkbox properties: Use "__YES__" for checked, "__NO__" for unchecked

**Special property naming**: Properties named "id" or "url" (case insensitive) must be prefixed with "userDefined:" (e.g., "userDefined:URL", "userDefined:id")
For pages outside of a database:
- The only allowed property is "title",	which is the title of the page in inline markdown format.

## Content
Notion page content is a string in Notion-flavored Markdown format.
**IMPORTANT**: For the complete Markdown specification, first fetch the MCP resource at `notion://docs/enhanced-markdown-spec`. Do NOT guess or hallucinate Markdown syntax.
Before updating a page's content with this tool, use the "fetch" tool first to get the existing content to find out the Markdown snippets to use in the "update_content" command's old_str fields.
### Preserving Child Pages and Databases
When using "replace_content", the operation will check if any child pages or databases would be deleted. If so, it will fail with an error listing the affected items.
To preserve child pages/databases, include them in new_str using `<page url="...">` or `<database url="...">` tags. Get the exact URLs from the "fetch" tool output.
**CRITICAL**: To intentionally delete child content: if the call failed with validation and requires `allow_deleting_content` to be true, DO NOT automatically assume the content should be deleted. ALWAYS show the list of pages to be deleted and ask for user confirmation before proceeding.
## Examples
		<example description="Update page properties">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_properties",
			"properties": {
				"title": "New Page Title",
				"status": "In Progress",
				"priority": 5,
				"checkbox": "__YES__",
				"date:deadline:start": "2024-12-25",
				"date:deadline:is_datetime": 0,
				"place:office:name": "HQ",
				"place:office:latitude": 37.7749,
				"place:office:longitude": -122.4194
			}
		}
		</example>
		<example description="Replace the entire content of a page">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "replace_content",
			"new_str": "# New Section
Updated content goes here"
		}
		</example>
		<example description="Update specific content in a page (search-and-replace)">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_content",
			"content_updates": [
				{
					"old_str": "# Old Section
Old content here",
					"new_str": "# New Section
Updated content goes here"
				}
			]
		}
		</example>
		<example description="Insert content after a specific location">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_content",
			"content_updates": [
				{
					"old_str": "## Previous section
Existing content",
					"new_str": "## Previous section
Existing content

## New Section
Content to insert goes here"
				}
			]
		}
		</example>
		<example description="Multiple content updates in a single call">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_content",
			"content_updates": [
				{
					"old_str": "Old text 1",
					"new_str": "New text 1"
				},
				{
					"old_str": "Old text 2",
					"new_str": "New text 2"
				}
			]
		}
		</example>
## Templates
You can apply a template to an existing page using the "apply_template" command. The template content is appended to the page asynchronously. Get template IDs from the <templates> section in the fetch tool results for a database, or use any page ID as a template.
		<example description="Apply a template to an existing page">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "apply_template",
			"template_id": "a5da15f6-b853-455d-8827-f906fb52db2b"
		}
		</example>
## Verification
You can verify or unverify a page using the "update_verification" command. Verification marks a page as reviewed and up-to-date. Requires a Business or Enterprise plan (or the page must be in a wiki).
		<example description="Verify a page for 90 days">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_verification",
			"verification_status": "verified",
			"verification_expiry_days": 90
		}
		</example>
		<example description="Verify a page indefinitely">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_verification",
			"verification_status": "verified"
		}
		</example>
		<example description="Remove verification from a page">
		{
			"page_id": "f336d0bc-b841-465b-8045-024475c079dd",
			"command": "update_verification",
			"verification_status": "unverified"
		}
		</example>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "page_id",
    "command"
  ],
  "properties": {
    "command": {
      "enum": [
        "update_properties",
        "update_content",
        "replace_content",
        "apply_template",
        "update_verification"
      ],
      "type": "string"
    },
    "new_str": {
      "type": "string",
      "description": "Required for \"replace_content\" command. The new content string to replace the entire page content with."
    },
    "page_id": {
      "type": "string",
      "description": "The ID of the page to update, with or without dashes."
    },
    "properties": {
      "type": "object",
      "description": "Required for \"update_properties\" command. A JSON object that updates the page's properties. For pages in a database, use the SQLite schema definition shown in <database>. For pages outside of a database, the only allowed property is \"title\", which is the title of the page in inline markdown format. Use null to remove a property's value.",
      "additionalProperties": {
        "type": [
          "string",
          "number",
          "null"
        ]
      }
    },
    "template_id": {
      "type": "string",
      "description": "Required for \"apply_template\" command. The ID of a template to apply to this page. Template content is appended to any existing page content."
    },
    "content_updates": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "old_str",
          "new_str"
        ],
        "properties": {
          "new_str": {
            "type": "string",
            "description": "The new content string to replace old_str with."
          },
          "old_str": {
            "type": "string",
            "description": "The existing content string to find and replace. Must exactly match the page content."
          },
          "replace_all_matches": {
            "type": "boolean"
          }
        },
        "additionalProperties": true
      },
      "maxItems": 100,
      "description": "Required for \"update_content\" command. An array of search-and-replace operations, each with old_str (content to find) and new_str (replacement content)."
    },
    "verification_status": {
      "enum": [
        "verified",
        "unverified"
      ],
      "type": "string"
    },
    "allow_deleting_content": {
      "type": "boolean"
    },
    "verification_expiry_days": {
      "type": "integer",
      "minimum": 1,
      "description": "Optional for \"update_verification\" command when verification_status is \"verified\". Number of days until verification expires (e.g. 7, 30, 90). Omit for indefinite verification."
    }
  },
  "additionalProperties": false
}
```

### notion-move-pages

**Description:** Move one or more Notion pages or databases to a new parent.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "page_or_database_ids",
    "new_parent"
  ],
  "properties": {
    "new_parent": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "page_id"
          ],
          "properties": {
            "type": {
              "enum": [
                "page_id"
              ],
              "type": "string"
            },
            "page_id": {
              "type": "string",
              "description": "The ID of the parent page (with or without dashes), for example, 195de9221179449fab8075a27c979105"
            }
          },
          "additionalProperties": true
        },
        {
          "type": "object",
          "required": [
            "database_id"
          ],
          "properties": {
            "type": {
              "enum": [
                "database_id"
              ],
              "type": "string"
            },
            "database_id": {
              "type": "string",
              "description": "The ID of the parent database (with or without dashes), for example, 195de9221179449fab8075a27c979105"
            }
          },
          "additionalProperties": true
        },
        {
          "type": "object",
          "required": [
            "data_source_id"
          ],
          "properties": {
            "type": {
              "enum": [
                "data_source_id"
              ],
              "type": "string"
            },
            "data_source_id": {
              "type": "string",
              "description": "The ID of the parent data source (collection), with or without dashes. For example, f336d0bc-b841-465b-8045-024475c079dd"
            }
          },
          "additionalProperties": true
        },
        {
          "type": "object",
          "required": [
            "type"
          ],
          "properties": {
            "type": {
              "enum": [
                "workspace"
              ],
              "type": "string"
            }
          },
          "additionalProperties": true
        }
      ],
      "description": "The new parent under which the pages will be moved. This can be a page, the workspace, a database, or a specific data source under a database when there are multiple. Moving pages to the workspace level adds them as private pages and should rarely be used."
    },
    "page_or_database_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 100,
      "minItems": 1,
      "description": "An array of up to 100 page or database IDs to move. IDs are v4 UUIDs and can be supplied with or without dashes (e.g. extracted from a <page> or <database> URL given by the \"search\" or \"fetch\" tool). Data Sources under Databases can't be moved individually."
    }
  },
  "additionalProperties": false
}
```

### notion-duplicate-page

**Description:** Duplicate a Notion page. The page must be within the current workspace, and you must have permission to access it. The duplication completes asynchronously, so do not rely on the new page identified by the returned ID or URL to be populated immediately. Let the user know that the duplication is in progress and that they can check back later using the 'fetch' tool or by clicking the returned URL and viewing it in the Notion app.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "page_id"
  ],
  "properties": {
    "page_id": {
      "type": "string",
      "description": "The ID of the page to duplicate. This is a v4 UUID, with or without dashes, and can be parsed from a Notion page URL."
    }
  },
  "additionalProperties": false
}
```

### notion-create-database

**Description:** Creates a new Notion database using SQL DDL syntax.
If no title property provided, "Name" is auto-added. Returns Markdown with schema, SQLite definition, and data source ID in <data-source> tag for use with update_data_source and query_data_sources tools.
The schema param accepts a CREATE TABLE statement defining columns.
Type syntax:
- Simple: TITLE, RICH_TEXT, DATE, PEOPLE, CHECKBOX, URL, EMAIL, PHONE_NUMBER, STATUS, FILES
- SELECT('opt':color, ...) / MULTI_SELECT('opt':color, ...)
- NUMBER [FORMAT 'dollar'] / FORMULA('expression')
- RELATION('data_source_id') — one-way relation
- RELATION('data_source_id', DUAL) — two-way relation
- RELATION('data_source_id', DUAL 'synced_name') — two-way with synced property name
- RELATION('data_source_id', DUAL 'synced_name' 'synced_id') — two-way with synced name and ID (for self-relations)
- ROLLUP('rel_prop', 'target_prop', 'function')
- UNIQUE_ID [PREFIX 'X'] / CREATED_TIME / LAST_EDITED_TIME
- Any column: COMMENT 'description text' Colors: default, gray, brown, orange, yellow, green, blue, purple, pink, red

<example description="Minimal">{"schema": "CREATE TABLE ("Name" TITLE)"}</example>
<example description="Task DB">{"title": "Tasks", "schema": "CREATE TABLE ("Task Name" TITLE, "Status" SELECT('To Do':red, 'Done':green), "Due Date" DATE)"}</example>
<example description="With parent and options">{"parent": {"page_id": "f336d0bc-b841-465b-8045-024475c079dd"}, "title": "Projects", "schema": "CREATE TABLE ("Name" TITLE, "Budget" NUMBER FORMAT 'dollar', "Tags" MULTI_SELECT('eng':blue, 'design':pink), "Task ID" UNIQUE_ID PREFIX 'PRJ')"}</example>
<example description="Self-relation (two-step: create database first, then use its data source ID with update_data_source to add self-relations)">{"title": "Tasks", "schema": "CREATE TABLE ("Name" TITLE, "Parent" RELATION('ds_id', DUAL 'Children' 'children'), "Children" RELATION('ds_id', DUAL 'Parent' 'parent'))"}</example>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "schema"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "The title of the new database."
    },
    "parent": {
      "type": "object",
      "required": [
        "page_id"
      ],
      "properties": {
        "type": {
          "enum": [
            "page_id"
          ],
          "type": "string"
        },
        "page_id": {
          "type": "string",
          "description": "The ID of the parent page (with or without dashes), for example, 195de9221179449fab8075a27c979105"
        }
      },
      "description": "The parent under which to create the new database. If omitted, the database will be created as a private page at the workspace level.",
      "additionalProperties": true
    },
    "schema": {
      "type": "string",
      "description": "SQL DDL CREATE TABLE statement defining the database schema. Column names must be double-quoted, type options use single quotes."
    },
    "description": {
      "type": "string",
      "description": "The description of the new database."
    }
  },
  "additionalProperties": false
}
```

### notion-update-data-source

**Description:** Update a Notion data source's schema, title, or attributes using SQL DDL statements. Returns Markdown showing updated structure and schema.
Accepts a data source ID (collection ID from fetch response's <data-source> tag) or a single-source database ID. Multi-source databases require the specific data source ID.
The statements param accepts semicolon-separated DDL statements:
- ADD COLUMN "Name" <type> - add a new property
- DROP COLUMN "Name" - remove a property
- RENAME COLUMN "Old" TO "New" - rename a property
- ALTER COLUMN "Name" SET <type> - change type/options

Same type syntax as create_database. Key types:
- SELECT('opt':color, ...) / MULTI_SELECT('opt':color, ...)
- NUMBER [FORMAT 'dollar'] / FORMULA('expression')
- RELATION('ds_id') / RELATION('ds_id', DUAL) / RELATION('ds_id', DUAL 'synced_name' 'synced_id')
- ROLLUP('rel_prop', 'target_prop', 'function') / UNIQUE_ID [PREFIX 'X']
- Simple: TITLE, RICH_TEXT, DATE, PEOPLE, CHECKBOX, URL, EMAIL, PHONE_NUMBER, STATUS, FILES

<example description="Add properties">{"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd", "statements": "ADD COLUMN "Priority" SELECT('High':red, 'Medium':yellow, 'Low':green); ADD COLUMN "Due Date" DATE"}</example>
<example description="Rename property">{"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd", "statements": "RENAME COLUMN "Status" TO "Project Status""}</example>
<example description="Remove property">{"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd", "statements": "DROP COLUMN "Old Property""}</example>
<example description="Add self-relation">{"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd", "statements": "ADD COLUMN "Parent" RELATION('f336d0bc-b841-465b-8045-024475c079dd', DUAL 'Children' 'children'); ADD COLUMN "Children" RELATION('f336d0bc-b841-465b-8045-024475c079dd', DUAL 'Parent' 'parent')"}</example>
<example description="Update title">{"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd", "title": "Project Tracker 2024"}</example>
<example description="Trash data source">{"data_source_id": "f336d0bc-b841-465b-8045-024475c079dd", "in_trash": true}</example>
Notes: Cannot delete/create title properties. Max one unique_id property. Cannot update synced databases. Use "fetch" first to see current schema and get the data source ID from <data-source url="collection://..."> tags.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "data_source_id"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "The new title of the data source."
    },
    "in_trash": {
      "type": "boolean"
    },
    "is_inline": {
      "type": "boolean"
    },
    "statements": {
      "type": "string",
      "description": "Semicolon-separated SQL DDL statements to update the schema. Supports ADD COLUMN, DROP COLUMN, RENAME COLUMN, ALTER COLUMN SET."
    },
    "description": {
      "type": "string",
      "description": "The new description of the data source."
    },
    "data_source_id": {
      "type": "string",
      "description": "The ID of the data source to update. Can be a data source ID (collection ID, from fetch response's <data-source> tag) or a database ID (only if the database has a single data source). UUID format with or without dashes."
    }
  },
  "additionalProperties": false
}
```

### notion-create-comment

**Description:** Add a comment to a page or specific content.
Creates a new comment. Provide `page_id` to identify the page, then choose ONE targeting mode:
- `page_id` alone: Page-level comment on the entire page
- `page_id` + `selection_with_ellipsis`: Comment on specific block content
- `discussion_id`: Reply to an existing discussion thread (page_id is still required)

For content targeting, use `selection_with_ellipsis` with ~10 chars from start and end: "# Section Ti...tle content"
<example description="Page-level comment">
{"page_id": "uuid", "rich_text": [{"text": {"content": "Comment"}}]}
</example>
<example description="Comment on specific content">
{"page_id": "uuid", "selection_with_ellipsis": "# Meeting No...es heading",
 "rich_text": [{"text": {"content": "Comment on this section"}}]}
</example>
<example description="Reply to discussion">
{"page_id": "uuid", "discussion_id": "discussion://pageId/blockId/discussionId",
 "rich_text": [{"text": {"content": "Reply"}}]}
</example>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "rich_text",
    "page_id"
  ],
  "properties": {
    "page_id": {
      "type": "string",
      "description": "The ID of the page to comment on (with or without dashes)."
    },
    "rich_text": {
      "type": "array",
      "items": {
        "allOf": [
          {
            "type": "object",
            "properties": {
              "annotations": {
                "type": "object",
                "properties": {
                  "bold": {
                    "type": "boolean"
                  },
                  "code": {
                    "type": "boolean"
                  },
                  "color": {
                    "type": "string"
                  },
                  "italic": {
                    "type": "boolean"
                  },
                  "underline": {
                    "type": "boolean"
                  },
                  "strikethrough": {
                    "type": "boolean"
                  }
                },
                "description": "All rich text objects contain an annotations object that sets the styling for the rich text.",
                "additionalProperties": true
              }
            },
            "additionalProperties": true
          },
          {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "text"
                ],
                "properties": {
                  "text": {
                    "type": "object",
                    "required": [
                      "content"
                    ],
                    "properties": {
                      "link": {
                        "anyOf": [
                          {
                            "type": "object",
                            "required": [
                              "url"
                            ],
                            "properties": {
                              "url": {
                                "type": "string",
                                "description": "The URL of the link."
                              }
                            },
                            "additionalProperties": true
                          },
                          {
                            "type": "null"
                          }
                        ],
                        "description": "An object with information about any inline link in this text, if included."
                      },
                      "content": {
                        "type": "string",
                        "maxLength": 2000,
                        "description": "The actual text content of the text."
                      }
                    },
                    "description": "If a rich text object's type value is `text`, then the corresponding text field contains an object including the text content and any inline link.",
                    "additionalProperties": false
                  },
                  "type": {
                    "enum": [
                      "text"
                    ],
                    "type": "string"
                  }
                },
                "additionalProperties": true
              },
              {
                "type": "object",
                "required": [
                  "mention"
                ],
                "properties": {
                  "type": {
                    "enum": [
                      "mention"
                    ],
                    "type": "string"
                  },
                  "mention": {
                    "anyOf": [
                      {
                        "type": "object",
                        "required": [
                          "user"
                        ],
                        "properties": {
                          "type": {
                            "enum": [
                              "user"
                            ],
                            "type": "string"
                          },
                          "user": {
                            "type": "object",
                            "required": [
                              "id"
                            ],
                            "properties": {
                              "id": {
                                "type": "string",
                                "description": "The ID of the user."
                              },
                              "object": {
                                "enum": [
                                  "user"
                                ],
                                "type": "string"
                              }
                            },
                            "description": "Details of the user mention.",
                            "additionalProperties": true
                          }
                        },
                        "additionalProperties": true
                      },
                      {
                        "type": "object",
                        "required": [
                          "date"
                        ],
                        "properties": {
                          "date": {
                            "type": "object",
                            "required": [
                              "start"
                            ],
                            "properties": {
                              "end": {
                                "anyOf": [
                                  {
                                    "type": "string",
                                    "format": "date"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ],
                                "description": "The end date of the date object, if any."
                              },
                              "start": {
                                "type": "string",
                                "format": "date",
                                "description": "The start date of the date object."
                              },
                              "time_zone": {
                                "type": [
                                  "string",
                                  "null"
                                ],
                                "description": "The time zone of the date object, if any. E.g. America/Los_Angeles, Europe/London, etc."
                              }
                            },
                            "description": "Details of the date mention.",
                            "additionalProperties": false
                          },
                          "type": {
                            "enum": [
                              "date"
                            ],
                            "type": "string"
                          }
                        },
                        "additionalProperties": true
                      },
                      {
                        "type": "object",
                        "required": [
                          "page"
                        ],
                        "properties": {
                          "page": {
                            "type": "object",
                            "required": [
                              "id"
                            ],
                            "properties": {
                              "id": {
                                "type": "string",
                                "description": "The ID of the page in the mention."
                              }
                            },
                            "description": "Details of the page mention.",
                            "additionalProperties": true
                          },
                          "type": {
                            "enum": [
                              "page"
                            ],
                            "type": "string"
                          }
                        },
                        "additionalProperties": true
                      },
                      {
                        "type": "object",
                        "required": [
                          "database"
                        ],
                        "properties": {
                          "type": {
                            "enum": [
                              "database"
                            ],
                            "type": "string"
                          },
                          "database": {
                            "type": "object",
                            "required": [
                              "id"
                            ],
                            "properties": {
                              "id": {
                                "type": "string",
                                "description": "The ID of the database in the mention."
                              }
                            },
                            "description": "Details of the database mention.",
                            "additionalProperties": true
                          }
                        },
                        "additionalProperties": true
                      },
                      {
                        "type": "object",
                        "required": [
                          "template_mention"
                        ],
                        "properties": {
                          "type": {
                            "enum": [
                              "template_mention"
                            ],
                            "type": "string"
                          },
                          "template_mention": {
                            "anyOf": [
                              {
                                "type": "object",
                                "required": [
                                  "template_mention_date"
                                ],
                                "properties": {
                                  "type": {
                                    "enum": [
                                      "template_mention_date"
                                    ],
                                    "type": "string"
                                  },
                                  "template_mention_date": {
                                    "enum": [
                                      "today",
                                      "now"
                                    ],
                                    "type": "string"
                                  }
                                },
                                "additionalProperties": false
                              },
                              {
                                "type": "object",
                                "required": [
                                  "template_mention_user"
                                ],
                                "properties": {
                                  "type": {
                                    "enum": [
                                      "template_mention_user"
                                    ],
                                    "type": "string"
                                  },
                                  "template_mention_user": {
                                    "enum": [
                                      "me"
                                    ],
                                    "type": "string"
                                  }
                                },
                                "additionalProperties": false
                              }
                            ],
                            "description": "Details of the template mention."
                          }
                        },
                        "additionalProperties": true
                      },
                      {
                        "type": "object",
                        "required": [
                          "custom_emoji"
                        ],
                        "properties": {
                          "type": {
                            "enum": [
                              "custom_emoji"
                            ],
                            "type": "string"
                          },
                          "custom_emoji": {
                            "type": "object",
                            "required": [
                              "id"
                            ],
                            "properties": {
                              "id": {
                                "type": "string",
                                "description": "The ID of the custom emoji."
                              },
                              "url": {
                                "type": "string",
                                "description": "The URL of the custom emoji."
                              },
                              "name": {
                                "type": "string",
                                "description": "The name of the custom emoji."
                              }
                            },
                            "description": "Details of the custom emoji mention.",
                            "additionalProperties": true
                          }
                        },
                        "additionalProperties": true
                      }
                    ],
                    "description": "Mention objects represent an inline mention of a database, date, link preview mention, page, template mention, or user. A mention is created in the Notion UI when a user types `@` followed by the name of the reference."
                  }
                },
                "additionalProperties": true
              },
              {
                "type": "object",
                "required": [
                  "equation"
                ],
                "properties": {
                  "type": {
                    "enum": [
                      "equation"
                    ],
                    "type": "string"
                  },
                  "equation": {
                    "type": "object",
                    "required": [
                      "expression"
                    ],
                    "properties": {
                      "expression": {
                        "type": "string",
                        "description": "A KaTeX compatible string."
                      }
                    },
                    "description": "Notion supports inline LaTeX equations as rich text objects with a type value of `equation`.",
                    "additionalProperties": true
                  }
                },
                "additionalProperties": true
              }
            ]
          }
        ]
      },
      "maxItems": 100,
      "description": "An array of rich text objects that represent the content of the comment."
    },
    "discussion_id": {
      "type": "string",
      "description": "The ID or URL of an existing discussion to reply to (e.g., discussion://pageId/blockId/discussionId)."
    },
    "selection_with_ellipsis": {
      "type": "string",
      "description": "Unique start and end snippet of the content to comment on. DO NOT provide the entire string. Instead, provide up to the first ~10 characters, an ellipsis, and then up to the last ~10 characters. Make sure you provide enough of the start and end snippet to uniquely identify the content. For example: \"# Section heading...last paragraph.\""
    }
  },
  "additionalProperties": false
}
```

### notion-get-comments

**Description:** Get comments and discussions from a Notion page.
Returns discussions with full comment content in XML format. By default, returns page-level discussions only.
Tip: Use the `fetch` tool with `include_discussions: true` first to see where discussions are anchored in the page content, then use this tool to retrieve full discussion threads. The `discussion://` URLs in the fetch output match the discussion IDs returned here.
Parameters:
- `include_all_blocks`: Include discussions on child blocks (default: false)
- `include_resolved`: Include resolved discussions (default: false)
- `discussion_id`: Fetch a specific discussion by ID or URL

<example>{"page_id": "page-uuid"}</example>
<example>{"page_id": "page-uuid", "include_all_blocks": true}</example>
<example>{"page_id": "page-uuid", "discussion_id": "discussion://pageId/blockId/discussionId"}</example>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "page_id"
  ],
  "properties": {
    "page_id": {
      "type": "string",
      "description": "Identifier for a Notion page."
    },
    "discussion_id": {
      "type": "string",
      "description": "Fetch a specific discussion by ID or discussion URL (e.g., discussion://pageId/blockId/discussionId)."
    },
    "include_resolved": {
      "type": "boolean"
    },
    "include_all_blocks": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### notion-get-teams

**Description:** Retrieves a list of teams (teamspaces) in the current workspace. Shows which teams exist, user membership status, IDs, names, and roles.
Teams are returned split by membership status and limited to a maximum of 10 results.
<examples>
1. List all teams (up to the limit of each type): {}
2. Search for teams by name: {"query": "engineering"}
3. Find a specific team: {"query": "Product Design"}
</examples>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "query": {
      "type": "string",
      "maxLength": 100,
      "minLength": 1,
      "description": "Optional search query to filter teams by name (case-insensitive)."
    }
  },
  "additionalProperties": false
}
```

### notion-get-users

**Description:** Retrieves a list of users in the current workspace. Shows workspace members and guests with their IDs, names, emails (if available), and types (person or bot).
Supports cursor-based pagination to iterate through all users in the workspace.
<examples>
1. List all users (first page): {}
2. Search for users by name or email: {"query": "john"}
3. Get next page of results: {"start_cursor": "abc123"}
4. Set custom page size: {"page_size": 20}
5. Fetch a specific user by ID: {"user_id": "00000000-0000-4000-8000-000000000000"}
6. Fetch the current user: {"user_id": "self"}
</examples>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "query": {
      "type": "string",
      "maxLength": 100,
      "minLength": 1,
      "description": "Optional search query to filter users by name or email (case-insensitive)."
    },
    "user_id": {
      "type": "string",
      "maxLength": 100,
      "minLength": 1,
      "description": "Return only the user matching this ID. Pass \"self\" to fetch the current user."
    },
    "page_size": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "Number of users to return per page (default: 100, max: 100)."
    },
    "start_cursor": {
      "type": "string",
      "maxLength": 100,
      "minLength": 1,
      "description": "Cursor for pagination. Use the next_cursor value from the previous response to get the next page."
    }
  },
  "additionalProperties": false
}
```

