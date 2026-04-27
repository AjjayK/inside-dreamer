# Tool Server: calendar

**ID:** 4616961e-6150-41d5-b7bf-43cf4ae83d74

**Short Description:** Access and create Google Calendar events

## Description

Access and create Google Calendar events with any connected google calendar account.

## Tools (10)

### listAccounts

**Description:** Get calendar accounts available on this tool for this user.

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
              "gcal"
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

### listCalendars

**Description:** List all calendars for a given account.

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
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
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
    "calendars"
  ],
  "properties": {
    "calendars": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "summary"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "primary": {
            "type": "boolean"
          },
          "summary": {
            "type": "string"
          },
          "selected": {
            "type": "boolean"
          },
          "timeZone": {
            "type": "string"
          },
          "accessRole": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "backgroundColor": {
            "type": "string"
          },
          "foregroundColor": {
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

### createCalendar

**Description:** Create a new calendar.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "summary"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "summary": {
      "type": "string",
      "description": "Calendar name/title"
    },
    "location": {
      "type": "string"
    },
    "timeZone": {
      "type": "string",
      "description": "IANA timezone name (e.g., 'America/New_York', 'Europe/London')"
    },
    "description": {
      "type": "string"
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
    "calendar"
  ],
  "properties": {
    "calendar": {
      "type": "object",
      "required": [
        "id",
        "summary"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "timeZone": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### updateCalendar

**Description:** Update an existing calendar's settings.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "calendarId"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "summary": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "timeZone": {
      "type": "string",
      "description": "IANA timezone name (e.g., 'America/New_York', 'Europe/London')"
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars"
    },
    "description": {
      "type": "string"
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
    "calendar"
  ],
  "properties": {
    "calendar": {
      "type": "object",
      "required": [
        "id",
        "summary"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "timeZone": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### getEventsForDay

**Description:** Get all events for a specific calendar day in YYYY-MM-DD format. This tool automatically handles timezone conversion using the user's configured timezone, eliminating the need for complex timezone math. STRONGLY PREFERRED over getUpcomingEvents when you want all events for a specific day.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "day"
  ],
  "properties": {
    "day": {
      "type": "string",
      "description": "The calendar day to get events for in YYYY-MM-DD format (e.g., '2025-11-04'). This tool automatically handles timezone conversion using the user's configured timezone, so you NEVER need to worry about timezone math. STRONGLY PREFERRED over getUpcomingEvents when you want all events for a specific day."
    },
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Pagination token from previous response's nextPageToken field. Only provide this if you need MORE results beyond what maxResults returned. If maxResults gave you enough events, do NOT fetch additional pages."
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars. If omitted, uses the user's primary calendar. Use 'primary' explicitly for primary calendar."
    },
    "maxResults": {
      "type": "number",
      "description": "Maximum number of events to return (default 250, reasonable range 1-250)"
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
    "events",
    "nextPageToken",
    "day",
    "timezone"
  ],
  "properties": {
    "day": {
      "type": "string",
      "description": "The day that was queried (YYYY-MM-DD)"
    },
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "summary",
          "start",
          "end",
          "startTimeLocal",
          "endTimeLocal",
          "isAllDay",
          "location",
          "htmlLink",
          "status",
          "eventType",
          "organizer",
          "description",
          "attendees",
          "attachments",
          "hangoutLink",
          "conferenceData"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "end": {
            "type": "string",
            "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T15:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
          },
          "start": {
            "type": "string",
            "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T14:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
          },
          "status": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "summary": {
            "type": "string"
          },
          "htmlLink": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "isAllDay": {
            "type": "boolean",
            "description": "true if this is an all-day event (no specific times), false if it has specific start/end times"
          },
          "location": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "attendees": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "email",
                    "displayName",
                    "responseStatus",
                    "organizer"
                  ],
                  "properties": {
                    "email": {
                      "type": "string"
                    },
                    "organizer": {
                      "anyOf": [
                        {
                          "type": "boolean"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "displayName": {
                      "anyOf": [
                        {
                          "type": "string"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "responseStatus": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              },
              {
                "type": "null"
              }
            ]
          },
          "eventType": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "organizer": {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "email",
                  "displayName"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "displayName": {
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
              {
                "type": "null"
              }
            ]
          },
          "attachments": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "fileId",
                    "fileUrl",
                    "iconLink",
                    "mimeType",
                    "title"
                  ],
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "fileId": {
                      "type": "string"
                    },
                    "fileUrl": {
                      "type": "string"
                    },
                    "iconLink": {
                      "type": "string"
                    },
                    "mimeType": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              },
              {
                "type": "null"
              }
            ]
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "hangoutLink": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Google Meet link for the event (if available)"
          },
          "endTimeLocal": {
            "type": "string",
            "description": "Human-readable end time in user's local timezone (e.g., '3:30 PM', '12:00 PM') or 'All day' for all-day events. Use this for displaying times to users - no timezone math required!"
          },
          "conferenceData": {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "entryPoints",
                  "conferenceSolution",
                  "conferenceId",
                  "signature"
                ],
                "properties": {
                  "signature": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "entryPoints": {
                    "anyOf": [
                      {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "required": [
                            "entryPointType",
                            "uri",
                            "label",
                            "meetingCode",
                            "passcode",
                            "password",
                            "pin"
                          ],
                          "properties": {
                            "pin": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "uri": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "label": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "passcode": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "password": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "meetingCode": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "entryPointType": {
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
                        }
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "conferenceId": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "conferenceSolution": {
                    "anyOf": [
                      {
                        "type": "object",
                        "required": [
                          "name",
                          "iconUri"
                        ],
                        "properties": {
                          "name": {
                            "anyOf": [
                              {
                                "type": "string"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "iconUri": {
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
                      {
                        "type": "null"
                      }
                    ]
                  }
                },
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ],
            "description": "Detailed conference/meeting information including Google Meet, Zoom, etc."
          },
          "startTimeLocal": {
            "type": "string",
            "description": "Human-readable start time in user's local timezone (e.g., '2:30 PM', '11:00 AM') or 'All day' for all-day events. Use this for displaying times to users - no timezone math required!"
          }
        },
        "additionalProperties": false
      }
    },
    "timezone": {
      "type": "string",
      "description": "The user's timezone that was used for the query"
    },
    "nextPageToken": {
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
}
```

### getUpcomingEvents

**Description:** Get upcoming calendar events with pagination support.

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
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "endDate": {
      "type": "string",
      "description": "RFC3339 formatted timestamp. Returns events that start BEFORE this time (i.e., excludes events starting at or after this point). Together with startDate, these filters return all events overlapping the time window. MUST include timezone offset matching the user's local timezone (e.g., '2024-01-20T00:00:00-05:00')."
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Pagination token from previous response's nextPageToken field. Only provide this if you need MORE results beyond what maxResults returned. If maxResults gave you enough events, do NOT fetch additional pages."
    },
    "startDate": {
      "type": "string",
      "description": "RFC3339 formatted timestamp. Returns events that end AFTER this time (i.e., excludes events already finished before this point). MUST include timezone offset matching the user's local timezone, not UTC (e.g., '2024-01-15T00:00:00-05:00' for midnight Eastern Time, NOT '2024-01-15T00:00:00Z'). To get events for a specific day, use getEventsForDay instead which handles timezone math automatically."
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars. If omitted, uses the user's primary calendar. Use 'primary' explicitly for primary calendar."
    },
    "maxResults": {
      "type": "number",
      "description": "Maximum number of events to return (default 10, reasonable range 1-250)"
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
    "events",
    "nextPageToken"
  ],
  "properties": {
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "summary",
          "start",
          "end",
          "location",
          "htmlLink",
          "status",
          "eventType",
          "organizer",
          "description",
          "attendees",
          "attachments",
          "hangoutLink",
          "conferenceData"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "end": {
            "type": "string",
            "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T15:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
          },
          "start": {
            "type": "string",
            "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T14:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
          },
          "status": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "summary": {
            "type": "string"
          },
          "htmlLink": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "location": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "attendees": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "email",
                    "displayName",
                    "responseStatus",
                    "organizer"
                  ],
                  "properties": {
                    "email": {
                      "type": "string"
                    },
                    "organizer": {
                      "anyOf": [
                        {
                          "type": "boolean"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "displayName": {
                      "anyOf": [
                        {
                          "type": "string"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "responseStatus": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              },
              {
                "type": "null"
              }
            ]
          },
          "eventType": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "organizer": {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "email",
                  "displayName"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "displayName": {
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
              {
                "type": "null"
              }
            ]
          },
          "attachments": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "fileId",
                    "fileUrl",
                    "iconLink",
                    "mimeType",
                    "title"
                  ],
                  "properties": {
                    "title": {
                      "type": "string"
                    },
                    "fileId": {
                      "type": "string"
                    },
                    "fileUrl": {
                      "type": "string"
                    },
                    "iconLink": {
                      "type": "string"
                    },
                    "mimeType": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              },
              {
                "type": "null"
              }
            ]
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "hangoutLink": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Google Meet link for the event (if available)"
          },
          "conferenceData": {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "entryPoints",
                  "conferenceSolution",
                  "conferenceId",
                  "signature"
                ],
                "properties": {
                  "signature": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "entryPoints": {
                    "anyOf": [
                      {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "required": [
                            "entryPointType",
                            "uri",
                            "label",
                            "meetingCode",
                            "passcode",
                            "password",
                            "pin"
                          ],
                          "properties": {
                            "pin": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "uri": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "label": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "passcode": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "password": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "meetingCode": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "entryPointType": {
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
                        }
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "conferenceId": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "conferenceSolution": {
                    "anyOf": [
                      {
                        "type": "object",
                        "required": [
                          "name",
                          "iconUri"
                        ],
                        "properties": {
                          "name": {
                            "anyOf": [
                              {
                                "type": "string"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "iconUri": {
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
                      {
                        "type": "null"
                      }
                    ]
                  }
                },
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ],
            "description": "Detailed conference/meeting information including Google Meet, Zoom, etc."
          }
        },
        "additionalProperties": false
      }
    },
    "nextPageToken": {
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
}
```

### searchEvents

**Description:** Search calendar events

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "Free text search query to find events. Searches event titles, descriptions, locations, and attendee names."
    },
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "endDate": {
      "type": "string",
      "description": "RFC3339 formatted timestamp. Returns events that start BEFORE this time (i.e., excludes events starting at or after this point). Together with startDate, these filters return all events overlapping the time window. MUST include timezone offset matching the user's local timezone (e.g., '2024-01-20T00:00:00-05:00')."
    },
    "pageToken": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Pagination token from previous response's nextPageToken field. Only provide this if you need MORE results beyond what maxResults returned. If maxResults gave you enough events, do NOT fetch additional pages."
    },
    "startDate": {
      "type": "string",
      "description": "RFC3339 formatted timestamp. Returns events that end AFTER this time (i.e., excludes events already finished before this point). MUST include timezone offset matching the user's local timezone, not UTC (e.g., '2024-01-15T00:00:00-05:00' for midnight Eastern Time, NOT '2024-01-15T00:00:00Z')."
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars. If omitted, uses the user's primary calendar. Use 'primary' explicitly for primary calendar."
    },
    "maxResults": {
      "type": "number",
      "description": "Maximum number of events to return (default 10, reasonable range 1-250)"
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
    "events",
    "nextPageToken"
  ],
  "properties": {
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "summary",
          "start",
          "end",
          "description",
          "organizer",
          "attendees",
          "hangoutLink",
          "conferenceData"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "end": {
            "type": "string",
            "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T15:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
          },
          "start": {
            "type": "string",
            "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T14:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
          },
          "summary": {
            "type": "string"
          },
          "attendees": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "email",
                    "displayName",
                    "responseStatus",
                    "organizer"
                  ],
                  "properties": {
                    "email": {
                      "type": "string"
                    },
                    "organizer": {
                      "anyOf": [
                        {
                          "type": "boolean"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "displayName": {
                      "anyOf": [
                        {
                          "type": "string"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "responseStatus": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              },
              {
                "type": "null"
              }
            ]
          },
          "organizer": {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "email",
                  "displayName"
                ],
                "properties": {
                  "email": {
                    "type": "string"
                  },
                  "displayName": {
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
              {
                "type": "null"
              }
            ]
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "hangoutLink": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Google Meet link for the event (if available)"
          },
          "conferenceData": {
            "anyOf": [
              {
                "type": "object",
                "required": [
                  "entryPoints",
                  "conferenceSolution",
                  "conferenceId",
                  "signature"
                ],
                "properties": {
                  "signature": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "entryPoints": {
                    "anyOf": [
                      {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "required": [
                            "entryPointType",
                            "uri",
                            "label",
                            "meetingCode",
                            "passcode",
                            "password",
                            "pin"
                          ],
                          "properties": {
                            "pin": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "uri": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "label": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "passcode": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "password": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "meetingCode": {
                              "anyOf": [
                                {
                                  "type": "string"
                                },
                                {
                                  "type": "null"
                                }
                              ]
                            },
                            "entryPointType": {
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
                        }
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "conferenceId": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "conferenceSolution": {
                    "anyOf": [
                      {
                        "type": "object",
                        "required": [
                          "name",
                          "iconUri"
                        ],
                        "properties": {
                          "name": {
                            "anyOf": [
                              {
                                "type": "string"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "iconUri": {
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
                      {
                        "type": "null"
                      }
                    ]
                  }
                },
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ],
            "description": "Detailed conference/meeting information including Google Meet, Zoom, etc."
          }
        },
        "additionalProperties": false
      }
    },
    "nextPageToken": {
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
}
```

### createEvent

**Description:** Create a new calendar event

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "summary",
    "start",
    "end",
    "description",
    "location",
    "attendees"
  ],
  "properties": {
    "end": {
      "type": "string",
      "description": "Event end time. For timed events, use RFC3339 with timezone offset matching the event's location (e.g., '2024-01-15T15:30:00-05:00' for 3:30 PM Eastern Time). For all-day events, use date only (e.g., '2024-01-16' for an event ending on the 15th). Do NOT use UTC ('Z' suffix) unless the event is explicitly in UTC timezone."
    },
    "start": {
      "type": "string",
      "description": "Event start time. For timed events, use RFC3339 with timezone offset matching the event's location (e.g., '2024-01-15T14:30:00-05:00' for 2:30 PM Eastern Time). For all-day events, use date only (e.g., '2024-01-15'). Do NOT use UTC ('Z' suffix) unless the event is explicitly in UTC timezone."
    },
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "summary": {
      "type": "string",
      "description": "Event title"
    },
    "location": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "attendees": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "email"
            ],
            "properties": {
              "email": {
                "type": "string",
                "format": "email",
                "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
              }
            }
          }
        },
        {
          "type": "null"
        }
      ],
      "description": "List of attendee email addresses"
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars. If omitted, creates event in the user's primary calendar."
    },
    "description": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "addMeetingLink": {
      "type": "boolean",
      "description": "If true, creates a Google Meet link for the event"
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
    "event"
  ],
  "properties": {
    "event": {
      "type": "object",
      "required": [
        "id",
        "summary",
        "start",
        "end",
        "location",
        "description",
        "meetingLink"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "end": {
          "type": "string",
          "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T15:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
        },
        "start": {
          "type": "string",
          "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T14:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
        },
        "summary": {
          "type": "string"
        },
        "location": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "description": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "meetingLink": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Google Meet link if addMeetingLink was true"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### updateEvent

**Description:** Update an existing calendar event. All update fields are optional and append-only for attachments and attendees.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "eventId"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "eventId": {
      "type": "string",
      "description": "Event ID from getUpcomingEvents or searchEvents"
    },
    "newStart": {
      "type": "string",
      "description": "New start time. For timed events, use RFC3339 with timezone offset (e.g., '2024-01-15T14:30:00-05:00'). For all-day events, use date only (e.g., '2024-01-15'). If provided with newDurationMinutes, the end time will be automatically calculated."
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars. If omitted, uses the user's primary calendar."
    },
    "newSummary": {
      "type": "string",
      "description": "New event title"
    },
    "newLocation": {
      "type": "string"
    },
    "newDescription": {
      "type": "string"
    },
    "newDurationMinutes": {
      "type": "number",
      "description": "Duration in minutes for the event. Only used when newStart is also provided to calculate new end time."
    },
    "additionalAttendees": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "email"
        ],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
          }
        }
      },
      "description": "Email addresses to add as attendees (appends to existing attendees)"
    },
    "additionalAttachments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "fileId": {
            "type": "string"
          }
        }
      },
      "description": "Google Drive file IDs to attach to the event (appends to existing attachments)"
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
    "event"
  ],
  "properties": {
    "event": {
      "type": "object",
      "required": [
        "id",
        "summary",
        "start",
        "end"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "end": {
          "type": "string",
          "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T15:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
        },
        "start": {
          "type": "string",
          "description": "RFC3339 formatted timestamp (e.g., '2024-01-15T14:30:00-05:00') or date for all-day events (e.g., '2024-01-15')"
        },
        "status": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "htmlLink": {
          "type": "string"
        },
        "location": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### deleteEvent

**Description:** Delete a calendar event. This permanently removes the event from the calendar. Use with caution as this action cannot be undone.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "account",
    "eventId"
  ],
  "properties": {
    "account": {
      "type": "string",
      "description": "Email address of the calendar account from listAccounts"
    },
    "eventId": {
      "type": "string",
      "description": "Event ID from getUpcomingEvents, getEventsForDay, or searchEvents"
    },
    "calendarId": {
      "type": "string",
      "description": "Calendar ID from listCalendars. If omitted, uses the user's primary calendar."
    },
    "sendUpdates": {
      "enum": [
        "all",
        "externalOnly",
        "none"
      ],
      "type": "string",
      "description": "Whether to send notifications about the deletion. 'all' sends to all attendees, 'externalOnly' sends only to non-Google Calendar attendees, 'none' sends no notifications. Defaults to 'all'."
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
    "deletedEventId"
  ],
  "properties": {
    "success": {
      "type": "boolean"
    },
    "deletedEventId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

