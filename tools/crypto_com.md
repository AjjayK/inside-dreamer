# Tool Server: crypto.com

**ID:** 71732125-e582-4fee-87f5-929d471455e1

**Short Description:** Access data on crypto markets from Crypto.com

## Description

Quotes, trades & more from Crypto.com

## Tools (9)

### get_book

**Description:** Order book snapshot (bids/asks)

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetBookParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "depth": {
      "type": [
        "integer",
        "null"
      ]
    },
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "OrderBook",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name",
    "depth",
    "bids",
    "asks",
    "timestamp"
  ],
  "properties": {
    "asks": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/BookLevel"
      },
      "description": "Asks (asc)"
    },
    "bids": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/BookLevel"
      },
      "description": "Bids (desc)"
    },
    "depth": {
      "type": "integer",
      "description": "Depth returned (min(bids,asks))"
    },
    "timestamp": {
      "type": "string",
      "description": "Timestamp (ISO8601/RFC3339, UTC)"
    },
    "instrument_name": {
      "type": "string",
      "description": "Instrument name"
    }
  },
  "definitions": {
    "BookLevel": {
      "type": "object",
      "required": [
        "price",
        "qty"
      ],
      "properties": {
        "qty": {
          "type": "string",
          "description": "Quantity"
        },
        "price": {
          "type": "string",
          "description": "Price"
        }
      }
    }
  }
}
```

### get_ticker

**Description:** Single ticker for an instrument

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetTickerParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "Ticker",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "low": {
      "type": [
        "string",
        "null"
      ],
      "description": "Low price in 24h"
    },
    "high": {
      "type": [
        "string",
        "null"
      ],
      "description": "High price in 24h"
    },
    "last": {
      "type": [
        "string",
        "null"
      ],
      "description": "Last price"
    },
    "change": {
      "type": [
        "string",
        "null"
      ],
      "description": "Change from 24h ago"
    },
    "volume": {
      "type": [
        "string",
        "null"
      ],
      "description": "Total traded volume in 24h"
    },
    "best_ask": {
      "type": [
        "string",
        "null"
      ],
      "description": "Best ask"
    },
    "best_bid": {
      "type": [
        "string",
        "null"
      ],
      "description": "Best bid"
    },
    "timestamp": {
      "type": [
        "string",
        "null"
      ],
      "description": "Ticker timestamp (ISO8601/RFC3339, UTC)"
    },
    "volume_value": {
      "type": [
        "string",
        "null"
      ],
      "description": "Total traded volume in 24h in USD"
    },
    "best_ask_size": {
      "type": [
        "string",
        "null"
      ],
      "description": "Best ask size"
    },
    "best_bid_size": {
      "type": [
        "string",
        "null"
      ],
      "description": "Best bid size"
    },
    "open_interest": {
      "type": [
        "string",
        "null"
      ],
      "description": "Open interest"
    },
    "instrument_name": {
      "type": "string",
      "description": "Instrument name"
    }
  }
}
```

### get_instrument

**Description:** Instrument detail for an instrument by id

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetInstrumentParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "Instrument",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name",
    "inst_type",
    "display_name",
    "base_ccy",
    "quote_ccy",
    "quote_decimals",
    "quantity_decimals",
    "price_tick_size",
    "qty_tick_size",
    "max_leverage",
    "tradable"
  ],
  "properties": {
    "base_ccy": {
      "type": "string"
    },
    "tradable": {
      "type": "boolean"
    },
    "inst_type": {
      "type": "string"
    },
    "quote_ccy": {
      "type": "string"
    },
    "display_name": {
      "type": "string"
    },
    "max_leverage": {
      "type": "string"
    },
    "qty_tick_size": {
      "type": "string"
    },
    "quote_decimals": {
      "type": "integer"
    },
    "instrument_name": {
      "type": "string"
    },
    "price_tick_size": {
      "type": "string"
    },
    "expiry_timestamp": {
      "type": [
        "string",
        "null"
      ],
      "description": "Expiry timestamp (ISO8601/RFC3339, UTC)"
    },
    "quantity_decimals": {
      "type": "integer"
    },
    "underlying_symbol": {
      "type": [
        "string",
        "null"
      ]
    }
  }
}
```

### get_index_price

**Description:** Index price for an instrument

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetIndexPriceParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "IndexPrice",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name",
    "price",
    "timestamp"
  ],
  "properties": {
    "price": {
      "type": "string",
      "description": "Index price as string"
    },
    "timestamp": {
      "type": "string",
      "description": "Timestamp (ISO8601/RFC3339, UTC)"
    },
    "instrument_name": {
      "type": "string",
      "description": "Instrument name"
    }
  }
}
```

