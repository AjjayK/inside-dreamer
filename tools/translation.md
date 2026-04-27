# Tool Server: translation

**ID:** df1ff66e-9c03-42ca-83fc-c741b1e56f3b

**Short Description:** Translate text to and from more than 40 languages

## Description

Translate text to and from more than 40 languages

## Tools (3)

### translate

**Description:** Translate text or text files between 40+ languages. Supports auto-detection of source language. Handles long documents by chunking and parallel processing. Preserves timestamps, formatting, and non-linguistic content exactly.

Supported languages: en (English), es (Spanish (Español)), fr (French (Français)), de (German (Deutsch)), it (Italian (Italiano)), pt (Portuguese (Português)), pt-br (Brazilian Portuguese (Português Brasileiro)), zh (Mandarin Chinese (中文)), zh-cn (Simplified Chinese (简体中文)), zh-tw (Traditional Chinese (繁體中文)), ja (Japanese (日本語)), ko (Korean (한국어)), ar (Arabic (العربية)), hi (Hindi (हिन्दी)), ru (Russian (Русский)), nl (Dutch (Nederlands)), pl (Polish (Polski)), tr (Turkish (Türkçe)), sv (Swedish (Svenska)), da (Danish (Dansk)), no (Norwegian (Norsk)), fi (Finnish (Suomi)), el (Greek (Ελληνικά)), cs (Czech (Čeština)), hu (Hungarian (Magyar)), ro (Romanian (Română)), th (Thai (ไทย)), vi (Vietnamese (Tiếng Việt)), id (Indonesian (Bahasa Indonesia)), ms (Malay (Bahasa Melayu)), uk (Ukrainian (Українська)), he (Hebrew (עברית)), bg (Bulgarian (Български)), hr (Croatian (Hrvatski)), sk (Slovak (Slovenčina)), sl (Slovenian (Slovenščina)), sr (Serbian (Српски)), bn (Bengali (বাংলা)), ta (Tamil (தமிழ்)), te (Telugu (తెలుగు)), mr (Marathi (मराठी)), ur (Urdu (اردو)), fa (Persian (فارسی)), sw (Swahili (Kiswahili)), ga (Irish (Gaeilge)), cy (Welsh (Cymraeg)), ca (Catalan (Català))

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "targetLanguage"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of a text file to translate. Either 'text' or 'url' must be provided. The URL must point to a text file (content-type: text/*)."
    },
    "text": {
      "type": "string",
      "description": "The text to translate. Either 'text' or 'url' must be provided."
    },
    "returnAsUrl": {
      "type": "boolean",
      "default": false,
      "description": "If true, upload the translated text to S3 and return a URL instead of including the text directly in the response. Useful for very large translations. Default: false."
    },
    "sourceLanguage": {
      "type": "string",
      "default": "auto-detect",
      "description": "Source language code. Use 'auto-detect' (default) to automatically detect the source language. Supported codes: auto-detect, en, es, fr, de, it, pt, pt-br, zh, zh-cn, zh-tw, ja, ko, ar, hi, ru, nl, pl, tr, sv, da, no, fi, el, cs, hu, ro, th, vi, id, ms, uk, he, bg, hr, sk, sl, sr, bn, ta, te, mr, ur, fa, sw, ga, cy, ca"
    },
    "targetLanguage": {
      "type": "string",
      "description": "Target language code (REQUIRED). Supported codes: en, es, fr, de, it, pt, pt-br, zh, zh-cn, zh-tw, ja, ko, ar, hi, ru, nl, pl, tr, sv, da, no, fi, el, cs, hu, ro, th, vi, id, ms, uk, he, bg, hr, sk, sl, sr, bn, ta, te, mr, ur, fa, sw, ga, cy, ca"
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
      "type": "object",
      "required": [
        "type",
        "message"
      ],
      "properties": {
        "type": {
          "type": "string"
        },
        "details": {},
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    },
    "chunkCount": {
      "type": "number"
    },
    "targetLanguage": {
      "type": "string"
    },
    "translatedText": {
      "type": "string"
    },
    "translatedTextUrl": {
      "type": "string",
      "format": "uri"
    },
    "sourceLanguageDetected": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### translateLongDocument

**Description:** Translate long documents that may take more than 10 minutes to process. This tool returns a ticket immediately and processes the translation asynchronously. Use checkTranslationStatus to poll for completion.

Supported languages: en (English), es (Spanish (Español)), fr (French (Français)), de (German (Deutsch)), it (Italian (Italiano)), pt (Portuguese (Português)), pt-br (Brazilian Portuguese (Português Brasileiro)), zh (Mandarin Chinese (中文)), zh-cn (Simplified Chinese (简体中文)), zh-tw (Traditional Chinese (繁體中文)), ja (Japanese (日本語)), ko (Korean (한국어)), ar (Arabic (العربية)), hi (Hindi (हिन्दी)), ru (Russian (Русский)), nl (Dutch (Nederlands)), pl (Polish (Polski)), tr (Turkish (Türkçe)), sv (Swedish (Svenska)), da (Danish (Dansk)), no (Norwegian (Norsk)), fi (Finnish (Suomi)), el (Greek (Ελληνικά)), cs (Czech (Čeština)), hu (Hungarian (Magyar)), ro (Romanian (Română)), th (Thai (ไทย)), vi (Vietnamese (Tiếng Việt)), id (Indonesian (Bahasa Indonesia)), ms (Malay (Bahasa Melayu)), uk (Ukrainian (Українська)), he (Hebrew (עברית)), bg (Bulgarian (Български)), hr (Croatian (Hrvatski)), sk (Slovak (Slovenčina)), sl (Slovenian (Slovenščina)), sr (Serbian (Српски)), bn (Bengali (বাংলা)), ta (Tamil (தமிழ்)), te (Telugu (తెలుగు)), mr (Marathi (मराठी)), ur (Urdu (اردو)), fa (Persian (فارسی)), sw (Swahili (Kiswahili)), ga (Irish (Gaeilge)), cy (Welsh (Cymraeg)), ca (Catalan (Català))

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "targetLanguage"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of a text file to translate. Either 'text' or 'url' must be provided. The URL must point to a text file (content-type: text/*)."
    },
    "text": {
      "type": "string",
      "description": "The text to translate. Either 'text' or 'url' must be provided."
    },
    "returnAsUrl": {
      "type": "boolean",
      "default": false,
      "description": "If true, upload the translated text to S3 and return a URL instead of including the text directly in the response. Useful for very large translations. Default: false."
    },
    "sourceLanguage": {
      "type": "string",
      "default": "auto-detect",
      "description": "Source language code. Use 'auto-detect' (default) to automatically detect the source language. Supported codes: auto-detect, en, es, fr, de, it, pt, pt-br, zh, zh-cn, zh-tw, ja, ko, ar, hi, ru, nl, pl, tr, sv, da, no, fi, el, cs, hu, ro, th, vi, id, ms, uk, he, bg, hr, sk, sl, sr, bn, ta, te, mr, ur, fa, sw, ga, cy, ca"
    },
    "targetLanguage": {
      "type": "string",
      "description": "Target language code (REQUIRED). Supported codes: en, es, fr, de, it, pt, pt-br, zh, zh-cn, zh-tw, ja, ko, ar, hi, ru, nl, pl, tr, sv, da, no, fi, el, cs, hu, ro, th, vi, id, ms, uk, he, bg, hr, sk, sl, sr, bn, ta, te, mr, ur, fa, sw, ga, cy, ca"
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

### checkTranslationStatus

**Description:** Check the status of a long-running translation job created with translateLongDocument. Returns the current status (pending, processing, completed, or failed) and the translation result if completed. Poll this endpoint periodically until the status is 'completed' or 'failed'.

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
      "description": "The ticket ID returned from translateLongDocument"
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
    "chunkCount": {
      "type": "number"
    },
    "totalChunks": {
      "type": "number"
    },
    "targetLanguage": {
      "type": "string"
    },
    "translatedText": {
      "type": "string"
    },
    "chunksCompleted": {
      "type": "number"
    },
    "translatedTextUrl": {
      "type": "string",
      "format": "uri"
    },
    "sourceLanguageDetected": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

