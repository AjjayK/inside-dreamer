# Tool Server: gdrive

**ID:** 2aa79b69-3618-4c98-832f-9346379e2aba

**Short Description:** Manage documents in your Google Drive

## Description

Manage documents in your Google Drive

## Tools (13)

### listAccounts

**Description:** Get Google Drive accounts available on this tool for this user.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {}
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "accounts"
  ],
  "properties": {
    "accounts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "email",
          "type"
        ],
        "properties": {
          "type": {
            "enum": [
              "gdrive"
            ],
            "type": "string"
          },
          "email": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### searchGoogleDriveFiles

**Description:** Search for files in Google Drive by name and content.

    This tool searches for files in your Google Drive that contain the specified text in either:
    - File name (e.g., "budget report.pdf")
    - File content (e.g., text within a Google Doc)

    Simply enter keywords or phrases to search for. The search is case-insensitive and will find partial matches.

    Examples:
    - "budget" - finds files with "budget" in name or content
    - "quarterly review" - finds files containing "quarterly review"
    - "tax documents" - finds files related to taxes

    Pagination: This API returns paginated results. The response includes:
    - 'files': Array of file metadata
    - 'nextPageToken': String token for the next page (undefined if no more pages)

    To get the next page of results, call this function again with the 'pageToken' parameter set to the 'nextPageToken' value from the previous response.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "Keywords or phrases to search for in file names and content"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for pagination to get the next page of results"
    },
    "maxResults": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "description": "Maximum number of results to return (default: 10)"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "query",
    "results",
    "fetchedAt"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "The search query that was executed"
    },
    "results": {
      "type": "object",
      "required": [
        "files",
        "nextPageToken",
        "total"
      ],
      "properties": {
        "files": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "name",
              "type",
              "webLink",
              "lastModified",
              "owner"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique file ID"
              },
              "name": {
                "type": "string",
                "description": "File name"
              },
              "type": {
                "type": "string",
                "description": "File type (e.g., 'document', 'spreadsheet', 'pdf')"
              },
              "owner": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Owner's display name, or null if unavailable"
              },
              "webLink": {
                "type": "string",
                "description": "Web link to view the file"
              },
              "lastModified": {
                "type": "string",
                "description": "Last modified timestamp (ISO 8601)"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of matching files"
        },
        "total": {
          "type": "number",
          "description": "Number of files returned in this response"
        },
        "nextPageToken": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Token for next page of results, or null if no more pages"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when results were fetched (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### getRecentlyModifiedFiles

