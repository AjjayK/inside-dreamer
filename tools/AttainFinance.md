# Tool Server: AttainFinance

**ID:** 8b5b3d55-7f1e-40c7-9163-b317faf29c30

**Short Description:** Connect to your personal financial accounts, context, and our expert tools to improve your financial health.

## Description

Connect to your personal financial accounts, context, and our expert tools to improve your financial health. Visit attainfinance.io for more information.

## Tools (21)

### connect-account

**Description:** Connect a bank, credit card, or investment account to get started. Opens a secure browser window where the user can safely authenticate with their financial institution. IMPORTANT: Only call this tool one at a time - wait for the user to complete the connection before calling again. Encourage users to connect multiple institutions (checking, savings, credit cards, investments) to get the full value of budgeting, transaction tracking, and financial insights across all their accounts.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

### get-account-status

**Description:** View connected institutions with balance details, connection health, and last sync timestamps. Use this before updating or disconnecting an institution.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

### update-account-link

**Description:** IMPORTANT: Only use this tool when an account connection is broken. ALWAYS call get-account-status FIRST to verify the connection shows an error status before calling this tool. This tool updates a broken or expired account connection by re-authenticating with the financial institution. Returns a secure link for the user to complete re-authentication. After the user completes the update, they should say 'I've updated it, please refresh my transactions' to sync their data.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "item_id"
  ],
  "properties": {
    "item_id": {
      "type": "string",
      "description": "The account's item_id to update (get this from get-account-status)"
    },
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

### disconnect-account

**Description:** Remove a connected account and revoke access. This will delete all stored connection data for the specified account.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "item_id"
  ],
  "properties": {
    "item_id": {
      "type": "string",
      "description": "The account's item_id to disconnect (get this from get-account-status)"
    },
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

### get-financial-summary

**Description:** Get a comprehensive overview of your financial status including net worth, assets, liabilities, and week-over-week trends. Shows account balances grouped by type and provides suggested next steps. This is a read-only tool that provides instant access to your financial data stored in the database.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
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
    "view",
    "dashboard"
  ],
  "properties": {
    "view": {
      "type": "string",
      "const": "financial-summary",
      "description": "View type identifier"
    },
    "summary": {
      "type": "object",
      "required": [
        "netWorth",
        "assetsTotal",
        "liabilitiesTotal"
      ],
      "properties": {
        "netWorth": {
          "type": "number"
        },
        "assetsTotal": {
          "type": "number"
        },
        "liabilitiesTotal": {
          "type": "number"
        }
      },
      "description": "Financial summary statistics. Expected: netWorth (number), assetsTotal (number), liabilitiesTotal (number), totalAccounts (number), accountsByCategory (record), lastSynced (string|null), liabilities (object with total/credit/mortgage/student counts), netWorthTrend (object|null with amountChange/percentChange/direction/baselineDate). Additional fields may be added.",
      "additionalProperties": true
    },
    "accounts": {
      "type": "array",
      "description": "Array of account details with balances and metadata"
    },
    "dashboard": {
      "type": "object",
      "required": [
        "hero"
      ],
      "properties": {
        "hero": {
          "type": "object",
          "required": [
            "netWorth",
            "assetsTotal",
            "liabilitiesTotal",
            "hasData"
          ],
          "properties": {
            "hasData": {
              "type": "boolean"
            },
            "netWorth": {
              "type": "number"
            },
            "assetsTotal": {
              "type": "number"
            },
            "liabilitiesTotal": {
              "type": "number"
            }
          },
          "description": "Hero section data. Expected: netWorth (number), assetsTotal (number), liabilitiesTotal (number), hasData (boolean), lastUpdatedAt (string|null), trend (object|null with amountChange/percentChange/direction/label/baselineDate), nextSteps (array of action objects). Additional fields may be present.",
          "additionalProperties": true
        }
      },
      "description": "Dashboard-specific structured data",
      "additionalProperties": true
    },
    "snapshots": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "snapshot_date",
          "net_worth_amount"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "snapshot_date": {
            "type": "string"
          },
          "net_worth_amount": {
            "type": "number"
          }
        },
        "additionalProperties": true
      },
      "description": "Historical net worth snapshots (up to 8, ordered newest to oldest). Expected fields: id (string), snapshot_date (ISO date), net_worth_amount (number), user_id (string), assets_total (number), liabilities_total (number), created_at (string|null), updated_at (string|null). Additional fields may be present."
    }
  },
  "additionalProperties": false
}
```

### batch-update-categories

**Description:** Update categories for multiple transactions at once. Use this when the user asks you to recategorize transactions.

Process transactions in batches of ~30 at a time. For each transaction, assign an appropriate category.

These updates do NOT mark transactions as manually categorized - they can still be recategorized by background sync if the user updates their categorization rules.

Common categories:
- FOOD_AND_DRINK_COFFEE, FOOD_AND_DRINK_RESTAURANT, FOOD_AND_DRINK_GROCERIES
- TRANSPORTATION_GAS, TRANSPORTATION_TAXIS_AND_RIDE_SHARES
- ENTERTAINMENT_TV_AND_MOVIES, ENTERTAINMENT_MUSIC_AND_AUDIO
- GENERAL_MERCHANDISE_ONLINE_MARKETPLACES, GENERAL_MERCHANDISE_ELECTRONICS
- RENT_AND_UTILITIES_INTERNET_AND_CABLE, RENT_AND_UTILITIES_GAS_AND_ELECTRICITY

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "updates"
  ],
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    },
    "updates": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "transaction_id",
          "category"
        ],
        "properties": {
          "category": {
            "type": "string",
            "description": "The category to assign"
          },
          "confidence": {
            "type": "integer",
            "maximum": 10,
            "minimum": 1,
            "description": "Confidence level (1-10) for this categorization. 9-10 = high confidence, 5-8 = medium, 1-4 = low."
          },
          "transaction_id": {
            "type": "string",
            "description": "The transaction ID"
          }
        },
        "additionalProperties": true
      },
      "description": "Array of transaction updates (recommended batch size: 30)"
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
    "success",
    "updatedCount"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "updatedCount": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### update-transaction-category

**Description:** Confirm or change a SINGLE transaction's category and mark it as manually categorized. Use this when the user explicitly confirms a category for one transaction. The transaction will NOT be changed by future background recategorizations. Pass category in options.category.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "transaction_id"
  ],
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "New category to assign (e.g., 'FOOD_AND_DRINK_COFFEE'). If omitted, accepts the current category."
        }
      },
      "description": "Category options",
      "additionalProperties": true
    },
    "transaction_id": {
      "type": "string",
      "description": "The transaction ID to update"
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
    "success",
    "transactionId",
    "category"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "category": {
      "type": "string",
      "description": "The final category after update"
    },
    "transactionId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get-financial-context

**Description:** Retrieve the user's Financial Context - their personal financial document.

This document contains important information about the user's financial situation that you should reference when:
- Providing personalized financial advice
- Understanding spending patterns and goals
- Making budget recommendations
- Analyzing transactions in context
- Discussing financial planning

If empty or not yet created, consider asking the user about their financial goals, income, expenses, and situation, then save it using update-financial-context.

Returns the document content and last updated timestamp, or null if not yet created.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
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
    "content",
    "updatedAt"
  ],
  "properties": {
    "content": {
      "type": [
        "string",
        "null"
      ],
      "description": "The Financial Context content, or null if not created yet"
    },
    "updatedAt": {
      "type": [
        "string",
        "null"
      ],
      "description": "When the context was last updated (ISO format)"
    }
  },
  "additionalProperties": false
}
```

