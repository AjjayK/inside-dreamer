# Tool Server: contacts

**ID:** 82269536-fef3-461d-b329-917f9f8b59c1

**Short Description:** Search your Google Contacts

## Description

Read only access to your Google Contacts data

## Tools (6)

### listAccounts

**Description:** Get Google accounts available for contacts access

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
              "google"
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

### listContacts

**Description:** List all contacts for the authenticated user

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "maxResults",
    "pageToken"
  ],
  "properties": {
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
    "contacts",
    "nextPageToken"
  ],
  "properties": {
    "contacts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "resourceName"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "photo": {
            "type": [
              "string",
              "null"
            ]
          },
          "phoneNumbers": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "resourceName": {
            "type": "string"
          },
          "organizations": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "emailAddresses": {
            "type": "array",
            "items": {
              "type": "string"
            }
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

### searchContacts

**Description:** Search contacts by name, email, or other fields

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "query",
    "maxResults"
  ],
  "properties": {
    "query": {
      "type": "string"
    },
    "account": {
      "type": "string"
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
    "contacts"
  ],
  "properties": {
    "contacts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "resourceName"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "photo": {
            "type": [
              "string",
              "null"
            ]
          },
          "phoneNumbers": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "resourceName": {
            "type": "string"
          },
          "organizations": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "emailAddresses": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### getContact

**Description:** Get detailed information about a specific contact

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "resourceName"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "resourceName": {
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
    "contact"
  ],
  "properties": {
    "contact": {
      "type": "object",
      "required": [
        "resourceName"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "photo": {
          "type": [
            "string",
            "null"
          ]
        },
        "phoneNumbers": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "resourceName": {
          "type": "string"
        },
        "organizations": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "emailAddresses": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### listContactGroups

**Description:** List all contact groups for the authenticated user

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
    "groups"
  ],
  "properties": {
    "groups": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "resourceName",
          "name",
          "memberCount",
          "groupType"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "groupType": {
            "type": "string"
          },
          "memberCount": {
            "type": "number"
          },
          "resourceName": {
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

### getContactsInGroup

**Description:** Get all contacts in a specific contact group

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "groupResourceName",
    "maxResults"
  ],
  "properties": {
    "account": {
      "type": "string"
    },
    "maxResults": {
      "type": [
        "number",
        "null"
      ]
    },
    "groupResourceName": {
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
    "contacts"
  ],
  "properties": {
    "contacts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "resourceName"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "photo": {
            "type": [
              "string",
              "null"
            ]
          },
          "phoneNumbers": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "resourceName": {
            "type": "string"
          },
          "organizations": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "emailAddresses": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