**Description:** Get a list of recently modified files in Google Drive.

    This tool retrieves files ordered by modification time, with the most recently modified files first.

    Pagination: This API returns paginated results. The response includes:
    - 'files': Array of file metadata
    - 'nextPageToken': String token for the next page (undefined if no more pages)

    To get the next page of results, call this function again with the 'pageToken' parameter set to the 'nextPageToken' value from the previous response.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for pagination to get the next page of results"
    },
    "maxResults": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "description": "Maximum number of results to return (default: 10)"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "results",
    "fetchedAt"
  ],
  "properties": {
    "results": {
      "type": "object",
      "required": [
        "files",
        "nextPageToken"
      ],
      "properties": {
        "files": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "name",
              "type",
              "webLink",
              "lastModified",
              "owner"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique file ID"
              },
              "name": {
                "type": "string",
                "description": "File name"
              },
              "type": {
                "type": "string",
                "description": "File type (e.g., 'document', 'spreadsheet', 'pdf')"
              },
              "owner": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Owner's display name, or null if unavailable"
              },
              "webLink": {
                "type": "string",
                "description": "Web link to view the file"
              },
              "lastModified": {
                "type": "string",
                "description": "Last modified timestamp (ISO 8601)"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of recently modified files"
        },
        "nextPageToken": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Token for next page of results, or null if no more pages"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when results were fetched (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### getRecentlySharedFiles

**Description:** Get a list of files recently shared with you.

    This tool retrieves files that have been shared with you, ordered by when they were shared (most recent first).

    Pagination: This API returns paginated results. The response includes:
    - 'files': Array of file metadata
    - 'nextPageToken': String token for the next page (undefined if no more pages)

    To get the next page of results, call this function again with the 'pageToken' parameter set to the 'nextPageToken' value from the previous response.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for pagination to get the next page of results"
    },
    "maxResults": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "description": "Maximum number of results to return (default: 10)"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "results",
    "fetchedAt"
  ],
  "properties": {
    "results": {
      "type": "object",
      "required": [
        "files",
        "nextPageToken"
      ],
      "properties": {
        "files": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "name",
              "type",
              "webLink",
              "lastModified",
              "owner"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique file ID"
              },
              "name": {
                "type": "string",
                "description": "File name"
              },
              "type": {
                "type": "string",
                "description": "File type (e.g., 'document', 'spreadsheet', 'pdf')"
              },
              "owner": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Owner's display name, or null if unavailable"
              },
              "webLink": {
                "type": "string",
                "description": "Web link to view the file"
              },
              "lastModified": {
                "type": "string",
                "description": "Last modified timestamp (ISO 8601)"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of recently shared files"
        },
        "nextPageToken": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Token for next page of results, or null if no more pages"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when results were fetched (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### searchGoogleDriveFolders

**Description:** Search for folders in Google Drive by folder name.

    This tool searches for folders in your Google Drive. It automatically filters for folders only.
    
    Usage:
    - Provide a search term to find folders with that text in their name (e.g., "Sales Reports")
    - Omit the query to list all folders (sorted by most recently modified)
    - The search is case-insensitive and finds partial matches in folder names
    
    Note: Do NOT include "type:folder" in your query - folders are already filtered automatically.

    Pagination: This API returns paginated results. The response includes:
    - 'folders': Array of folder metadata
    - 'nextPageToken': String token for the next page (undefined if no more pages)

    To get the next page of results, call this function again with the 'pageToken' parameter set to the 'nextPageToken' value from the previous response.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account"
  ],
  "properties": {
    "query": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Search term to find folders by name (omit to list all folders)"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for pagination to get the next page of results"
    },
    "maxResults": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "description": "Maximum number of results to return (default: 10)"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "results",
    "fetchedAt"
  ],
  "properties": {
    "query": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "The search query that was executed, or null if listing all folders"
    },
    "results": {
      "type": "object",
      "required": [
        "folders",
        "nextPageToken",
        "total"
      ],
      "properties": {
        "total": {
          "type": "number",
          "description": "Number of folders returned in this response"
        },
        "folders": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "name",
              "webLink",
              "lastModified",
              "owner"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique folder ID"
              },
              "name": {
                "type": "string",
                "description": "Folder name"
              },
              "owner": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Owner's display name, or null if unavailable"
              },
              "webLink": {
                "type": "string",
                "description": "Web link to view the folder"
              },
              "lastModified": {
                "type": "string",
                "description": "Last modified timestamp (ISO 8601)"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of matching folders"
        },
        "nextPageToken": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Token for next page of results, or null if no more pages"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when results were fetched (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### listFilesInFolder

**Description:** List all files within a specific Google Drive folder.

    This tool retrieves all files contained within a given folder by folder ID.
    The files are ordered alphabetically by name for consistent results.

    To get a folder ID, use the searchGoogleDriveFolders tool first to find the folder.

    Pagination: This API returns paginated results. The response includes:
    - 'files': Array of file metadata including name, type, size, and modification time
    - 'nextPageToken': String token for the next page (undefined if no more pages)
    - 'folderInfo': Metadata about the folder being listed

    To get the next page of results, call this function again with the 'pageToken' parameter set to the 'nextPageToken' value from the previous response.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "folderId"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "folderId": {
      "type": "string",
      "description": "Google Drive folder ID to list files from"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for pagination to get the next page of results"
    },
    "maxResults": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ],
      "description": "Maximum number of results to return (default: 10)"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "results",
    "fetchedAt"
  ],
  "properties": {
    "results": {
      "type": "object",
      "required": [
        "files",
        "nextPageToken",
        "folderInfo"
      ],
      "properties": {
        "files": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "name",
              "type",
              "webLink",
              "lastModified",
              "owner",
              "size"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique file ID"
              },
              "name": {
                "type": "string",
                "description": "File name"
              },
              "size": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "File size in bytes, or null if unavailable"
              },
              "type": {
                "type": "string",
                "description": "File type (e.g., 'document', 'spreadsheet', 'pdf')"
              },
              "owner": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Owner's display name, or null if unavailable"
              },
              "webLink": {
                "type": "string",
                "description": "Web link to view the file"
              },
              "lastModified": {
                "type": "string",
                "description": "Last modified timestamp (ISO 8601)"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of files in the folder"
        },
        "folderInfo": {
          "anyOf": [
            {
              "type": "object",
              "required": [
                "id",
                "name",
                "webLink"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Folder ID"
                },
                "name": {
                  "type": "string",
                  "description": "Folder name"
                },
                "webLink": {
                  "type": "string",
                  "description": "Web link to view the folder"
                }
              },
              "additionalProperties": false
            },
            {
              "type": "null"
            }
          ],
          "description": "Information about the folder being listed, or null if unavailable"
        },
        "nextPageToken": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Token for next page of results, or null if no more pages"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when results were fetched (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### getDocumentContentAsMarkdown