### update-financial-context

**Description:** Update the user's Financial Context - their personal financial situation document.

Use this to record important information learned during conversations:
- Financial goals (retirement, house purchase, debt payoff, emergency fund)
- Income sources and approximate amounts
- Regular expenses and financial commitments
- Investment preferences and risk tolerance
- Life circumstances affecting finances (dependents, job situation, location)
- Spending habits and patterns observed
- Budget preferences and constraints
- Specific merchant context (e.g., "Locale near my house is a grocery store, not a restaurant")

The content should be free-form text written in a way that helps future conversations understand the user's complete financial picture. Think of it like a CLAUDE.md file but for personal finance.

IMPORTANT: This REPLACES the entire document. Always call get-financial-context first to preserve existing content and append/update it rather than overwriting.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "content"
  ],
  "properties": {
    "content": {
      "type": "string",
      "description": "The complete Financial Context content (replaces existing)"
    },
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
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
    "success",
    "contentLength"
  ],
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the update was successful"
    },
    "contentLength": {
      "type": "number",
      "description": "Length of saved content in characters"
    }
  },
  "additionalProperties": false
}
```

### get-opinion

**Description:** Get an expert opinion prompt to apply to your financial analysis. Returns the full analysis instructions for a specific methodology (e.g., Graham Stephan's 20% Rule, Minimalist budgeting).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "opinion_id"
  ],
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    },
    "opinion_id": {
      "type": "string",
      "description": "The ID of the opinion to retrieve (e.g., 'graham-20-percent-rule')"
    }
  },
  "additionalProperties": false
}
```

