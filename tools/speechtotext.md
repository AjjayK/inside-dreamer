# Tool Server: speechtotext

**ID:** 5baf3dca-26cc-4cff-9fea-2f589bdde6a0

**Short Description:** Transcribe spoken audio files to text.

## Description

Transcribe spoken audio files to text

## Tools (7)

### transcribeAudio

**Description:** Transcribe audio from a URL. Supports files of any size - large files are automatically downsampled and split into chunks for processing. Returns the transcribed text.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "audioUrl"
  ],
  "properties": {
    "audioUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the audio file to transcribe. Must be a publicly accessible URL or a pre-signed URL."
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
    "success"
  ],
  "properties": {
    "error": {
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
    "success": {
      "type": "boolean"
    },
    "transcription": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### diarizeAudio

**Description:** Transcribe and diarize audio from a URL, identifying different speakers. Supports files of any size - large files are automatically downsampled and split into chunks for processing. Returns segments with speaker labels and timestamps.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "audioUrl"
  ],
  "properties": {
    "audioUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the audio file to diarize. Must be a publicly accessible URL or a pre-signed URL."
    },
    "knownSpeakers": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional array of known speaker names (up to 4). If provided, the model will attempt to map segments to these speakers. Example: ['Alice', 'Bob']"
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
    "success"
  ],
  "properties": {
    "error": {
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
    "success": {
      "type": "boolean"
    },
    "fullText": {
      "type": "string"
    },
    "segments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "speaker",
          "text"
        ],
        "properties": {
          "end": {
            "type": "number"
          },
          "text": {
            "type": "string"
          },
          "start": {
            "type": "number"
          },
          "speaker": {
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

### translateAudio

**Description:** Translate audio from any language to English. Supports files of any size - large files are automatically downsampled and split into chunks for processing. Returns the translated text in English.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "audioUrl"
  ],
  "properties": {
    "audioUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the audio file to translate. Must be a publicly accessible URL or a pre-signed URL. Audio can be in any supported language."
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
    "success"
  ],
  "properties": {
    "error": {
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
    "success": {
      "type": "boolean"
    },
    "translation": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### translateLargeAudioFile

**Description:** Process a large audio file (>25MB) asynchronously by translating it to English. Returns a ticket ID immediately that can be used to check the status. Processing runs in the background via Lambda and may take several minutes depending on file size. Use checkAudioProcessingStatus to get the result.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "audioUrl"
  ],
  "properties": {
    "audioUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the large audio file to translate"
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
    "success"
  ],
  "properties": {
    "error": {
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
    "success": {
      "type": "boolean"
    },
    "ticketId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### transcribeLargeAudioFile

**Description:** Process a large audio file (>25MB) asynchronously by transcribing it. Returns a ticket ID immediately that can be used to check the status. Processing runs in the background via Lambda and may take several minutes depending on file size. Use checkAudioProcessingStatus to get the result.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "audioUrl"
  ],
  "properties": {
    "audioUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the large audio file to transcribe"
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
    "success"
  ],
  "properties": {
    "error": {
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
    "success": {
      "type": "boolean"
    },
    "ticketId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### diarizeLargeAudioFile

**Description:** Process a large audio file (>25MB) asynchronously by diarizing it to identify speakers. Returns a ticket ID immediately that can be used to check the status. Processing runs in the background via Lambda and may take several minutes depending on file size. Use checkAudioProcessingStatus to get the result.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "audioUrl"
  ],
  "properties": {
    "audioUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the large audio file to diarize"
    },
    "knownSpeakers": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional array of known speaker names to help with identification"
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
    "success"
  ],
  "properties": {
    "error": {
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
    "success": {
      "type": "boolean"
    },
    "ticketId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### checkAudioProcessingStatus

**Description:** Check the status of a large audio file processing job using the ticket ID returned from translateLargeAudioFile, transcribeLargeAudioFile, or diarizeLargeAudioFile. Returns the status (pending/completed/failed) and the result if completed.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ticketId"
  ],
  "properties": {
    "ticketId": {
      "type": "string",
      "description": "The ticket ID returned from the large audio processing tool"
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
    "success"
  ],
  "properties": {
    "error": {
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
    "result": {
      "type": "object",
      "properties": {
        "fullText": {
          "type": "string"
        },
        "segments": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "speaker",
              "text"
            ],
            "properties": {
              "end": {
                "type": "number"
              },
              "text": {
                "type": "string"
              },
              "start": {
                "type": "number"
              },
              "speaker": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        },
        "translation": {
          "type": "string"
        },
        "transcription": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "status": {
      "enum": [
        "pending",
        "completed",
        "failed"
      ],
      "type": "string"
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

