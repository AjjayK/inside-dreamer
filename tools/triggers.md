# Tool Server: triggers

**ID:** 49dbcb4d-07f9-4fbc-93ef-6611513515bd

**Short Description:** Manage agent triggers

## Description

Manage agents' triggers, allowing adding/removing personal triggers and listing all published/personal triggers

## Tools (4)

### add_personal

**Description:** Add a personal trigger to an agent instance. Personal triggers are specific to this user's installation and are NOT copied when other users install the agent from the gallery.

Use personal triggers when:
- The trigger is specific to this user's workflow or preferences (e.g., "check my email at 9 AM")
- The trigger depends on user-specific data or context
- You want to customize timing or criteria for this particular user

DO NOT use personal triggers for:
- Core agent functionality that all users of the agent should have in an identical way
- Triggers that are intended to have the same criteria/timing for every user
- Triggers required for key functionality, unless the agent's code is capable of creating those triggers

If you're unsure, use personal triggers - users can always move them to published triggers later by editing agent.yml.

Note: Triggers (both published and personal) can share entrypoints, so long as they have otherwise unique configuration.

Security: The targetAgentId parameter allows modifying triggers for other agents. Only the Sidekick agent can modify triggers for other agents - non-Sidekick agents can only modify their own triggers.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "trigger"
  ],
  "properties": {
    "trigger": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "type",
            "cronExpression",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "cron"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "cronExpression": {
              "type": "string",
              "description": "Standard cron format (e.g., '0 9 * * *' for 9 AM daily)"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "input"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "contentTypes": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "Content types to accept (e.g., ['text/plain', 'image/jpeg'])"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name",
            "filters"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "email"
            },
            "filters": {
              "type": "object",
              "properties": {
                "to": {
                  "type": "string",
                  "description": "Filter emails to this address"
                },
                "from": {
                  "type": "string",
                  "description": "Filter emails from this address"
                },
                "labels": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Filter emails with these labels"
                },
                "subject": {
                  "type": "string",
                  "description": "Filter emails with this subject pattern"
                },
                "hasAttachment": {
                  "type": "boolean",
                  "description": "Filter emails with/without attachments"
                }
              },
              "additionalProperties": false
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "webhook"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        }
      ]
    },
    "targetAgentId": {
      "type": "string",
      "description": "Optional agent ID to add the trigger to. If not provided, adds to the calling agent. Only Sidekick can specify an agent other than itself."
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
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "trigger": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "type",
            "cronExpression",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "cron"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "cronExpression": {
              "type": "string",
              "description": "Standard cron format (e.g., '0 9 * * *' for 9 AM daily)"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "input"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "contentTypes": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "Content types to accept (e.g., ['text/plain', 'image/jpeg'])"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name",
            "filters"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "email"
            },
            "filters": {
              "type": "object",
              "properties": {
                "to": {
                  "type": "string",
                  "description": "Filter emails to this address"
                },
                "from": {
                  "type": "string",
                  "description": "Filter emails from this address"
                },
                "labels": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Filter emails with these labels"
                },
                "subject": {
                  "type": "string",
                  "description": "Filter emails with this subject pattern"
                },
                "hasAttachment": {
                  "type": "boolean",
                  "description": "Filter emails with/without attachments"
                }
              },
              "additionalProperties": false
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "webhookId",
            "entrypoint"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "webhook"
            },
            "webhookId": {
              "type": "string",
              "description": "The unique ID of the webhook endpoint"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        }
      ]
    }
  },
  "additionalProperties": false
}
```

### list

**Description:** List all triggers for an agent, separated into published triggers and personal triggers.

Published triggers:
- Defined in the agent's code/configuration (agent.yml)
- Copied when users install or remix the agent from gallery
- Same for all users (unless customized)

Personal triggers:
- Created at runtime by the agent, by Sidekick or coding agents (using the triggers tool), or manually by the user
- Specific to this user's installation
- Never copied to other users

Security: The targetAgentId parameter allows listing triggers for other agents. Only the Sidekick agent can list triggers for other agents - non-Sidekick agents can only list their own triggers.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "targetAgentId": {
      "type": "string",
      "description": "Optional agent ID to list triggers for. If not provided, lists triggers for the calling agent. Only Sidekick can specify an agent other than itself."
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
    "publishedTriggers",
    "personalTriggers"
  ],
  "properties": {
    "personalTriggers": {
      "type": "array",
      "items": {
        "$ref": "#/properties/publishedTriggers/items"
      }
    },
    "publishedTriggers": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "object",
            "required": [
              "type",
              "cronExpression",
              "entrypoint",
              "name"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Human-readable name for this trigger"
              },
              "type": {
                "type": "string",
                "const": "cron"
              },
              "entrypoint": {
                "type": "string",
                "description": "The function name to call when this trigger fires"
              },
              "cronExpression": {
                "type": "string",
                "description": "Standard cron format (e.g., '0 9 * * *' for 9 AM daily)"
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "required": [
              "type",
              "entrypoint",
              "name"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Human-readable name for this trigger"
              },
              "type": {
                "type": "string",
                "const": "input"
              },
              "entrypoint": {
                "type": "string",
                "description": "The function name to call when this trigger fires"
              },
              "contentTypes": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "Content types to accept (e.g., ['text/plain', 'image/jpeg'])"
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "required": [
              "type",
              "entrypoint",
              "name",
              "filters"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Human-readable name for this trigger"
              },
              "type": {
                "type": "string",
                "const": "email"
              },
              "filters": {
                "type": "object",
                "properties": {
                  "to": {
                    "type": "string",
                    "description": "Filter emails to this address"
                  },
                  "from": {
                    "type": "string",
                    "description": "Filter emails from this address"
                  },
                  "labels": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Filter emails with these labels"
                  },
                  "subject": {
                    "type": "string",
                    "description": "Filter emails with this subject pattern"
                  },
                  "hasAttachment": {
                    "type": "boolean",
                    "description": "Filter emails with/without attachments"
                  }
                },
                "additionalProperties": false
              },
              "entrypoint": {
                "type": "string",
                "description": "The function name to call when this trigger fires"
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "required": [
              "type",
              "webhookId",
              "entrypoint"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Human-readable name for this trigger"
              },
              "type": {
                "type": "string",
                "const": "webhook"
              },
              "webhookId": {
                "type": "string",
                "description": "The unique ID of the webhook endpoint"
              },
              "entrypoint": {
                "type": "string",
                "description": "The function name to call when this trigger fires"
              }
            },
            "additionalProperties": false
          }
        ]
      }
    }
  },
  "additionalProperties": false
}
```