### get-budgets

**Description:** CALL THIS FIRST when user asks about budgets, wants to create a budget, or view budget status. Shows existing budgets with spending progress or provides creation guidance if no budgets exist. Use show_transactions=true to include matching transactions, or false (default) to get just spending totals. Optionally filter by budget_id to get a specific budget. Returns widget visualization showing budget progress bars.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "limit": {
      "type": "integer",
      "description": "Maximum number of budgets to return (for pagination)",
      "exclusiveMinimum": 0
    },
    "offset": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of budgets to skip (for pagination)"
    },
    "options": {
      "type": "object",
      "properties": {
        "show_transactions": {
          "type": "boolean",
          "description": "Include matching transactions in the response (default: false)"
        }
      },
      "description": "Additional options for customizing the response",
      "additionalProperties": true
    },
    "budget_id": {
      "type": "string",
      "description": "Optional: Get specific budget by ID. If omitted, returns all budgets."
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
    "budgets",
    "widgetInstructions",
    "exampleBudgets"
  ],
  "properties": {
    "budgets": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "amount"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "amount": {
            "type": "number"
          }
        },
        "additionalProperties": true
      },
      "description": "List of budget objects. Expected fields: id (string), amount (number), title (string), period (string), spent (number), remaining (number), percentage (number), status (string), transactionCount (number), dateRange (object), processingStatus (string), transactions (array, optional). Additional fields may be present."
    },
    "exampleBudgets": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Example budget descriptions to help users create their first budget"
    },
    "widgetInstructions": {
      "type": "string",
      "description": "Detailed guidance for creating and managing budgets"
    }
  },
  "additionalProperties": false
}
```

### create-budget

**Description:** Create a new budget after calling get-budgets first. Two budget types: ROLLING (last N days, continuously rolling) or FIXED (calendar-based with custom start date). For rolling budgets: provide time_period='rolling' and custom_period_days in options. For fixed budgets: provide time_period (weekly/biweekly/monthly/quarterly/yearly) and fixed_period_start_date in options.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "options"
  ],
  "properties": {
    "options": {
      "type": "object",
      "required": [
        "title",
        "filter_prompt",
        "budget_amount",
        "time_period"
      ],
      "properties": {
        "title": {
          "type": "string",
          "description": "Display name for the budget (e.g., 'Coffee Shop Budget')"
        },
        "time_period": {
          "enum": [
            "rolling",
            "weekly",
            "biweekly",
            "monthly",
            "quarterly",
            "yearly"
          ],
          "type": "string",
          "description": "Budget type: 'rolling' for last N days, or fixed periods (weekly/biweekly/monthly/quarterly/yearly)"
        },
        "budget_amount": {
          "type": "number",
          "description": "Dollar amount limit for the budget",
          "exclusiveMinimum": 0
        },
        "filter_prompt": {
          "type": "string",
          "description": "Natural language filter criteria describing which transactions to include"
        },
        "custom_period_days": {
          "type": "integer",
          "description": "Required for 'rolling' budgets: number of days to track (e.g., 7, 30, 90)",
          "exclusiveMinimum": 0
        },
        "fixed_period_start_date": {
          "type": "string",
          "description": "Required for fixed budgets: anchor date in YYYY-MM-DD format (e.g., '2025-01-15' for monthly budget starting on 15th)"
        }
      },
      "description": "Budget configuration options",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

### update-budget-rules

**Description:** Update an existing budget's configuration (title, filter rules, amount, or time period). Call get-budgets first to get the budget ID. Provide 'budget_id' at top level, and any fields to change in 'options'. After updating, transactions will be re-matched against the new rules.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "budget_id"
  ],
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Optional: Update display name for the budget"
        },
        "time_period": {
          "enum": [
            "rolling",
            "weekly",
            "biweekly",
            "monthly",
            "quarterly",
            "yearly"
          ],
          "type": "string",
          "description": "Optional: Update budget type"
        },
        "budget_amount": {
          "type": "number",
          "description": "Optional: Update dollar amount limit",
          "exclusiveMinimum": 0
        },
        "filter_prompt": {
          "type": "string",
          "description": "Optional: Update natural language filter criteria"
        },
        "custom_period_days": {
          "type": "integer",
          "description": "Optional: Update number of days for rolling budgets",
          "exclusiveMinimum": 0
        },
        "fixed_period_start_date": {
          "type": "string",
          "description": "Optional: Update anchor date for fixed budgets (YYYY-MM-DD)"
        }
      },
      "description": "Budget fields to update",
      "additionalProperties": true
    },
    "budget_id": {
      "type": "string",
      "description": "Budget ID to update (required - get from get-budgets tool)"
    }
  },
  "additionalProperties": false
}
```

