# Tool Server: mail

**ID:** 961d124c-6091-4d08-b01e-8b1492a60159

**Short Description:** Access and send Gmail messages

## Description

Access and send email messages with any connected Gmail accounts.

## Tools (12)

### listAccounts

**Description:** Get email accounts available on this tool for this user.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {},
  "additionalProperties": false
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
              "gmail"
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

### getLabels

**Description:** Get all email labels available for the authenticated user

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
      "type": "string"
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
    "labels"
  ],
  "properties": {
    "labels": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "type"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "type": {
            "enum": [
              "gmail_label"
            ],
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

### getLabelDetails

**Description:** Get detailed information about a specific label, including message and thread counts

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "labelId"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "labelId": {
      "type": "string"
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
    "label"
  ],
  "properties": {
    "label": {
      "type": "object",
      "required": [
        "id",
        "name",
        "type"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "type": {
          "enum": [
            "gmail_label"
          ],
          "type": "string"
        },
        "labelType": {
          "type": "string"
        },
        "threadsTotal": {
          "type": "number"
        },
        "messagesTotal": {
          "type": "number"
        },
        "threadsUnread": {
          "type": "number"
        },
        "messagesUnread": {
          "type": "number"
        },
        "labelListVisibility": {
          "type": "string"
        },
        "messageListVisibility": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### getMessages

**Description:** Get email messages with filtering options

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "labelIds",
    "maxResults",
    "pageToken"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "labelIds": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "pageToken": {
      "type": [
        "string",
        "null"
      ]
    },
    "maxResults": {
      "type": [
        "number",
        "null"
      ]
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
    "messages",
    "nextPageToken"
  ],
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "from",
          "to",
          "subject",
          "date",
          "hasAttachments",
          "isUnread",
          "snippet",
          "threadId",
          "id"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "to": {
            "type": [
              "string",
              "null"
            ]
          },
          "date": {
            "type": [
              "string",
              "null"
            ]
          },
          "from": {
            "type": [
              "string",
              "null"
            ]
          },
          "snippet": {
            "type": [
              "string",
              "null"
            ]
          },
          "subject": {
            "type": [
              "string",
              "null"
            ]
          },
          "isUnread": {
            "type": "boolean"
          },
          "labelIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "threadId": {
            "type": "string"
          },
          "hasAttachments": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      }
    },
    "nextPageToken": {
      "type": [
        "string",
        "null"
      ]
    }
  },
  "additionalProperties": false
}
```

### searchMessages

**Description:** Search email messages using Gmail search query syntax. For date-based searches, use after:YYYY-MM-DD and before:YYYY-MM-DD operators with dates in the user's local timezone (the tool automatically handles timezone conversion). Example: to find emails from a sender on a specific date, use 'from:sender@example.com after:2025-11-17 before:2025-11-19' for emails on Nov 18.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "query",
    "maxResults",
    "pageToken"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "Gmail search query string. Supports Gmail search operators:\n- from:sender@example.com - emails from a specific sender\n- to:recipient@example.com - emails to a specific recipient\n- subject:keyword - emails with keyword in subject\n- has:attachment - emails with attachments\n- is:unread / is:read - filter by read status\n- label:labelname - emails with a specific label\n- after:YYYY-MM-DD - emails after a date (use user's local date, timezone is handled automatically)\n- before:YYYY-MM-DD - emails before a date (use user's local date, timezone is handled automatically)\n\nDate filtering examples (dates should be in user's local timezone):\n- \"from:boss@company.com after:2025-01-15 before:2025-01-17\" - emails from boss on Jan 15-16\n- \"subject:invoice after:2025-01-01\" - invoices since Jan 1\n\nMultiple operators can be combined with spaces (implicit AND)."
    },
    "account": {
      "type": "string"
    },
    "pageToken": {
      "type": [
        "string",
        "null"
      ]
    },
    "maxResults": {
      "type": [
        "number",
        "null"
      ]
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
    "messages",
    "nextPageToken"
  ],
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "from",
          "to",
          "subject",
          "date",
          "hasAttachments",
          "isUnread",
          "snippet",
          "threadId",
          "id"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "to": {
            "type": [
              "string",
              "null"
            ]
          },
          "date": {
            "type": [
              "string",
              "null"
            ]
          },
          "from": {
            "type": [
              "string",
              "null"
            ]
          },
          "snippet": {
            "type": [
              "string",
              "null"
            ]
          },
          "subject": {
            "type": [
              "string",
              "null"
            ]
          },
          "isUnread": {
            "type": "boolean"
          },
          "labelIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "threadId": {
            "type": "string"
          },
          "hasAttachments": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      }
    },
    "nextPageToken": {
      "type": [
        "string",
        "null"
      ]
    }
  },
  "additionalProperties": false
}
```