### get_mark_price

**Description:** Mark price for an instrument

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetMarkPriceParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "MarkPrice",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name",
    "price",
    "timestamp"
  ],
  "properties": {
    "price": {
      "type": "string",
      "description": "Mark price as string"
    },
    "timestamp": {
      "type": "string",
      "description": "Timestamp (ISO8601/RFC3339, UTC)"
    },
    "instrument_name": {
      "type": "string",
      "description": "Instrument name"
    }
  }
}
```

### get_trades

**Description:** Recent trades (default 10, max 150)

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetTradesParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name"
  ],
  "properties": {
    "count": {
      "type": [
        "integer",
        "null"
      ]
    },
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "TradesResult",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "data"
  ],
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Trade"
      }
    }
  },
  "definitions": {
    "Trade": {
      "type": "object",
      "required": [
        "instrument_name",
        "price",
        "qty",
        "side",
        "timestamp"
      ],
      "properties": {
        "qty": {
          "type": "string",
          "description": "Quantity"
        },
        "side": {
          "type": "string",
          "description": "Side: buy/sell"
        },
        "price": {
          "type": "string",
          "description": "Price"
        },
        "timestamp": {
          "type": "string",
          "description": "Timestamp (ISO8601/RFC3339, UTC)"
        },
        "instrument_name": {
          "type": "string",
          "description": "Instrument name"
        }
      }
    }
  }
}
```

### get_candlestick

**Description:** Recent candlesticks for an instrument and timeframe (returns up to 50)

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetCandlestickParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name",
    "timeframe"
  ],
  "properties": {
    "timeframe": {
      "type": "string"
    },
    "instrument_name": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "CandlesticksResult",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "instrument_name",
    "timeframe",
    "data"
  ],
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/CandleBar"
      }
    },
    "timeframe": {
      "type": "string"
    },
    "instrument_name": {
      "type": "string"
    }
  },
  "definitions": {
    "CandleBar": {
      "type": "object",
      "required": [
        "open",
        "high",
        "low",
        "close",
        "volume",
        "volume_usd",
        "timestamp"
      ],
      "properties": {
        "low": {
          "type": "string"
        },
        "high": {
          "type": "string"
        },
        "open": {
          "type": "string"
        },
        "close": {
          "type": "string"
        },
        "volume": {
          "type": "string"
        },
        "timestamp": {
          "type": "string",
          "description": "Bar start timestamp (ISO8601/RFC3339, UTC)"
        },
        "volume_usd": {
          "type": "string"
        }
      }
    }
  }
}
```

### get_instruments

**Description:** List all available trading instruments

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetInstrumentsParams",
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "InstrumentsResult",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "data"
  ],
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### get_tickers

**Description:** Tickers for an instrument or all

**Input Schema:**

```json
{
  "type": "object",
  "title": "PublicGetTickersParams",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "instrument_name": {
      "type": [
        "string",
        "null"
      ],
      "description": "Optional instrument name filter"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "title": "TickersResult",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "data"
  ],
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Ticker"
      }
    }
  },
  "definitions": {
    "Ticker": {
      "type": "object",
      "required": [
        "instrument_name"
      ],
      "properties": {
        "low": {
          "type": [
            "string",
            "null"
          ],
          "description": "Low price in 24h"
        },
        "high": {
          "type": [
            "string",
            "null"
          ],
          "description": "High price in 24h"
        },
        "last": {
          "type": [
            "string",
            "null"
          ],
          "description": "Last price"
        },
        "change": {
          "type": [
            "string",
            "null"
          ],
          "description": "Change from 24h ago"
        },
        "volume": {
          "type": [
            "string",
            "null"
          ],
          "description": "Total traded volume in 24h"
        },
        "best_ask": {
          "type": [
            "string",
            "null"
          ],
          "description": "Best ask"
        },
        "best_bid": {
          "type": [
            "string",
            "null"
          ],
          "description": "Best bid"
        },
        "timestamp": {
          "type": [
            "string",
            "null"
          ],
          "description": "Ticker timestamp (ISO8601/RFC3339, UTC)"
        },
        "volume_value": {
          "type": [
            "string",
            "null"
          ],
          "description": "Total traded volume in 24h in USD"
        },
        "best_ask_size": {
          "type": [
            "string",
            "null"
          ],
          "description": "Best ask size"
        },
        "best_bid_size": {
          "type": [
            "string",
            "null"
          ],
          "description": "Best bid size"
        },
        "open_interest": {
          "type": [
            "string",
            "null"
          ],
          "description": "Open interest"
        },
        "instrument_name": {
          "type": "string",
          "description": "Instrument name"
        }
      }
    }
  }
}
```