### delete-budget

**Description:** Delete a budget by ID. Use get-budgets to find the budget ID.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "budget_id"
  ],
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    },
    "budget_id": {
      "type": "string",
      "description": "Budget ID to delete"
    }
  },
  "additionalProperties": false
}
```

### get-transactions

**Description:** Retrieve categorized transaction data from the user's connected financial institution. Returns structured transaction data with AI-powered categorization, along with analysis and visualization guidance. Use options.categories, options.budget_id, options.pending_only, or options.exclude_pending for filtering.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "limit": {
      "type": "integer",
      "description": "Maximum number of transactions to return (for pagination)",
      "exclusiveMinimum": 0
    },
    "offset": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of transactions to skip (for pagination)"
    },
    "options": {
      "type": "object",
      "properties": {
        "budget_id": {
          "type": "string",
          "description": "Filter transactions tagged to a specific budget (exact match). Get budget IDs by calling get-budgets tool first. Example: 'budget_123'"
        },
        "categories": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Filter transactions by category names (case-insensitive partial match). Searches AI-generated custom categories. Multiple categories use OR logic. Example: ['Food', 'Transport'] will match 'Food & Dining', 'Transportation', etc."
        },
        "pending_only": {
          "type": "boolean",
          "description": "Show only pending transactions (exact match). Useful for cash flow management and seeing what charges haven't cleared yet. Cannot be used with exclude_pending."
        },
        "exclude_pending": {
          "type": "boolean",
          "description": "Exclude pending transactions (exact match). Shows only confirmed/cleared transactions. Useful for accurate spending analysis. Cannot be used with pending_only."
        }
      },
      "description": "Additional filtering and display options",
      "additionalProperties": true
    },
    "end_date": {
      "type": "string",
      "description": "End date in YYYY-MM-DD format (default: today)"
    },
    "start_date": {
      "type": "string",
      "description": "Start date in YYYY-MM-DD format (default: all available data)"
    },
    "account_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Filter transactions by account IDs (exact match). Get account IDs by calling get-account-status tool first. Example: ['account_123', 'account_456']"
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
    "transactions",
    "summary",
    "availableCategories",
    "dataInstructions",
    "visualizationInstructions"
  ],
  "properties": {
    "summary": {
      "type": "object",
      "required": [
        "transactionCount"
      ],
      "properties": {
        "transactionCount": {
          "type": "number"
        }
      },
      "description": "Summary statistics. Expected: transactionCount (number), dateRange.start (string), dateRange.end (string). Additional fields may be added.",
      "additionalProperties": true
    },
    "transactions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "transaction_id",
          "date",
          "amount"
        ],
        "properties": {
          "date": {
            "type": "string"
          },
          "amount": {
            "type": "number"
          },
          "transaction_id": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "description": "Array of transaction objects. Expected fields: transaction_id (string), date (YYYY-MM-DD), amount (number), description (string), category (string), category_confidence (number|null), account_name (string), pending (boolean). Additional fields may be present."
    },
    "dataInstructions": {
      "type": "string",
      "description": "Guidelines for analyzing transaction data"
    },
    "availableCategories": {
      "type": "object",
      "description": "Available categories for recategorization. Use these when calling batch-update-categories.",
      "additionalProperties": {}
    },
    "visualizationInstructions": {
      "type": "string",
      "description": "Recommendations for visualizing transaction data"
    }
  },
  "additionalProperties": false
}
```

