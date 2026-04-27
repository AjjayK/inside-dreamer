# Tool Server: filetools

**ID:** 047bb391-250a-4535-aff7-abee6ae8d296

**Short Description:** Manage your files on our cloud storage

## Description

Efficient store for large files in use by your agents or Sidekick

## Tools (2)

### uploadFile

**Description:** Upload a file to cloud storage. You can provide either file content directly or a path to a file on disk. Returns a fileKey for later retrieval. Use the downloadFile tool with the fileKey. Files are organized by user and stored securely.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "fileName",
    "contentType"
  ],
  "properties": {
    "content": {
      "type": "string",
      "description": "The file content as a string. For binary files, use base64 encoding. For text files, use plain text. Provide either content or filePath, not both."
    },
    "fileName": {
      "type": "string",
      "description": "The file name with extension (e.g., 'document.pdf', 'data.csv', 'image.png')"
    },
    "filePath": {
      "type": "string",
      "description": "Path to a file on disk to upload. Useful for uploading files created by other tools (e.g., images, PDFs). Provide either content or filePath, not both."
    },
    "isBase64": {
      "type": "boolean",
      "description": "Set to true if the content parameter is base64 encoded (for binary files). Only applies when using content parameter. Default: false"
    },
    "contentType": {
      "type": "string",
      "description": "The MIME type of the file (e.g., 'text/csv', 'application/pdf', 'image/png', 'text/plain')"
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
    "fileKey": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### downloadFile

**Description:** Download a file from S3 storage and return its content. Use the fileKey returned from uploadFile. The file content is returned as a string (base64 for binary files, plain text for text files).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "fileKey"
  ],
  "properties": {
    "fileKey": {
      "type": "string",
      "description": "The S3 file key returned from uploadFile (e.g., 'userId/uuid/filename.pdf')"
    },
    "returnBase64": {
      "type": "boolean",
      "description": "Return content as base64 (useful for binary files). Default: auto-detect based on content type"
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
    "content": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "fileName": {
      "type": "string"
    },
    "contentType": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