**Description:** Get the content of a Google Drive file as text.

    This tool exports the content of Google Docs, Sheets, and Slides as plain text.
    The content can be used for processing or display.

    For Google Docs, the content will be formatted as readable text.
    For other file types, basic information will be provided.

    To find a file ID, use the searchGoogleDriveFiles tool first.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "fileId"
  ],
  "properties": {
    "fileId": {
      "type": "string",
      "description": "Google Drive file ID to retrieve content from"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "file",
    "fetchedAt"
  ],
  "properties": {
    "file": {
      "type": "object",
      "required": [
        "id",
        "name",
        "mimeType",
        "content"
      ],
      "properties": {
        "id": {
          "type": "string",
          "description": "File ID"
        },
        "name": {
          "type": "string",
          "description": "File name"
        },
        "content": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "File content as text/markdown, or null if unavailable"
        },
        "mimeType": {
          "type": "string",
          "description": "MIME type of the file"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when content was fetched (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### createDocument

**Description:** Create a new Google Doc with content.

    This tool creates a new Google Doc with the specified title and content.
    You can provide content in two ways:
    1. Inline content using the 'content' parameter
    2. Reference a Google Drive file containing content using the 'contentFile' parameter (file ID)

    You must provide exactly one of 'content' or 'contentFile'.
    
    Content Formatting:
    - Use 'contentFormat: "plain"' (default) for plain text content
    - Use 'contentFormat: "markdown"' to format content with markdown syntax:
      * Headers: # H1, ## H2, ### H3, etc.
      * Bold: **bold text**
      * Italic: *italic text*
      * Bold+Italic: ***bold and italic***

    You can optionally specify a folder ID to create the document in a specific folder.
    If no folder ID is provided, the document will be created in the root of My Drive.

    Returns the document ID and a web link to view the document.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "title"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Title for the new document"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "content": {
      "type": "string",
      "description": "Inline content to populate the document with"
    },
    "folderId": {
      "type": "string",
      "description": "Optional Google Drive folder ID to create the document in"
    },
    "contentFile": {
      "type": "string",
      "description": "Google Drive file ID containing content"
    },
    "contentFormat": {
      "enum": [
        "plain",
        "markdown"
      ],
      "type": "string",
      "description": "Format of the content: 'plain' for plain text (default) or 'markdown' for markdown formatting"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "document",
    "createdAt"
  ],
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "document": {
      "type": "object",
      "required": [
        "id",
        "name",
        "webViewLink"
      ],
      "properties": {
        "id": {
          "type": "string",
          "description": "Document ID"
        },
        "name": {
          "type": "string",
          "description": "Document name"
        },
        "webViewLink": {
          "type": "string",
          "description": "Web link to view the document"
        }
      },
      "additionalProperties": false
    },
    "createdAt": {
      "type": "string",
      "description": "Timestamp when document was created (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### appendToDocument

**Description:** Append content to an existing Google Doc.

    This tool appends text/markdown content to the end of an existing Google Doc.
    The content will be added with proper formatting.

    Note: This tool only works with Google Docs (not Sheets, Slides, etc).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "fileId",
    "content"
  ],
  "properties": {
    "fileId": {
      "type": "string",
      "description": "Google Drive document ID to append content to"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "content": {
      "type": "string",
      "description": "Plain text content to append to the document"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "document",
    "updatedAt"
  ],
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "document": {
      "type": "object",
      "required": [
        "id",
        "name",
        "webViewLink"
      ],
      "properties": {
        "id": {
          "type": "string",
          "description": "Document ID"
        },
        "name": {
          "type": "string",
          "description": "Document name"
        },
        "webViewLink": {
          "type": "string",
          "description": "Web link to view the document"
        }
      },
      "additionalProperties": false
    },
    "updatedAt": {
      "type": "string",
      "description": "Timestamp when document was updated (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### shareDocument

**Description:** Share a Google Drive document with other people.

    This tool allows you to share a Google Drive file with one or more users by email address.
    You can specify the access level (reader, commenter, or writer) for all recipients.

    - reader: Can view but not edit the document
    - commenter: Can add comments but not edit the document content
    - writer: Can edit the document content

    By default, notification emails will be sent to the recipients.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "fileId",
    "emailAddresses"
  ],
  "properties": {
    "role": {
      "enum": [
        "reader",
        "writer",
        "commenter"
      ],
      "type": "string",
      "default": "reader",
      "description": "Access role to grant (reader, writer, or commenter)"
    },
    "fileId": {
      "type": "string",
      "description": "Google Drive file ID to share"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "notifyUsers": {
      "type": "boolean",
      "default": true,
      "description": "Whether to send email notifications to users"
    },
    "emailAddresses": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "email",
        "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
      },
      "description": "Array of email addresses to share the file with"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "result"
  ],
  "properties": {
    "result": {
      "type": "object",
      "required": [
        "fileId",
        "shared"
      ],
      "properties": {
        "fileId": {
          "type": "string",
          "description": "ID of the file that was shared"
        },
        "shared": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "email",
              "role",
              "id"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "Permission ID"
              },
              "role": {
                "type": "string",
                "description": "Access role granted (reader, writer, commenter)"
              },
              "email": {
                "type": "string",
                "description": "Email address of the person the file was shared with"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of sharing permissions created"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    }
  },
  "additionalProperties": false
}
```

### uploadFile

**Description:** Upload a file to Google Drive.

    This tool uploads a file to Google Drive with the specified name and content.
    The file content must be base64-encoded.

    You can optionally specify a folder ID to upload the file into a specific folder.
    If no folder ID is provided, the file will be uploaded to the root of My Drive.

    Common MIME types:
    - CSV: 'text/csv'
    - PDF: 'application/pdf'
    - Text: 'text/plain'
    - JSON: 'application/json'
    - PNG: 'image/png'
    - JPEG: 'image/jpeg'

    Returns the file ID and a web link to view the file in Google Drive.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "fileName",
    "mimeType",
    "fileContent"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "fileName": {
      "type": "string",
      "description": "Name of the file to create in Google Drive"
    },
    "folderId": {
      "type": "string",
      "description": "Optional Google Drive folder ID to upload into"
    },
    "mimeType": {
      "type": "string",
      "description": "MIME type of the file (e.g., 'text/csv', 'application/pdf')"
    },
    "fileContent": {
      "type": "string",
      "description": "Base64-encoded file content"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "file",
    "createdAt"
  ],
  "properties": {
    "file": {
      "type": "object",
      "required": [
        "fileId",
        "fileName",
        "mimeType",
        "webViewLink"
      ],
      "properties": {
        "fileId": {
          "type": "string",
          "description": "Unique file ID in Google Drive"
        },
        "fileName": {
          "type": "string",
          "description": "Name of the uploaded file"
        },
        "mimeType": {
          "type": "string",
          "description": "MIME type of the file"
        },
        "webViewLink": {
          "type": "string",
          "description": "Web link to view the file in Google Drive"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "createdAt": {
      "type": "string",
      "description": "Timestamp when file was uploaded (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

### getDocumentComments

**Description:** Get comments from a Google Doc.

    This tool retrieves comments (and their replies) from a Google Doc. By default only unresolved comments are returned.

    Each comment includes:
    - The comment text and the document text that was highlighted
    - Author name and email
    - Creation and modification timestamps
    - Whether it has been resolved
    - Any replies, including resolve/reopen actions

    Pagination: Results are returned in pages of up to 100 comments. The response includes:
    - 'comments': Array of comment objects
    - 'nextPageToken': Token for the next page, or null if no more pages

    To get the next page, call this tool again with the 'pageToken' parameter set to the 'nextPageToken' value from the previous response.

    To find a file ID, use the searchGoogleDriveFiles tool first.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "fileId"
  ],
  "properties": {
    "fileId": {
      "type": "string",
      "description": "Google Drive file ID to retrieve comments from"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for pagination to get the next page of results"
    },
    "includeResolved": {
      "type": "boolean",
      "description": "Whether to include resolved comments (default: false)"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "fileId",
    "comments",
    "total",
    "nextPageToken",
    "fetchedAt"
  ],
  "properties": {
    "total": {
      "type": "number",
      "description": "Number of comments returned in this response"
    },
    "fileId": {
      "type": "string",
      "description": "The file ID that was queried"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "comments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "content",
          "author",
          "createdTime",
          "modifiedTime",
          "resolved",
          "quotedFileContent",
          "replies"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "Comment ID"
          },
          "author": {
            "type": "object",
            "required": [
              "displayName",
              "emailAddress",
              "me"
            ],
            "properties": {
              "me": {
                "type": "boolean",
                "description": "Whether the author is the current user"
              },
              "displayName": {
                "type": "string",
                "description": "Author's display name"
              },
              "emailAddress": {
                "type": "string",
                "description": "Author's email address"
              }
            },
            "additionalProperties": false
          },
          "content": {
            "type": "string",
            "description": "Comment text"
          },
          "replies": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "id",
                "content",
                "author",
                "createdTime",
                "modifiedTime",
                "action"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Reply ID"
                },
                "action": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "description": "Reply action (e.g. 'resolve', 'reopen'), or null"
                },
                "author": {
                  "type": "object",
                  "required": [
                    "displayName",
                    "emailAddress",
                    "me"
                  ],
                  "properties": {
                    "me": {
                      "type": "boolean",
                      "description": "Whether the author is the current user"
                    },
                    "displayName": {
                      "type": "string",
                      "description": "Author's display name"
                    },
                    "emailAddress": {
                      "type": "string",
                      "description": "Author's email address"
                    }
                  },
                  "additionalProperties": false
                },
                "content": {
                  "type": "string",
                  "description": "Reply text"
                },
                "createdTime": {
                  "type": "string",
                  "description": "When the reply was created (ISO 8601)"
                },
                "modifiedTime": {
                  "type": "string",
                  "description": "When the reply was last modified (ISO 8601)"
                }
              },
              "additionalProperties": false
            },
            "description": "Replies to this comment"
          },
          "resolved": {
            "type": "boolean",
            "description": "Whether the comment has been resolved"
          },
          "createdTime": {
            "type": "string",
            "description": "When the comment was created (ISO 8601)"
          },
          "modifiedTime": {
            "type": "string",
            "description": "When the comment was last modified (ISO 8601)"
          },
          "quotedFileContent": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "The document text that was highlighted/quoted for this comment, or null"
          }
        },
        "additionalProperties": false
      },
      "description": "Array of comments on the document"
    },
    "fetchedAt": {
      "type": "string",
      "description": "Timestamp when comments were fetched (ISO 8601)"
    },
    "nextPageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Token for next page of results, or null if no more pages"
    }
  },
  "additionalProperties": false
}
```

### createSheet

**Description:** ⚠️ DEPRECATED: Use sheets_createSheet from the Google Sheets tool instead.
This tool is deprecated and will be removed in a future version. 
Please use the sheets_createSheet tool from the Google Sheets tool for all spreadsheet creation operations.
Available for backward compatibility, but recommend shifting all usage to the new tool instead.

Legacy description:
Create a new Google Sheet from CSV data. Provide CSV data inline (csvData) or reference a Drive file ID (csvDataFile). Optionally specify a folderId for placement.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "title"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Title for the new spreadsheet"
    },
    "account": {
      "type": "string",
      "description": "Google Drive account email"
    },
    "csvData": {
      "type": "string",
      "description": "CSV data to populate the sheet with (inline)"
    },
    "folderId": {
      "type": "string",
      "description": "Optional Google Drive folder ID to create the spreadsheet in"
    },
    "csvDataFile": {
      "type": "string",
      "description": "Google Drive file ID containing CSV data"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "sheet",
    "createdAt"
  ],
  "properties": {
    "sheet": {
      "type": "object",
      "required": [
        "spreadsheetId",
        "spreadsheetUrl",
        "title"
      ],
      "properties": {
        "title": {
          "type": "string",
          "description": "Spreadsheet title"
        },
        "spreadsheetId": {
          "type": "string",
          "description": "Unique spreadsheet ID"
        },
        "spreadsheetUrl": {
          "type": "string",
          "description": "Web link to view the spreadsheet"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "createdAt": {
      "type": "string",
      "description": "Timestamp when spreadsheet was created (ISO 8601)"
    }
  },
  "additionalProperties": false
}
```

