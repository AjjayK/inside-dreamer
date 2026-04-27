# Tool Server: text-to-speech

**ID:** 2d5c8730-e086-4fed-86a1-2fa8ad698e21

**Short Description:** Convert text to speech

## Description

Convert text to speech with multiple voices

## Tools (4)

### createMultiVoiceAudio

**Description:** Create high-quality multi-voice audio. This is the RECOMMENDED and cost-effective option for most use cases. VOICE SELECTION: The default voice is 'british-female-1' (Fiona), a professional, neutral voice suitable for most content. If you need a different voice, specify it explicitly (e.g., 'male-1', 'female-1', 'male-2', 'female-2', 'british-male-1', 'british-female-1'). MULTI-LANGUAGE SUPPORT: While voices are optimized for English, this tool supports 50+ languages including Afrikaans, Arabic, Chinese, Dutch, French, German, Hindi, Italian, Japanese, Korean, Polish, Portuguese, Russian, Spanish, Turkish, Vietnamese, and many more. Simply provide input text in your desired language. Returns a cloud storage URL for the generated audio. IMPORTANT: For very long scripts (longer than 1000 words), use createMultiVoiceAudioLongScript instead to avoid timeouts.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "script"
  ],
  "properties": {
    "script": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "text"
        ],
        "properties": {
          "text": {
            "type": "string",
            "description": "The text to speak. IMPORTANT: Write all numbers, times, and symbols in full words for proper pronunciation. Examples: '10:00am' should be 'ten oh clock A M', '1000' should be 'one thousand', '$50' should be 'fifty dollars', '25%' should be 'twenty-five percent'."
          },
          "voice": {
            "enum": [
              "female-1",
              "male-1",
              "female-2",
              "male-2",
              "british-female-1",
              "british-male-1"
            ],
            "type": "string",
            "description": "Voice to use. Defaults to 'british-female-1' (Fiona) if not specified."
          }
        }
      },
      "description": "The script to create a multi-voice audio file from. PERFORMANCE TIP: Even if you have a single long script to be read by one voice, segment it into individual chunks (e.g., by paragraph or section). Each chunk can be synthesized in parallel, dramatically speeding up the overall process."
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
    "audioUrl": {
      "type": "string",
      "format": "uri"
    }
  },
  "additionalProperties": false
}
```

### createMultiVoiceAudioLongScript

**Description:** Create a multi-voice audio from a LONG script. This tool is designed for scripts that may take longer than 10 minutes to process and returns a ticket immediately. Use checkMultiVoiceAudioStatus to poll for completion. VOICE SELECTION: The default voice is 'british-female-1' (Fiona), a professional, neutral voice suitable for most content. If you need a different voice, specify it explicitly (e.g., 'male-1', 'female-2'). MULTI-LANGUAGE SUPPORT: While voices are optimized for English, this tool supports 50+ languages including Afrikaans, Arabic, Chinese, Dutch, French, German, Hindi, Italian, Japanese, Korean, Polish, Portuguese, Russian, Spanish, Turkish, Vietnamese, and many more. Simply provide input text in your desired language. PERFORMANCE TIP: Even if you have a single long script to be read by one voice, segment it into individual chunks (e.g., by paragraph or section). Each chunk can be synthesized in parallel, dramatically speeding up the overall process. Returns a ticket ID that can be used to check the status.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "script"
  ],
  "properties": {
    "script": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "text"
        ],
        "properties": {
          "text": {
            "type": "string",
            "description": "The text to speak. IMPORTANT: Write all numbers, times, and symbols in full words for proper pronunciation. Examples: '10:00am' should be 'ten oh clock A M', '1000' should be 'one thousand', '$50' should be 'fifty dollars', '25%' should be 'twenty-five percent'. TIP: Keep individual segments reasonably sized (a few paragraphs each) for parallel processing."
          },
          "voice": {
            "enum": [
              "female-1",
              "male-1",
              "female-2",
              "male-2",
              "british-female-1",
              "british-male-1"
            ],
            "type": "string",
            "description": "Voice to use. Defaults to 'british-female-1' (Fiona) if not specified."
          }
        }
      },
      "description": "The script to create a multi-voice audio file from. TIP: Break long monologues into multiple segments for faster parallel processing."
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

### createElevenLabsMultiVoiceAudio

**Description:** This tool is deprecated. All agents must not use this tool. Use createMultiVoiceAudio instead. Create a multi-voice audio with ElevenLabs premium voices. WARNING: This is 33x MORE EXPENSIVE than the default createMultiVoiceAudio tool. ONLY use this if you have a specific requirement for ElevenLabs voices or if explicitly requested by the user. For most use cases, including British accents, use createMultiVoiceAudio instead.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "script"
  ],
  "properties": {
    "script": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "voice",
          "text"
        ],
        "properties": {
          "text": {
            "type": "string",
            "description": "The text to speak. IMPORTANT: Write all numbers, times, and symbols in full words for proper pronunciation. Examples: '10:00am' should be 'ten oh clock A M', '1000' should be 'one thousand', '$50' should be 'fifty dollars', '25%' should be 'twenty-five percent'."
          },
          "voice": {
            "enum": [
              "female-1",
              "male-1",
              "female-2",
              "male-2",
              "british-female-1",
              "british-male-1",
              "irish-male-1"
            ],
            "type": "string"
          }
        }
      },
      "description": "The script to create a multi-voice audio file from. PERFORMANCE TIP: Even if you have a single long script to be read by one voice, segment it into individual chunks (e.g., by paragraph or section). Each chunk can be synthesized in parallel, dramatically speeding up the overall process."
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
    "audioUrl": {
      "type": "string",
      "format": "uri"
    }
  },
  "additionalProperties": false
}
```

### checkMultiVoiceAudioStatus

**Description:** Check the status of a long-running TTS job created with createMultiVoiceAudioLongScript. Returns the current status (pending, processing, completed, or failed) and the audio URL if completed. Poll this endpoint periodically until the status is 'completed' or 'failed'.

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
      "description": "The ticket ID returned from createMultiVoiceAudioLongScript"
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
    "status": {
      "enum": [
        "pending",
        "processing",
        "completed",
        "failed"
      ],
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "audioUrl": {
      "type": "string",
      "format": "uri"
    }
  },
  "additionalProperties": false
}
```