### remove_personal

**Description:** Remove a personal trigger, specified by its current configuration.

This only removes personal triggers, not published triggers. To remove a published trigger, edit the associated agent.yml file.

Security: The targetAgentId parameter allows removing triggers from other agents. Only the Sidekick agent can remove triggers from other agents - non-Sidekick agents can only remove their own triggers.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "trigger"
  ],
  "properties": {
    "trigger": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "type",
            "cronExpression",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "cron"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "cronExpression": {
              "type": "string",
              "description": "Standard cron format (e.g., '0 9 * * *' for 9 AM daily)"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "input"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "contentTypes": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "Content types to accept (e.g., ['text/plain', 'image/jpeg'])"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name",
            "filters"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "email"
            },
            "filters": {
              "type": "object",
              "properties": {
                "to": {
                  "type": "string",
                  "description": "Filter emails to this address"
                },
                "from": {
                  "type": "string",
                  "description": "Filter emails from this address"
                },
                "labels": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Filter emails with these labels"
                },
                "subject": {
                  "type": "string",
                  "description": "Filter emails with this subject pattern"
                },
                "hasAttachment": {
                  "type": "boolean",
                  "description": "Filter emails with/without attachments"
                }
              },
              "additionalProperties": false
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "webhookId",
            "entrypoint"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "webhook"
            },
            "webhookId": {
              "type": "string",
              "description": "The unique ID of the webhook endpoint"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        }
      ]
    },
    "targetAgentId": {
      "type": "string",
      "description": "Optional agent ID to remove the trigger from. If not provided, removes from the calling agent. Only Sidekick can specify an agent other than itself."
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
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "trigger": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "type",
            "cronExpression",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "cron"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "cronExpression": {
              "type": "string",
              "description": "Standard cron format (e.g., '0 9 * * *' for 9 AM daily)"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "input"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            },
            "contentTypes": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "Content types to accept (e.g., ['text/plain', 'image/jpeg'])"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "entrypoint",
            "name",
            "filters"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "email"
            },
            "filters": {
              "type": "object",
              "properties": {
                "to": {
                  "type": "string",
                  "description": "Filter emails to this address"
                },
                "from": {
                  "type": "string",
                  "description": "Filter emails from this address"
                },
                "labels": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Filter emails with these labels"
                },
                "subject": {
                  "type": "string",
                  "description": "Filter emails with this subject pattern"
                },
                "hasAttachment": {
                  "type": "boolean",
                  "description": "Filter emails with/without attachments"
                }
              },
              "additionalProperties": false
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "object",
          "required": [
            "type",
            "webhookId",
            "entrypoint"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "Human-readable name for this trigger"
            },
            "type": {
              "type": "string",
              "const": "webhook"
            },
            "webhookId": {
              "type": "string",
              "description": "The unique ID of the webhook endpoint"
            },
            "entrypoint": {
              "type": "string",
              "description": "The function name to call when this trigger fires"
            }
          },
          "additionalProperties": false
        }
      ]
    }
  },
  "additionalProperties": false
}
```

### get_webhook_urls

**Description:** Get all webhook URLs for an agent.

This returns all active webhook URLs that can be called by external services, including:
- The webhook ID (used in trigger configuration)
- The full webhook URL
- Creation time and usage statistics

Use this to retrieve webhook URLs that agents can share with external services or display to users.
Agents should first call 'list' to see webhook triggers, then call this to get the corresponding URLs.

Security: The targetAgentId parameter allows retrieving webhook URLs for other agents. Only the Sidekick agent can retrieve webhook URLs for other agents - non-Sidekick agents can only retrieve their own webhook URLs.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "targetAgentId": {
      "type": "string",
      "description": "Optional agent ID to get webhook URLs for. If not provided, gets URLs for the calling agent. Only Sidekick can specify an agent other than itself."
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
    "webhooks"
  ],
  "properties": {
    "webhooks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "url",
          "createdAt",
          "triggerCount"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "The webhook ID (used in trigger configuration)"
          },
          "url": {
            "type": "string",
            "description": "The full webhook URL that can be called by external services"
          },
          "createdAt": {
            "type": "string",
            "description": "When this webhook was created"
          },
          "triggerCount": {
            "type": "number",
            "description": "Number of times this webhook has been triggered"
          },
          "lastTriggeredAt": {
            "type": "string",
            "description": "When this webhook was last triggered"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

