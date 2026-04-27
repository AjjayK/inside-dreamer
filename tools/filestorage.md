# Tool Server: filestorage

**ID:** 20bd85f9-e4f2-417f-b634-e4c61e463e5d

**Short Description:** Efficient store for files in use by your agents or Sidekick.

## Description

Allow your agents & Sidekick to save/retrieve files on our cloud storage

## Tools (4)

### uploadFile

**Description:** Upload a file to cloud storage. Files are public (world-readable) by default. Set private=true for files that require user authentication to access. Files are stored in the calling agent's directory. Sidekick can upload to the _sidekick directory.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "fileName"
  ],
  "properties": {
    "content": {
      "type": "string",
      "description": "The file content. For binary files, provide base64-encoded content and set isBase64 to true. For text files, provide plain text. Either content or sourceUrl must be provided."
    },
    "private": {
      "type": "boolean",
      "description": "If true, the file requires user authentication to access. Default: false (public, world-readable)."
    },
    "fileName": {
      "type": "string",
      "description": "The file name with extension (e.g., 'report.pdf', 'data.csv', 'image.png'). Will be sanitized to remove unsafe characters."
    },
    "isBase64": {
      "type": "boolean",
      "description": "Set to true if content is base64-encoded (required for binary files like images, PDFs). Default: false. Ignored if sourceUrl is provided."
    },
    "mimeType": {
      "type": "string",
      "description": "The MIME type of the file (e.g., 'text/csv', 'application/pdf', 'image/png'). If not provided, will be inferred from file extension or sourceUrl response."
    },
    "sourceUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL to fetch the file content from. The file will be downloaded and stored. Use this for images or files from other tools/services. Either content or sourceUrl must be provided."
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "description": "Public files: permanent URL. Private files: time-limited URL (10min) - call getFile for fresh URL."
    },
    "error": {
      "type": "object",
      "required": [
        "type",
        "message"
      ],
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "fileKey": {
      "type": "string",
      "description": "Unique identifier for this file. Use with getFile/deleteFile for exact matching."
    },
    "success": {
      "type": "boolean"
    },
    "fileName": {
      "type": "string"
    },
    "mimeType": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### listFiles

**Description:** List files in cloud storage. By default, lists only files uploaded by this agent. Sidekick can list all files or files from a specific agent directory. Returns up to 20 files. Use 'search' to filter files by name. URLs are automatically generated based on file visibility (public or private).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "search": {
      "type": "string",
      "description": "Optional: Filter files by path (includes directory and filename). Files whose path contains this string (case-insensitive) will be returned. Useful for searching when there are many files."
    },
    "agentDirectory": {
      "type": "string",
      "description": "Optional: List files from a specific agent's directory (by vanityId or name). Only Sidekick can list other agents' files. Omit to list your own files."
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
    "success"
  ],
  "properties": {
    "error": {
      "type": "object",
      "required": [
        "type",
        "message"
      ],
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "fileKey",
          "fileName",
          "mimeType",
          "size",
          "url",
          "isPrivate"
        ],
        "properties": {
          "url": {
            "type": "string",
            "description": "Public files: permanent URL. Private files: time-limited URL (10min) - call getFile for fresh URL."
          },
          "size": {
            "type": "number"
          },
          "fileKey": {
            "type": "string",
            "description": "Unique identifier for this file. Use with getFile/deleteFile."
          },
          "fileName": {
            "type": "string"
          },
          "mimeType": {
            "type": "string"
          },
          "isPrivate": {
            "type": "boolean",
            "description": "True if this is a private file requiring authentication"
          }
        },
        "additionalProperties": false
      }
    },
    "hasMore": {
      "type": "boolean",
      "description": "True if there are more files beyond the returned limit"
    },
    "success": {
      "type": "boolean"
    },
    "totalCount": {
      "type": "number",
      "description": "Total number of files (before limiting)"
    }
  },
  "additionalProperties": false
}
```

### getFile

**Description:** Get a file from cloud storage. For private files, this returns a fresh time-limited URL (10min). Use fileKey (preferred) for exact match or fileName for backwards compatibility. Returns a fresh access URL - essential for private files whose URLs expire.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "fileKey": {
      "type": "string",
      "description": "The unique file key (from uploadFile/listFiles). Preferred method for exact match."
    },
    "fileName": {
      "type": "string",
      "description": "The file name to retrieve (backwards compatible). For files in your own directory, just provide the file name. For files in other agent directories (Sidekick only), use format: agentDirectory/fileName. If both public and private versions exist with the same name, returns the public one."
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "description": "Access URL for the file. For private files, this is a fresh time-limited URL (10min)."
    },
    "error": {
      "type": "object",
      "required": [
        "type",
        "message"
      ],
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "fileKey": {
      "type": "string",
      "description": "Unique identifier for this file."
    },
    "success": {
      "type": "boolean"
    },
    "fileName": {
      "type": "string"
    },
    "mimeType": {
      "type": "string"
    },
    "isPrivate": {
      "type": "boolean",
      "description": "True if this is a private file."
    }
  },
  "additionalProperties": false
}
```

### deleteFile

**Description:** Delete a file from cloud storage. Use fileKey (preferred) or fileName. Agents can only delete files in their own directory. Sidekick can delete files from any directory.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "fileKey": {
      "type": "string",
      "description": "The unique file key (from uploadFile/listFiles)."
    },
    "fileName": {
      "type": "string",
      "description": "The file name to delete. For files in your own directory, just provide the file name. For files in other agent directories (Sidekick only), use format: agentDirectory/fileName"
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
    "success"
  ],
  "properties": {
    "error": {
      "type": "object",
      "required": [
        "type",
        "message"
      ],
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

