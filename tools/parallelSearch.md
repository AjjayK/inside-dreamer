# Tool Server: parallelSearch

**ID:** d72c4433-a4df-4253-bcd7-02057c0f852f

**Short Description:** Parallel Web Systems Search & Extract APIs

## Description

LLM-optimized search for agents & Sidekick

## Tools (2)

### search

**Description:** AI-powered web search using Parallel's Search API.

**KEY FEATURES**:
- LLM-optimized excerpts ranked by reasoning utility, not engagement
- Single-hop resolution of complex multi-topic queries
- Token-efficient results for agentic workflows
- Source policy controls for domain filtering

**MODES**:
- one-shot: Comprehensive results with longer excerpts for direct answers (default)
- agentic: Concise, token-efficient results for multi-step workflows

**PARAMETERS**:
- objective: Natural language description of what you're searching for (required)
- search_queries: Optional keyword queries to guide the search
- mode: "one-shot" or "agentic" (default: "one-shot")
- max_results: Number of results to return (1-20, default: 10)
- source_policy: Optional domain filtering (include_domains, exclude_domains)

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "objective"
  ],
  "properties": {
    "mode": {
      "enum": [
        "one-shot",
        "agentic"
      ],
      "type": "string",
      "description": "Search mode: 'one-shot' for comprehensive results (default), 'agentic' for token-efficient multi-step workflows"
    },
    "objective": {
      "type": "string",
      "description": "Natural-language description of what you're searching for. Include context, preferred sources, and freshness requirements."
    },
    "max_results": {
      "type": "integer",
      "maximum": 20,
      "minimum": 1,
      "description": "Maximum number of results to return (1-20, default: 10)"
    },
    "search_queries": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional keyword search queries to guide the search."
    },
    "exclude_domains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Exclude results from these domains"
    },
    "include_domains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Restrict results to these domains (e.g., ['example.com', '.gov', '.edu'])"
    },
    "max_chars_total": {
      "type": "integer",
      "maximum": 9007199254740991,
      "minimum": -9007199254740991,
      "description": "Optional upper bound on total characters across all results."
    },
    "max_chars_per_result": {
      "type": "integer",
      "maximum": 9007199254740991,
      "minimum": -9007199254740991,
      "description": "Optional upper bound on characters per result."
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
    "fetchedAt"
  ],
  "properties": {
    "error": {
      "anyOf": [
        {
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
        {
          "type": "null"
        }
      ],
      "description": "Error information if search failed"
    },
    "usage": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "name",
              "count"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "SKU name"
              },
              "count": {
                "type": "number",
                "description": "SKU count"
              }
            },
            "additionalProperties": false
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Usage metrics for the search"
    },
    "results": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "url"
            ],
            "properties": {
              "url": {
                "type": "string",
                "description": "URL of the search result"
              },
              "title": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Title of the webpage"
              },
              "excerpts": {
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
                "description": "Relevant excerpts from the page, formatted as markdown"
              },
              "publish_date": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Publish date in YYYY-MM-DD format"
              }
            },
            "additionalProperties": false
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Array of search results ordered by relevance"
    },
    "success": {
      "type": "boolean"
    },
    "warnings": {
      "anyOf": [
        {
          "type": "array",
          "items": {
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
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Any warnings from the search"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO timestamp of when search completed"
    },
    "search_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Parallel search ID"
    },
    "truncated": {
      "type": "boolean",
      "description": "Whether results were truncated to fit token limit"
    },
    "results_removed": {
      "type": "number",
      "description": "Number of results removed due to token limit truncation"
    }
  },
  "additionalProperties": false
}
```

### extract

**Description:** Extract content from specific web URLs using Parallel's Extract API.

**BEST PRACTICES**:
- Always provide a specific, focused objective to get relevant excerpts
- Broad objectives return too much content; be precise about what you need
- Example good objective: "What is the company's revenue for Q3 2024?"
- Example bad objective: "What is interesting about this page?"

**USE CASES**:
- Extract specific facts or data points from known URLs
- Get targeted excerpts answering a specific question
- Retrieve full page content when you need everything

**PARAMETERS**:
- urls: Array of URLs to extract content from (required)
- objective: Search objective to focus excerpts (highly recommended for useful results)
- excerpts: Include relevant excerpts (default: true)
- full_content: Include full page content (default: false)

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "urls"
  ],
  "properties": {
    "urls": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      },
      "maxItems": 10,
      "minItems": 1,
      "description": "URLs to extract content from (1-10 URLs)"
    },
    "excerpts": {
      "type": "boolean",
      "default": true,
      "description": "Include excerpts relevant to the objective (default: true)"
    },
    "objective": {
      "type": "string",
      "description": "Specific objective to focus excerpts (e.g., 'What is the founding date?' not 'Tell me about this company')"
    },
    "full_content": {
      "type": "boolean",
      "default": false,
      "description": "Include full page content (default: false)"
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
    "fetchedAt"
  ],
  "properties": {
    "error": {
      "anyOf": [
        {
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
        {
          "type": "null"
        }
      ],
      "description": "Error information if extraction failed"
    },
    "errors": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "url",
              "error_type"
            ],
            "properties": {
              "url": {
                "type": "string"
              },
              "content": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "error_type": {
                "type": "string"
              },
              "http_status_code": {
                "anyOf": [
                  {
                    "type": "number"
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
        {
          "type": "null"
        }
      ],
      "description": "Extraction errors for failed URLs"
    },
    "results": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "url"
            ],
            "properties": {
              "url": {
                "type": "string",
                "description": "URL that was analyzed"
              },
              "title": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Page title"
              },
              "excerpts": {
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
                "description": "Relevant excerpts from the page"
              },
              "full_content": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Full page content if requested"
              },
              "publish_date": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Publish date in YYYY-MM-DD format"
              }
            },
            "additionalProperties": false
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Successful extraction results"
    },
    "success": {
      "type": "boolean"
    },
    "warnings": {
      "anyOf": [
        {
          "type": "array",
          "items": {
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
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "Any warnings from the extraction"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO timestamp of when extraction completed"
    },
    "truncated": {
      "type": "boolean",
      "description": "Whether results were truncated to fit token limit"
    },
    "extract_id": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Parallel extract ID"
    },
    "results_removed": {
      "type": "number",
      "description": "Number of results removed due to token limit truncation"
    }
  },
  "additionalProperties": false
}
```