### get-raw-transactions

**Description:** Download raw transaction data as CSV without AI categorization. Use this when you need the pure data export for external analysis or spreadsheet tools. For analyzed data with categories, use 'get-transactions' instead.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    },
    "end_date": {
      "type": "string",
      "description": "End date in YYYY-MM-DD format (default: today)"
    },
    "start_date": {
      "type": "string",
      "description": "Start date in YYYY-MM-DD format (default: 90 days ago)"
    }
  },
  "additionalProperties": false
}
```

### get-investment-holdings

**Description:** View your investment portfolio across all connected investment accounts (401k, IRA, brokerage, crypto exchange). Shows total portfolio value, breakdown by security with current prices, quantity held, and gain/loss if cost basis is available. This is a read-only tool that provides instant access to your holdings data stored in the database.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
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
    "holdings",
    "summary"
  ],
  "properties": {
    "summary": {
      "type": "object",
      "required": [
        "totalValue",
        "holdingCount"
      ],
      "properties": {
        "totalValue": {
          "type": "number"
        },
        "holdingCount": {
          "type": "number"
        }
      },
      "description": "Portfolio summary. Expected: totalValue (number), holdingCount (number), accountCount (number), totalCostBasis (number|null), totalGainLoss (number|null), totalGainLossPercentage (number|null). Additional fields may be added.",
      "additionalProperties": true
    },
    "holdings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "security_id",
          "quantity",
          "institution_value"
        ],
        "properties": {
          "quantity": {
            "type": "number"
          },
          "security_id": {
            "type": "string"
          },
          "institution_value": {
            "type": "number"
          }
        },
        "additionalProperties": true
      },
      "description": "Array of investment holdings. Expected fields: security_id (string), quantity (number), institution_value (number), account_id (string), account_name (string), ticker_symbol (string|null), security_name (string|null), institution_price (number), cost_basis (number|null), gain_loss (number|null), gain_loss_percentage (number|null). Additional fields may be present."
    }
  },
  "additionalProperties": false
}
```

### get-liabilities

