# Tool Server: sheets

**ID:** b40ac29a-61ea-4499-a814-a643d8a14138

**Short Description:** Google Sheets as a lightweight store

## Description

Use Google Sheets as a store for data from your agents / Sidekick

## Tools (9)

### listAccounts

**Description:** List available Google accounts with Sheets access

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
              "gsheets"
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

### createSheet

**Description:** Create a new Google Sheet from CSV data.

This tool creates a new Google Sheet with the specified title and populates it with data from CSV format.
You can provide CSV data in two ways:
1. Inline CSV data using the 'csvData' parameter
2. Reference a Google Drive file containing CSV data using the 'csvDataFile' parameter (file ID)

You must provide exactly one of 'csvData' or 'csvDataFile'.

The CSV data should be properly formatted with commas separating columns and newlines separating rows.
Quoted values are supported for cells containing commas or quotes.

You can optionally specify a folder ID to create the spreadsheet in a specific folder.
If no folder ID is provided, the spreadsheet will be created in the root of My Drive.

Returns the spreadsheet ID and a web link to view the sheet.

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
      "description": "Google account email"
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

### createTable

**Description:** Create a new empty table (sheet tab) with specified columns in an existing spreadsheet. Use this to set up database-like tables with defined column structure. Example: tableName='users', columns=['id', 'name', 'email', 'created_at'] creates a new sheet with those headers.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId",
    "tableName",
    "columns"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "columns": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Column names for the table header row (e.g., ['id', 'name', 'email', 'created_at'])"
    },
    "tableName": {
      "type": "string",
      "description": "Name for the new sheet/table (e.g., 'users', 'transactions')"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL (e.g., '1ABC...')"
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
    "spreadsheetId",
    "sheetName",
    "sheetId",
    "columns",
    "createdAt"
  ],
  "properties": {
    "columns": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Column headers that were created"
    },
    "sheetId": {
      "type": "number",
      "description": "Internal sheet ID"
    },
    "success": {
      "type": "boolean"
    },
    "createdAt": {
      "type": "string"
    },
    "sheetName": {
      "type": "string",
      "description": "Name of the created sheet/table"
    },
    "spreadsheetId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getSheetMetadata

**Description:** Get spreadsheet info: title, URL, all sheet names/IDs, row/column counts

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL (returns info about all sheets/tabs)"
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
    "spreadsheet",
    "fetchedAt"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "spreadsheet": {
      "type": "object",
      "required": [
        "id",
        "title",
        "url",
        "sheets"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "url": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "sheets": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "name",
              "sheetId",
              "index",
              "rowCount",
              "columnCount"
            ],
            "properties": {
              "name": {
                "type": "string"
              },
              "index": {
                "type": "number"
              },
              "sheetId": {
                "type": "number"
              },
              "rowCount": {
                "type": "number"
              },
              "columnCount": {
                "type": "number"
              }
            },
            "additionalProperties": false
          }
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### getSheetData

