# Tool Server: polygon

**ID:** 42e429a4-fca2-4fab-b1a2-92987178d7f9

**Short Description:** Financial market data

## Description

Market data, for US Stocks, including news

## Tools (9)

### get_aggs

**Description:** Get aggregate bars (OHLC) for a stock ticker over a given date range in custom time window sizes. Use this to get historical price data.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ticker",
    "multiplier",
    "timespan",
    "from",
    "to"
  ],
  "properties": {
    "to": {
      "type": "string",
      "description": "The end date in YYYY-MM-DD format or Unix timestamp"
    },
    "from": {
      "type": "string",
      "description": "The start date in YYYY-MM-DD format or Unix timestamp"
    },
    "sort": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Sort the results by timestamp (default: asc)"
    },
    "limit": {
      "type": "integer",
      "maximum": 50000,
      "description": "Limits the number of base aggregates queried (max 50000)",
      "exclusiveMinimum": 0
    },
    "ticker": {
      "type": "string",
      "description": "The ticker symbol to get aggregates for (e.g., AAPL, MSFT, BTC-USD)"
    },
    "adjusted": {
      "type": "boolean",
      "description": "Whether or not the results are adjusted for splits (default: true)"
    },
    "timespan": {
      "enum": [
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "quarter",
        "year"
      ],
      "type": "string",
      "description": "The size of the time window"
    },
    "multiplier": {
      "type": "integer",
      "maximum": 9007199254740991,
      "description": "The size of the timespan multiplier (e.g., 1 for 1 day, 5 for 5 minutes)",
      "exclusiveMinimum": 0
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
      "type": "string"
    },
    "ticker": {
      "type": "string"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "c": {
            "type": "number",
            "description": "Closing price"
          },
          "h": {
            "type": "number",
            "description": "Highest price"
          },
          "l": {
            "type": "number",
            "description": "Lowest price"
          },
          "n": {
            "type": "number",
            "description": "Number of transactions in the aggregate"
          },
          "o": {
            "type": "number",
            "description": "Opening price"
          },
          "t": {
            "type": "number",
            "description": "Unix timestamp in milliseconds"
          },
          "v": {
            "type": "number",
            "description": "Trading volume"
          },
          "vw": {
            "type": "number",
            "description": "Volume weighted average price (VWAP)"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "adjusted": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "queryCount": {
      "type": "number"
    },
    "resultsCount": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### get_previous_close_agg

**Description:** Get the previous day's open, high, low, and close (OHLC) for a ticker.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ticker"
  ],
  "properties": {
    "ticker": {
      "type": "string",
      "description": "The ticker symbol (e.g., AAPL, MSFT)"
    },
    "adjusted": {
      "type": "boolean",
      "description": "Whether results are adjusted for splits (default: true)"
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
      "type": "string"
    },
    "ticker": {
      "type": "string"
    },
    "results": {
      "type": "object",
      "properties": {
        "T": {
          "type": "string",
          "description": "Ticker symbol"
        },
        "c": {
          "type": "number",
          "description": "Closing price"
        },
        "h": {
          "type": "number",
          "description": "Highest price"
        },
        "l": {
          "type": "number",
          "description": "Lowest price"
        },
        "n": {
          "type": "number",
          "description": "Number of transactions in the aggregate"
        },
        "o": {
          "type": "number",
          "description": "Opening price"
        },
        "t": {
          "type": "number",
          "description": "Unix timestamp in milliseconds"
        },
        "v": {
          "type": "number",
          "description": "Trading volume"
        },
        "vw": {
          "type": "number",
          "description": "Volume weighted average price (VWAP)"
        },
        "otc": {
          "type": "boolean",
          "description": "Whether this result is for an OTC ticker"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get_market_status

**Description:** Get the current trading status of the exchanges and overall financial markets. Returns whether markets are open or closed.

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
    "success",
    "fetchedAt"
  ],
  "properties": {
    "error": {
      "type": "string"
    },
    "market": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "exchanges": {
      "description": "Market status for each exchange"
    },
    "fetchedAt": {
      "type": "string"
    },
    "currencies": {
      "description": "Market status for each currency"
    },
    "serverTime": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get_market_holidays

**Description:** Get upcoming market holidays and their dates.

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
    "success",
    "fetchedAt"
  ],
  "properties": {
    "error": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "holidays": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "description": "Holiday date in YYYY-MM-DD format"
          },
          "name": {
            "type": "string",
            "description": "Holiday name"
          },
          "open": {
            "type": "string",
            "description": "Market open time if applicable"
          },
          "close": {
            "type": "string",
            "description": "Market close time if applicable"
          },
          "status": {
            "type": "string",
            "description": "Market status on this day"
          }
        },
        "additionalProperties": false
      }
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get_ticker_details

**Description:** Get detailed information about a ticker including company name, market cap, description, and other reference data.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ticker"
  ],
  "properties": {
    "ticker": {
      "type": "string",
      "description": "The ticker symbol (e.g., AAPL, MSFT, TSLA)"
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
      "type": "string"
    },
    "results": {
      "type": "object",
      "properties": {
        "cik": {
          "type": "string",
          "description": "CIK number (SEC identifier)"
        },
        "name": {
          "type": "string",
          "description": "Company/asset name"
        },
        "type": {
          "type": "string",
          "description": "Security type (CS, ETF, etc.)"
        },
        "active": {
          "type": "boolean",
          "description": "Whether the ticker is actively traded"
        },
        "locale": {
          "type": "string",
          "description": "Locale/region"
        },
        "market": {
          "type": "string",
          "description": "Market type (stocks, crypto, fx, etc.)"
        },
        "ticker": {
          "type": "string",
          "description": "Ticker symbol"
        },
        "address": {
          "description": "Company address object"
        },
        "branding": {
          "description": "Branding information (logo, colors, etc.)"
        },
        "sic_code": {
          "type": "string",
          "description": "SIC code"
        },
        "list_date": {
          "type": "string",
          "description": "Listing date in YYYY-MM-DD format"
        },
        "round_lot": {
          "type": "number",
          "description": "Round lot size (standard trading unit)"
        },
        "market_cap": {
          "type": "number",
          "description": "Market capitalization"
        },
        "description": {
          "type": "string",
          "description": "Company/asset description"
        },
        "ticker_root": {
          "type": "string",
          "description": "Root ticker symbol"
        },
        "delisted_utc": {
          "type": "string",
          "description": "Last date the asset was traded"
        },
        "homepage_url": {
          "type": "string",
          "description": "Company homepage URL"
        },
        "phone_number": {
          "type": "string",
          "description": "Company phone number"
        },
        "currency_name": {
          "type": "string",
          "description": "Currency name"
        },
        "ticker_suffix": {
          "type": "string",
          "description": "Ticker suffix (e.g., 'A' in BRK.A)"
        },
        "composite_figi": {
          "type": "string",
          "description": "Composite FIGI identifier"
        },
        "sic_description": {
          "type": "string",
          "description": "SIC description"
        },
        "total_employees": {
          "type": "number",
          "description": "Total number of employees"
        },
        "primary_exchange": {
          "type": "string",
          "description": "Primary exchange code (MIC)"
        },
        "share_class_figi": {
          "type": "string",
          "description": "Share class FIGI identifier"
        },
        "weighted_shares_outstanding": {
          "type": "number",
          "description": "Weighted shares outstanding"
        },
        "share_class_shares_outstanding": {
          "type": "number",
          "description": "Shares outstanding"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get_snapshot_ticker

**Description:** Get the current minute snapshot for a specific ticker symbol, including latest trade, quote, and aggregate data.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ticker"
  ],
  "properties": {
    "ticker": {
      "type": "string",
      "description": "The ticker symbol to get snapshot for (e.g., AAPL, MSFT, BTC-USD, X:BTCUSD)"
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
    "day": {
      "type": "object",
      "properties": {
        "c": {
          "type": "number",
          "description": "Closing price"
        },
        "h": {
          "type": "number",
          "description": "Highest price"
        },
        "l": {
          "type": "number",
          "description": "Lowest price"
        },
        "n": {
          "type": "number",
          "description": "Number of transactions in the aggregate"
        },
        "o": {
          "type": "number",
          "description": "Opening price"
        },
        "t": {
          "type": "number",
          "description": "Unix timestamp in milliseconds"
        },
        "v": {
          "type": "number",
          "description": "Trading volume"
        },
        "vw": {
          "type": "number",
          "description": "Volume weighted average price (VWAP)"
        }
      },
      "description": "Current day's OHLCV data",
      "additionalProperties": false
    },
    "min": {
      "type": "object",
      "properties": {
        "c": {
          "type": "number",
          "description": "Closing price"
        },
        "h": {
          "type": "number",
          "description": "Highest price"
        },
        "l": {
          "type": "number",
          "description": "Lowest price"
        },
        "n": {
          "type": "number",
          "description": "Number of transactions in the aggregate"
        },
        "o": {
          "type": "number",
          "description": "Opening price"
        },
        "t": {
          "type": "number",
          "description": "Unix timestamp in milliseconds"
        },
        "v": {
          "type": "number",
          "description": "Trading volume"
        },
        "vw": {
          "type": "number",
          "description": "Volume weighted average price (VWAP)"
        }
      },
      "description": "Latest minute bar OHLCV data",
      "additionalProperties": false
    },
    "error": {
      "type": "string"
    },
    "ticker": {
      "type": "string",
      "description": "The ticker symbol"
    },
    "prevDay": {
      "type": "object",
      "properties": {
        "c": {
          "type": "number",
          "description": "Closing price"
        },
        "h": {
          "type": "number",
          "description": "Highest price"
        },
        "l": {
          "type": "number",
          "description": "Lowest price"
        },
        "n": {
          "type": "number",
          "description": "Number of transactions in the aggregate"
        },
        "o": {
          "type": "number",
          "description": "Opening price"
        },
        "t": {
          "type": "number",
          "description": "Unix timestamp in milliseconds"
        },
        "v": {
          "type": "number",
          "description": "Trading volume"
        },
        "vw": {
          "type": "number",
          "description": "Volume weighted average price (VWAP)"
        }
      },
      "description": "Previous trading day's OHLCV data",
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    },
    "updated": {
      "type": "number",
      "description": "Unix timestamp of last update"
    },
    "fetchedAt": {
      "type": "string"
    },
    "todaysChange": {
      "type": "number",
      "description": "Today's absolute price change"
    },
    "todaysChangePerc": {
      "type": "number",
      "description": "Today's percent price change"
    }
  },
  "additionalProperties": false
}
```

### get_snapshot_direction

**Description:** Get the top gainers or losers in the stock market. Useful for finding trending stocks.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "direction"
  ],
  "properties": {
    "direction": {
      "enum": [
        "gainers",
        "losers"
      ],
      "type": "string",
      "description": "Get top gainers or losers"
    },
    "include_otc": {
      "type": "boolean",
      "description": "Include OTC securities in results (default: false)"
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
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "tickers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day": {
            "type": "object",
            "properties": {
              "c": {
                "type": "number",
                "description": "Closing price"
              },
              "h": {
                "type": "number",
                "description": "Highest price"
              },
              "l": {
                "type": "number",
                "description": "Lowest price"
              },
              "n": {
                "type": "number",
                "description": "Number of transactions in the aggregate"
              },
              "o": {
                "type": "number",
                "description": "Opening price"
              },
              "t": {
                "type": "number",
                "description": "Unix timestamp in milliseconds"
              },
              "v": {
                "type": "number",
                "description": "Trading volume"
              },
              "vw": {
                "type": "number",
                "description": "Volume weighted average price (VWAP)"
              }
            },
            "description": "Current day's OHLCV data",
            "additionalProperties": false
          },
          "min": {
            "type": "object",
            "properties": {
              "c": {
                "type": "number",
                "description": "Closing price"
              },
              "h": {
                "type": "number",
                "description": "Highest price"
              },
              "l": {
                "type": "number",
                "description": "Lowest price"
              },
              "n": {
                "type": "number",
                "description": "Number of transactions in the aggregate"
              },
              "o": {
                "type": "number",
                "description": "Opening price"
              },
              "t": {
                "type": "number",
                "description": "Unix timestamp in milliseconds"
              },
              "v": {
                "type": "number",
                "description": "Trading volume"
              },
              "vw": {
                "type": "number",
                "description": "Volume weighted average price (VWAP)"
              }
            },
            "description": "Latest minute bar OHLCV data",
            "additionalProperties": false
          },
          "ticker": {
            "type": "string",
            "description": "The ticker symbol"
          },
          "prevDay": {
            "type": "object",
            "properties": {
              "c": {
                "type": "number",
                "description": "Closing price"
              },
              "h": {
                "type": "number",
                "description": "Highest price"
              },
              "l": {
                "type": "number",
                "description": "Lowest price"
              },
              "n": {
                "type": "number",
                "description": "Number of transactions in the aggregate"
              },
              "o": {
                "type": "number",
                "description": "Opening price"
              },
              "t": {
                "type": "number",
                "description": "Unix timestamp in milliseconds"
              },
              "v": {
                "type": "number",
                "description": "Trading volume"
              },
              "vw": {
                "type": "number",
                "description": "Volume weighted average price (VWAP)"
              }
            },
            "description": "Previous trading day's OHLCV data",
            "additionalProperties": false
          },
          "updated": {
            "type": "number",
            "description": "Unix timestamp of last update"
          },
          "todaysChange": {
            "type": "number",
            "description": "Today's absolute price change"
          },
          "todaysChangePerc": {
            "type": "number",
            "description": "Today's percent price change"
          }
        },
        "description": "Snapshot of current ticker data including price, volume, and change information",
        "additionalProperties": false
      },
      "description": "Array of ticker snapshots with price data, change percentages, and volume information"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### list_ticker_news

**Description:** Get recent news articles related to a stock ticker or general market news. Returns article title, description, publisher, and URL.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 1000,
      "description": "Limit the number of results (default: 10, max: 1000)",
      "exclusiveMinimum": 0
    },
    "order": {
      "enum": [
        "asc",
        "desc"
      ],
      "type": "string",
      "description": "Order of results by published date (default: desc)"
    },
    "ticker": {
      "type": "string",
      "description": "Ticker symbol to get news for (e.g., AAPL). Leave empty for general market news"
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
    "count": {
      "type": "number"
    },
    "error": {
      "type": "string"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "author": {
            "type": "string"
          },
          "amp_url": {
            "type": "string"
          },
          "tickers": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "image_url": {
            "type": "string"
          },
          "publisher": {},
          "article_url": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "published_utc": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### list_tickers

**Description:** Search and query for stock ticker symbols. Use this to find ticker symbols by company name or to discover available tickers.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "type": {
      "type": "string",
      "description": "Filter by ticker type (e.g., CS for Common Stock, ETF, etc.)"
    },
    "limit": {
      "type": "integer",
      "maximum": 1000,
      "description": "Limit results (default: 100, max: 1000)",
      "exclusiveMinimum": 0
    },
    "active": {
      "type": "boolean",
      "description": "Filter for only active tickers (default: true)"
    },
    "market": {
      "enum": [
        "stocks",
        "crypto",
        "fx",
        "otc",
        "indices"
      ],
      "type": "string",
      "description": "Filter by market type"
    },
    "search": {
      "type": "string",
      "description": "Search for tickers by company name or symbol (e.g., 'Apple', 'Microsoft', 'AAPL')"
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
    "count": {
      "type": "number"
    },
    "error": {
      "type": "string"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "cik": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "active": {
            "type": "boolean"
          },
          "locale": {
            "type": "string"
          },
          "market": {
            "type": "string"
          },
          "ticker": {
            "type": "string"
          },
          "currency_name": {
            "type": "string"
          },
          "composite_figi": {
            "type": "string"
          },
          "last_updated_utc": {
            "type": "string"
          },
          "primary_exchange": {
            "type": "string"
          },
          "share_class_figi": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

