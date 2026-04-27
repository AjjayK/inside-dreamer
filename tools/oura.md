# Tool Server: oura

**ID:** a70a53ed-b94f-4866-a156-eb118b8a761b

**Short Description:** Access your Oura Ring health and sleep data

## Description

Connect your Oura Ring to track sleep, activity, stress, and readiness data

## Tools (5)

### getStressAndResilience

**Description:** Get stress and resilience data for a specific date

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "dateParam": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format (defaults to today)"
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
    "date",
    "stress",
    "resilience"
  ],
  "properties": {
    "date": {
      "type": "string"
    },
    "stress": {
      "type": "object",
      "required": [
        "highStressSeconds",
        "recoverySeconds",
        "ratio"
      ],
      "properties": {
        "ratio": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "recoverySeconds": {
          "type": "number"
        },
        "highStressSeconds": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "resilience": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "level"
          ],
          "properties": {
            "level": {
              "type": "string"
            },
            "contributors": {
              "type": "object",
              "properties": {
                "stress": {
                  "type": "number"
                },
                "sleepRecovery": {
                  "type": "number"
                },
                "daytimeRecovery": {
                  "type": "number"
                }
              },
              "additionalProperties": false
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
```

### getReadiness

**Description:** Get readiness score and contributors for a specific date

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "dateParam": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format (defaults to today)"
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
    "score",
    "contributors",
    "limitingFactors",
    "timestamp"
  ],
  "properties": {
    "score": {
      "type": "number"
    },
    "timestamp": {
      "type": "string"
    },
    "contributors": {
      "type": "object",
      "required": [
        "hrvBalance",
        "bodyTemperature",
        "recoveryIndex",
        "restingHeartRate",
        "sleepBalance",
        "previousNight",
        "previousDayActivity",
        "activityBalance"
      ],
      "properties": {
        "hrvBalance": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "sleepBalance": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "previousNight": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "recoveryIndex": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "activityBalance": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "bodyTemperature": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "restingHeartRate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "previousDayActivity": {
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
    },
    "limitingFactors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false
}
```

### getSleepQuality

**Description:** Get sleep quality score and contributors for a specific date

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "dateParam": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format (defaults to today)"
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
    "score",
    "contributors",
    "limitingFactors",
    "durations",
    "timestamps"
  ],
  "properties": {
    "score": {
      "type": "number"
    },
    "durations": {
      "type": "object",
      "required": [
        "total",
        "deep",
        "rem",
        "light",
        "awake"
      ],
      "properties": {
        "rem": {
          "type": "number"
        },
        "deep": {
          "type": "number"
        },
        "awake": {
          "type": "number"
        },
        "light": {
          "type": "number"
        },
        "total": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "timestamps": {
      "type": "object",
      "required": [
        "bedtimeStart",
        "bedtimeEnd"
      ],
      "properties": {
        "bedtimeEnd": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "bedtimeStart": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "contributors": {
      "type": "object",
      "required": [
        "deepSleep",
        "remSleep",
        "efficiency",
        "latency",
        "restfulness",
        "timing",
        "totalSleep"
      ],
      "properties": {
        "timing": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "latency": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "remSleep": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "deepSleep": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "efficiency": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "totalSleep": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "restfulness": {
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
    },
    "limitingFactors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false
}
```

### getTrends

**Description:** Get health trends over specified number of days

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "days": {
      "type": "number",
      "description": "Number of days to analyze (default 7, min 3, max 30)"
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
    "readiness",
    "hrv",
    "bodyTemperature",
    "sleepScore",
    "period"
  ],
  "properties": {
    "hrv": {
      "type": "object",
      "required": [
        "values",
        "direction",
        "average",
        "changeVsBaseline"
      ],
      "properties": {
        "values": {
          "type": "array",
          "items": {
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
        "average": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "direction": {
          "enum": [
            "rising",
            "declining",
            "stable",
            "insufficient_data"
          ],
          "type": "string"
        },
        "changeVsBaseline": {
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
    },
    "period": {
      "type": "object",
      "required": [
        "days",
        "startDate",
        "endDate"
      ],
      "properties": {
        "days": {
          "type": "number"
        },
        "endDate": {
          "type": "string"
        },
        "startDate": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "readiness": {
      "type": "object",
      "required": [
        "values",
        "direction",
        "average",
        "changeVsBaseline"
      ],
      "properties": {
        "values": {
          "type": "array",
          "items": {
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
        "average": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "direction": {
          "enum": [
            "rising",
            "declining",
            "stable",
            "insufficient_data"
          ],
          "type": "string"
        },
        "changeVsBaseline": {
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
    },
    "sleepScore": {
      "type": "object",
      "required": [
        "values",
        "direction",
        "average",
        "changeVsBaseline"
      ],
      "properties": {
        "values": {
          "type": "array",
          "items": {
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
        "average": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "direction": {
          "enum": [
            "rising",
            "declining",
            "stable",
            "insufficient_data"
          ],
          "type": "string"
        },
        "changeVsBaseline": {
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
    },
    "bodyTemperature": {
      "type": "object",
      "required": [
        "values",
        "direction",
        "latest"
      ],
      "properties": {
        "latest": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "values": {
          "type": "array",
          "items": {
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
        "direction": {
          "enum": [
            "rising",
            "declining",
            "stable",
            "elevatedThenRecovering",
            "insufficient_data"
          ],
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### getHeartRate

**Description:** Get heart rate time-series data for a date range

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "startDate"
  ],
  "properties": {
    "endDate": {
      "type": "string",
      "description": "End date in YYYY-MM-DD format (defaults to start date, max 7 days from start)"
    },
    "startDate": {
      "type": "string",
      "description": "Start date in YYYY-MM-DD format"
    },
    "includeReadings": {
      "type": "boolean",
      "description": "Include individual readings (default false, returns only summary)"
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
    "summary",
    "period"
  ],
  "properties": {
    "period": {
      "type": "object",
      "required": [
        "startDate",
        "endDate"
      ],
      "properties": {
        "endDate": {
          "type": "string"
        },
        "startDate": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "summary": {
      "type": "object",
      "required": [
        "averageHeartRate",
        "minHeartRate",
        "maxHeartRate",
        "totalReadings"
      ],
      "properties": {
        "maxHeartRate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Maximum heart rate"
        },
        "minHeartRate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Minimum heart rate"
        },
        "totalReadings": {
          "type": "number",
          "description": "Total number of readings"
        },
        "averageHeartRate": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Average heart rate across all readings"
        }
      },
      "additionalProperties": false
    },
    "readings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "bpm",
          "source",
          "timestamp"
        ],
        "properties": {
          "bpm": {
            "type": "number",
            "description": "Heart rate in beats per minute"
          },
          "source": {
            "type": "string",
            "description": "Source of reading (e.g., 'awake', 'sleep', 'rest')"
          },
          "timestamp": {
            "type": "string",
            "description": "ISO 8601 timestamp of the reading"
          }
        },
        "additionalProperties": false
      },
      "description": "Individual heart rate readings (only included if includeReadings=true)"
    }
  },
  "additionalProperties": false
}
```