**Description:** View your liabilities across all connected accounts including credit cards, mortgages, and student loans. Shows payment schedules, interest rates, balances, and overdue status. Optionally filter by liability type (credit, mortgage, or student). Data is fetched from Plaid on first call and then cached in the database for instant access.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "type": {
      "enum": [
        "credit",
        "mortgage",
        "student"
      ],
      "type": "string",
      "description": "Optional filter by liability type: 'credit' (credit cards), 'mortgage' (home loans), or 'student' (student loans)"
    },
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
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
    "liabilities",
    "summary",
    "dataInstructions"
  ],
  "properties": {
    "summary": {
      "type": "object",
      "required": [
        "totalLiabilities"
      ],
      "properties": {
        "totalLiabilities": {
          "type": "number"
        }
      },
      "description": "Summary statistics. Expected: totalLiabilities (number), creditCount (number), mortgageCount (number), studentCount (number). Additional fields may be added.",
      "additionalProperties": true
    },
    "liabilities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "account_id",
          "type"
        ],
        "properties": {
          "type": {
            "enum": [
              "credit",
              "mortgage",
              "student"
            ],
            "type": "string"
          },
          "account_id": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "description": "Array of liability objects. Expected fields: account_id (string), type ('credit'|'mortgage'|'student'), account_name (string|null), data (object with liability-specific details). Additional fields may be present."
    },
    "dataInstructions": {
      "type": "string",
      "description": "Guidelines for analyzing liability data"
    }
  },
  "additionalProperties": false
}
```

### get-recurring-transactions

**Description:** view your recurring transactions from all connected accounts

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "type": {
      "enum": [
        "inflow",
        "outflow"
      ],
      "type": "string",
      "description": "Optional filter by transaction type: 'inflow' (income like payroll), 'outflow' (expenses like rent, subscriptions)"
    },
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
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
    "inflowStreams",
    "outflowStreams",
    "summary",
    "dataInstructions"
  ],
  "properties": {
    "summary": {
      "type": "object",
      "required": [
        "totalInflows",
        "totalOutflows"
      ],
      "properties": {
        "totalInflows": {
          "type": "number"
        },
        "totalOutflows": {
          "type": "number"
        }
      },
      "description": "Summary statistics. Expected: totalInflows (number), totalOutflows (number), estimatedMonthlyIncome (number), estimatedMonthlyExpenses (number). Additional fields may be added.",
      "additionalProperties": true
    },
    "inflowStreams": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "stream_id",
          "average_amount"
        ],
        "properties": {
          "stream_id": {
            "type": "string"
          },
          "average_amount": {
            "type": "number"
          }
        },
        "additionalProperties": true
      },
      "description": "Recurring income streams (payroll, deposits, etc.). Expected fields: stream_id (string), average_amount (number), account_id (string), description (string), merchant_name (string|null), frequency ('WEEKLY'|'BIWEEKLY'|'SEMI_MONTHLY'|'MONTHLY'|'ANNUALLY'|'UNKNOWN'), status (string), is_active (boolean), last_amount (number), first_date (YYYY-MM-DD), last_date (YYYY-MM-DD), predicted_next_date (string|null), transaction_count (number), category_primary (string|null), category_detailed (string|null), category_confidence ('VERY_HIGH'|'HIGH'|'MEDIUM'|'LOW'|'UNKNOWN'|null). Additional fields may be present."
    },
    "outflowStreams": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "stream_id",
          "average_amount"
        ],
        "properties": {
          "stream_id": {
            "type": "string"
          },
          "average_amount": {
            "type": "number"
          }
        },
        "additionalProperties": true
      },
      "description": "Recurring expense streams (subscriptions, bills, etc.). Expected fields: stream_id (string), average_amount (number), account_id (string), description (string), merchant_name (string|null), frequency ('WEEKLY'|'BIWEEKLY'|'SEMI_MONTHLY'|'MONTHLY'|'ANNUALLY'|'UNKNOWN'), status (string), is_active (boolean), last_amount (number), first_date (YYYY-MM-DD), last_date (YYYY-MM-DD), predicted_next_date (string|null), transaction_count (number), category_primary (string|null), category_detailed (string|null), category_confidence ('VERY_HIGH'|'HIGH'|'MEDIUM'|'LOW'|'UNKNOWN'|null). Additional fields may be present."
    },
    "dataInstructions": {
      "type": "string",
      "description": "Guidelines for analyzing recurring transaction data"
    }
  },
  "additionalProperties": false
}
```

### get-inbox

**Description:** Your inbox is a queue of actions you can take to improve your personal financial situation. If you're unsure what to do next, check your inbox. Returns the next step in your onboarding journey or active state recommendations. Call this tool when starting a session or after completing any financial action.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "options": {
      "type": "object",
      "properties": {},
      "description": "Additional options (reserved for future use)",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

### update-inbox

**Description:** Update, complete, dismiss, or snooze an inbox item. Use 'update' for generic updates (behavior defined by options), 'complete' when the user has finished the action, 'dismiss' to permanently hide an item they don't want to do, or 'snooze' to temporarily hide it for a number of days.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "item_id",
    "action"
  ],
  "properties": {
    "action": {
      "enum": [
        "update",
        "complete",
        "dismiss",
        "snooze"
      ],
      "type": "string",
      "description": "Action to take: update, complete, dismiss, or snooze"
    },
    "item_id": {
      "type": "string",
      "description": "ID of the inbox item to update"
    },
    "options": {
      "type": "object",
      "properties": {
        "snooze_days": {
          "type": "number",
          "maximum": 90,
          "minimum": 1,
          "description": "Number of days to snooze (default: 7, max: 90)"
        }
      },
      "description": "Additional options for update-inbox",
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