### getMessage

**Description:** Get the full content of a specific email message by ID

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "messageId"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "messageId": {
      "type": "string"
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
    "message"
  ],
  "properties": {
    "message": {
      "type": "object",
      "required": [
        "sender",
        "receiver",
        "subject",
        "body",
        "links",
        "flags",
        "message_id",
        "timestamp",
        "hasAttachments"
      ],
      "properties": {
        "body": {
          "type": [
            "string",
            "null"
          ],
          "description": "Email body content in markdown format (when HTML is available) or plain text. Null if no body content."
        },
        "flags": {
          "type": "string",
          "description": "Comma-separated list of flags: unread, important, starred, direct"
        },
        "links": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "DEPRECATED: This field always returns an empty array. Extract links directly from the markdown-formatted body content instead."
        },
        "sender": {
          "type": "string",
          "description": "Email address of the sender (From header)"
        },
        "subject": {
          "type": "string",
          "description": "Subject line of the email"
        },
        "labelIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Gmail label IDs applied to this message"
        },
        "receiver": {
          "type": "string",
          "description": "Email address of the receiver (To header)"
        },
        "threadId": {
          "type": "string",
          "description": "Gmail thread ID that this message belongs to"
        },
        "timestamp": {
          "type": [
            "string",
            "null"
          ],
          "description": "Message timestamp in epoch milliseconds (UTC)"
        },
        "message_id": {
          "type": [
            "string",
            "null"
          ],
          "description": "Gmail message ID"
        },
        "attachments": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "filename",
              "mimeType",
              "attachmentId"
            ],
            "properties": {
              "size": {
                "type": "number",
                "description": "Size of the attachment in bytes"
              },
              "filename": {
                "type": "string",
                "description": "The name of the attached file"
              },
              "mimeType": {
                "type": "string",
                "description": "MIME type of the attachment (e.g., \"application/pdf\", \"image/png\")"
              },
              "attachmentId": {
                "type": "string",
                "description": "Gmail's unique identifier for this attachment, used to download the attachment data"
              }
            },
            "additionalProperties": false
          },
          "description": "Array of attachment metadata if hasAttachments is true"
        },
        "hasAttachments": {
          "type": "boolean",
          "description": "Whether this message has attachments"
        },
        "listUnsubscribe": {
          "type": "string",
          "description": "List-Unsubscribe header value (RFC 8058). Contains mailto: and/or https: URLs for unsubscribing. Example: \"mailto:unsub@example.com, <https://example.com/unsub>\""
        },
        "listUnsubscribePost": {
          "type": "string",
          "description": "List-Unsubscribe-Post header value (RFC 8058). When present with value \"List-Unsubscribe=One-Click\", indicates one-click unsubscribe support via POST request."
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### createDraft

**Description:** Create a draft email without sending it. The body supports markdown formatting which will be converted to nicely styled HTML. To continue an existing email thread, pass the threadId from a previous message.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "to",
    "subject",
    "body",
    "isHtml",
    "cc",
    "bcc"
  ],
  "properties": {
    "cc": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "email"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "to": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "email"
      }
    },
    "bcc": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "email"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "body": {
      "type": "string"
    },
    "isHtml": {
      "type": [
        "boolean",
        "null"
      ]
    },
    "account": {
      "type": "string"
    },
    "subject": {
      "type": "string"
    },
    "threadId": {
      "type": "string",
      "description": "Optional Gmail thread ID to continue an existing conversation. Use the threadId from a previous sendMessage response or searchMessages result to keep emails in the same thread."
    },
    "attachments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "filename",
          "mimeType"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri",
            "description": "URL to fetch attachment data from. Either 'data' or 'url' must be provided, but not both."
          },
          "data": {
            "type": "string",
            "description": "Base64-encoded attachment data. Either 'data' or 'url' must be provided, but not both."
          },
          "filename": {
            "type": "string",
            "description": "The name of the attached file"
          },
          "mimeType": {
            "type": "string",
            "description": "MIME type of the attachment (e.g., \"application/pdf\", \"image/png\")"
          }
        },
        "additionalProperties": false
      },
      "description": "Optional array of attachments to include in the email"
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
    "draft"
  ],
  "properties": {
    "draft": {
      "type": "object",
      "required": [
        "id",
        "message"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "message": {
          "anyOf": [
            {
              "type": "object",
              "required": [
                "id",
                "threadId",
                "labelIds"
              ],
              "properties": {
                "id": {
                  "type": "string"
                },
                "labelIds": {
                  "anyOf": [
                    {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "threadId": {
                  "type": [
                    "string",
                    "null"
                  ]
                }
              },
              "additionalProperties": false
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### sendMessage

**Description:** Send an email immediately. The body supports markdown formatting which will be converted to nicely styled HTML. To continue an existing email thread (e.g., replying to a conversation), pass the threadId from a previous sendMessage response or searchMessages result.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "to",
    "subject",
    "body",
    "isHtml",
    "cc",
    "bcc"
  ],
  "properties": {
    "cc": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "email"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "to": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "email"
      }
    },
    "bcc": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "email"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "body": {
      "type": "string"
    },
    "isHtml": {
      "type": [
        "boolean",
        "null"
      ]
    },
    "account": {
      "type": "string"
    },
    "subject": {
      "type": "string"
    },
    "threadId": {
      "type": "string",
      "description": "Optional Gmail thread ID to continue an existing conversation. Use the threadId from a previous sendMessage response or searchMessages result to keep emails in the same thread."
    },
    "attachments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "filename",
          "mimeType"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri",
            "description": "URL to fetch attachment data from. Either 'data' or 'url' must be provided, but not both."
          },
          "data": {
            "type": "string",
            "description": "Base64-encoded attachment data. Either 'data' or 'url' must be provided, but not both."
          },
          "filename": {
            "type": "string",
            "description": "The name of the attached file"
          },
          "mimeType": {
            "type": "string",
            "description": "MIME type of the attachment (e.g., \"application/pdf\", \"image/png\")"
          }
        },
        "additionalProperties": false
      },
      "description": "Optional array of attachments to include in the email"
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
    "message"
  ],
  "properties": {
    "message": {
      "type": "object",
      "required": [
        "id",
        "threadId",
        "labelIds"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "labelIds": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            {
              "type": "null"
            }
          ]
        },
        "threadId": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### modifyMessageLabels

**Description:** Add or remove labels from an email message

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "messageId",
    "addLabelIds",
    "removeLabelIds"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "messageId": {
      "type": "string"
    },
    "addLabelIds": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "removeLabelIds": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
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
    "message"
  ],
  "properties": {
    "message": {
      "type": "object",
      "required": [
        "id",
        "threadId",
        "labelIds"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "labelIds": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            {
              "type": "null"
            }
          ]
        },
        "threadId": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### archiveMessage

**Description:** Archive an email message by removing the INBOX label

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "messageId"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "messageId": {
      "type": "string"
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
    "message"
  ],
  "properties": {
    "message": {
      "type": "object",
      "required": [
        "id",
        "threadId",
        "labelIds"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "labelIds": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            {
              "type": "null"
            }
          ]
        },
        "threadId": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### getAttachment

**Description:** Download an attachment from an email message. Use the attachmentId from the message metadata.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "messageId",
    "attachmentId"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "messageId": {
      "type": "string"
    },
    "attachmentId": {
      "type": "string"
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
    "attachment"
  ],
  "properties": {
    "attachment": {
      "type": "object",
      "required": [
        "data",
        "size"
      ],
      "properties": {
        "data": {
          "type": "string"
        },
        "size": {
          "type": "number"
        },
        "filename": {
          "type": "string"
        },
        "mimeType": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### forwardMessage

**Description:** Forward an email message to new recipients. Preserves the original message content, formatting, and all attachments. You can optionally include an additional message that will appear before the forwarded content.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "messageId",
    "to",
    "cc",
    "bcc"
  ],
  "properties": {
    "cc": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "email"
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Optional CC recipients"
    },
    "to": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "email"
      },
      "description": "Recipients of the forwarded email"
    },
    "bcc": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "email"
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Optional BCC recipients"
    },
    "account": {
      "type": "string",
      "description": "The email account to send from"
    },
    "messageId": {
      "type": "string",
      "description": "The ID of the message to forward"
    },
    "additionalMessage": {
      "type": "string",
      "description": "Optional message to include before the forwarded content"
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
    "message"
  ],
  "properties": {
    "message": {
      "type": "object",
      "required": [
        "id",
        "threadId",
        "labelIds"
      ],
      "properties": {
        "id": {
          "type": "string",
          "description": "The ID of the sent forwarded message"
        },
        "labelIds": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            {
              "type": "null"
            }
          ],
          "description": "Label IDs applied to the sent message"
        },
        "threadId": {
          "type": [
            "string",
            "null"
          ],
          "description": "The thread ID of the sent message"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

