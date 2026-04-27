# Tool Server: cloudstorage

**ID:** 28b0a8fc-cf4d-43a6-9f1b-8b30c0eb7f32

**Short Description:** Efficient store for files in use by your agents or Sidekick.

## Description

Allow your agents & Sidekick to save/retrieve files on our cloud storage

## Tools (4)

### uploadFile

**Description:** Upload a file to cloud storage. Returns a stable, world-readable URL that never expires. Files are stored in the calling agent's directory. Sidekick can upload to the _sidekick directory. You can provide either direct content OR a sourceUrl to fetch from.

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
  },
  "additionalProperties": false
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
      "type": "string"
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

**Description:** List files in cloud storage. By default, lists only files uploaded by this agent. Sidekick can list all files or files from a specific agent directory. Returns up to 20 files with stable URLs that never expire. Use 'search' to filter files by name.

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
  },
  "additionalProperties": false
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
          "fileName",
          "mimeType",
          "size",
          "url"
        ],
        "properties": {
          "url": {
            "type": "string"
          },
          "size": {
            "type": "number"
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

**Description:** Get a file from cloud storage by name. Returns a stable URL that never expires and file metadata. Agents can only access files in their own directory unless they are Sidekick.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "fileName"
  ],
  "properties": {
    "fileName": {
      "type": "string",
      "description": "The file name to retrieve. For files in your own directory, just provide the file name. For files in other agent directories (Sidekick only), use format: agentDirectory/fileName"
    }
  },
  "additionalProperties": false
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
      "type": "string"
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

### deleteFile

**Description:** Delete a file from cloud storage. Agents can only delete files in their own directory. Sidekick can delete files from any directory.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "fileName"
  ],
  "properties": {
    "fileName": {
      "type": "string",
      "description": "The file name to delete. For files in your own directory, just provide the file name. For files in other agent directories (Sidekick only), use format: agentDirectory/fileName"
    }
  },
  "additionalProperties": false
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