**Description:** Read sheet data. Returns structured objects with first row as headers by default. Use returnFormat='raw' for 2D arrays (not recommended: cells with newlines will be incorrectly parsed).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId"
  ],
  "properties": {
    "range": {
      "type": [
        "string",
        "null"
      ],
      "description": "A1 notation range (optional, e.g., 'A1:D10' or 'Sheet1!A1:D10')"
    },
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "sheetName": {
      "type": [
        "string",
        "null"
      ],
      "description": "Sheet tab name (optional, defaults to first sheet)"
    },
    "returnFormat": {
      "enum": [
        "raw",
        "structured"
      ],
      "type": "string",
      "default": "structured",
      "description": "Format: 'structured' = objects with first row as headers (default, recommended), 'raw' = 2D string array (note: cells with newlines will be incorrectly split into multiple rows)"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL (e.g., '1ABC...')"
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
    "spreadsheetId",
    "sheetName",
    "data",
    "metadata",
    "fetchedAt"
  ],
  "properties": {
    "data": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      ],
      "description": "Sheet data in requested format"
    },
    "headers": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Column headers (if structured format)"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the operation succeeded"
    },
    "metadata": {
      "type": "object",
      "required": [
        "rowCount",
        "columnCount"
      ],
      "properties": {
        "rowCount": {
          "type": "number"
        },
        "columnCount": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "fetchedAt": {
      "type": "string"
    },
    "sheetName": {
      "type": "string"
    },
    "spreadsheetId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### updateRows

**Description:** Update specific columns in specific rows. IMPORTANT: This is a partial/selective update - only the columns you specify in the 'data' object will be changed, all other columns in the row remain unchanged. Use queryRows to find rows and get their rowIndex, then update specific fields. Example: {rowIndex: 2, data: {exchangeRate: '91'}} updates ONLY the exchangeRate column in row 2, leaving country, name, capital, etc. untouched.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId",
    "updates"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "updates": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "rowIndex",
          "data"
        ],
        "properties": {
          "data": {
            "type": "object",
            "description": "PARTIAL UPDATE: Only columns specified here will be changed. Example: {exchangeRate: '95.5'} updates only exchangeRate, leaving all other columns unchanged.",
            "additionalProperties": {
              "type": "string"
            }
          },
          "rowIndex": {
            "type": "number",
            "description": "1-based row index to update (row 1 is header, data starts at row 2)"
          }
        },
        "additionalProperties": false
      },
      "description": "Array of row updates, each with rowIndex and data object with columns to update"
    },
    "sheetName": {
      "type": [
        "string",
        "null"
      ],
      "description": "Sheet tab name (optional, defaults to first sheet)"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL (e.g., '1ABC...')"
    },
    "valueInputOption": {
      "enum": [
        "literal",
        "automatic"
      ],
      "type": "string",
      "description": "How to interpret input values: 'literal' = store exactly as text, 'automatic' = parse formulas (must start with '=', e.g. '=SUM(A1:A10)' or '=SQRT(144)') and convert dates (e.g. '1/1/2024') automatically (default: 'automatic')"
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
    "spreadsheetId",
    "sheetName",
    "updatedRows",
    "updatedAt"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "sheetName": {
      "type": "string"
    },
    "updatedAt": {
      "type": "string"
    },
    "updatedRows": {
      "type": "number"
    },
    "spreadsheetId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### appendRows

**Description:** Append rows to sheet end. Pass rows as [['a','b']] or [{col1:'a',col2:'b'}] - objects match first row headers

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId",
    "rows"
  ],
  "properties": {
    "rows": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      ],
      "description": "Rows: [['a','b']] OR [{col1:'a', col2:'b'}] - objects use first row headers"
    },
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "sheetName": {
      "type": [
        "string",
        "null"
      ],
      "description": "Sheet tab name (optional, defaults to first sheet)"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL"
    },
    "valueInputOption": {
      "enum": [
        "literal",
        "automatic"
      ],
      "type": "string",
      "description": "How to interpret input values: 'literal' = store exactly as text, 'automatic' = parse formulas (must start with '=', e.g. '=SUM(A1:A10)' or '=SQRT(144)') and convert dates (e.g. '1/1/2024') automatically (default: 'automatic')"
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
    "spreadsheetId",
    "sheetName",
    "appendedRows",
    "updatedRange",
    "updatedAt"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "sheetName": {
      "type": "string"
    },
    "updatedAt": {
      "type": "string"
    },
    "appendedRows": {
      "type": "number"
    },
    "updatedRange": {
      "type": "string"
    },
    "spreadsheetId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### queryRows

**Description:** Query and filter rows from a Google Sheet. Returns matched rows with their row indices (1-based, where row 1 is header). Filter must be an object with column (header name), operator (equals/contains/startsWith/greaterThan/lessThan), and value (string). Use rowIndex from results with deleteRows to remove specific rows.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId",
    "filter"
  ],
  "properties": {
    "limit": {
      "type": [
        "number",
        "null"
      ],
      "description": "Max rows to return"
    },
    "filter": {
      "type": "object",
      "required": [
        "column",
        "operator",
        "value"
      ],
      "properties": {
        "value": {
          "type": "string",
          "description": "Value to compare against (string, even for numbers)"
        },
        "column": {
          "type": "string",
          "description": "Column header name from first row (e.g., 'country', 'exchangeRate')"
        },
        "operator": {
          "enum": [
            "equals",
            "contains",
            "startsWith",
            "greaterThan",
            "lessThan"
          ],
          "type": "string",
          "description": "Comparison operator: equals|contains|startsWith|greaterThan|lessThan"
        }
      },
      "description": "Filter criteria object: {column: string, operator: string, value: string}",
      "additionalProperties": false
    },
    "offset": {
      "type": [
        "number",
        "null"
      ],
      "description": "Rows to skip before returning results"
    },
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "sheetName": {
      "type": [
        "string",
        "null"
      ],
      "description": "Sheet tab name (defaults to first sheet)"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL"
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
    "spreadsheetId",
    "sheetName",
    "headers",
    "matchedRows",
    "totalMatched",
    "fetchedAt"
  ],
  "properties": {
    "headers": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "sheetName": {
      "type": "string"
    },
    "matchedRows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "rowIndex",
          "data"
        ],
        "properties": {
          "data": {
            "type": "object",
            "description": "Row data as key-value pairs",
            "additionalProperties": {
              "type": "string"
            }
          },
          "rowIndex": {
            "type": "number",
            "description": "1-based row index in the sheet (row 1 is header)"
          }
        },
        "additionalProperties": false
      }
    },
    "totalMatched": {
      "type": "number"
    },
    "spreadsheetId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### deleteRows

**Description:** Delete rows from a sheet by row index range. Uses 1-based indexing where row 1 is the header. Example: startRow=2, endRow=5 deletes rows 2-5 (4 rows total). To delete specific rows matching criteria: (1) Use queryRows to find matching rows and get their rowIndex values, (2) Use those rowIndex values with deleteRows. Note: When deleting multiple non-contiguous rows, delete from highest index to lowest to avoid index shifts.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "spreadsheetId",
    "startRow",
    "endRow"
  ],
  "properties": {
    "endRow": {
      "type": "number",
      "description": "End row index (1-based, inclusive). Must be >= startRow."
    },
    "account": {
      "type": "string",
      "description": "Google account email"
    },
    "startRow": {
      "type": "number",
      "description": "Start row index (1-based, inclusive). Row 1 is the header row."
    },
    "sheetName": {
      "type": [
        "string",
        "null"
      ],
      "description": "Sheet tab name (optional, defaults to first sheet)"
    },
    "spreadsheetId": {
      "type": "string",
      "description": "Spreadsheet ID from URL (e.g., '1ABC...')"
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
    "spreadsheetId",
    "sheetName",
    "deletedRows",
    "deletedAt"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "deletedAt": {
      "type": "string"
    },
    "sheetName": {
      "type": "string"
    },
    "deletedRows": {
      "type": "number"
    },
    "spreadsheetId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

