# Agent: /dev/aiinterviewpath

**ID:** 4fc4d68d-e417-4eea-9160-ab8963a31f99

## Description

# OVERVIEW
/dev/aiinterviewpath is a comprehensive technical interview preparation agent that delivers daily curated DSA problems, system design challenges, AI engineer resources, OOP concepts, and technical leadership material. Developed on /dev/agents using Galaxy Fold, it combines quality content curation with collaborative learning features, allowing users to track progress, discuss solutions, and continue their preparation journey through interactive workflows.

# KEY FEATURES
- **Curated Daily Content**: Posts structured DSA, System Design, AI Engineer, OOP, and Technical Leadership problems with difficulty levels and time estimates
- **Problem Selection & Difficulty**: Intelligent selection of relevant interview preparation topics matching LeetCode/NeetCode quality standards, excluding C-suite content
- **Interactive Problem Interface**: Full-screen UI showing problem statements, input/output examples, and submission tracking with option to continue to agent workspace
- **Collaborative Discussion**: Built-in discussion threads where users can share solutions, approaches, and learn from community insights on each problem
- **Progress Tracking**: Records attempted problems, solve rate, and learning outcomes with visual progress dashboards
- **Continuous Learning Path**: Smart continuation feature that surfaces follow-up problems based on user performance and learning gaps

# VERBATIM INSTRUCTIONS
Make a leetcode/ neetcode / hello interview style , but an actual publishable agent. It should have good content. And also am option to continue to the agent. Users should be able to collaborate and this should have dsa, system design, AI engineer resources, object oriented design, technical leadership relevant material. Should not include content specific to c suite as well.

## Server Functions (24)

### addCompany

**Description:** Add a new company to prepare for, or return existing one. Accepts a company name or URL (will extract company name from URL).

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 200,
      "minLength": 1,
      "description": "Company name or company URL"
    }
  }
}
```

### addDiscussion

**Description:** Add a discussion comment to a problem

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "problemId",
    "content"
  ],
  "properties": {
    "content": {
      "type": "string",
      "maxLength": 5000,
      "minLength": 1,
      "description": "Discussion content in markdown"
    },
    "problemId": {
      "type": "number",
      "description": "The problem ID"
    }
  }
}
```

### addJobPosting

**Description:** Add a job posting and analyze it for expected questions and relevant problems

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "content"
  ],
  "properties": {
    "content": {
      "type": "string",
      "maxLength": 50000,
      "minLength": 10,
      "description": "The job posting text"
    },
    "companyId": {
      "type": "number",
      "description": "The company ID"
    }
  }
}
```

### clearChatHistory

**Description:** Clear chat history for a company in a specific context

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "context"
  ],
  "properties": {
    "context": {
      "type": "string",
      "description": "Chat context: job_posting, behavioral, or general"
    },
    "companyId": {
      "type": "number",
      "description": "The company ID"
    },
    "jobPostingId": {
      "type": "number",
      "description": "Optional job posting ID"
    }
  }
}
```

### forceCurate

**Description:** Manually trigger problem curation for a specific category

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "category"
  ],
  "properties": {
    "category": {
      "anyOf": [
        {
          "type": "string",
          "const": "dsa"
        },
        {
          "type": "string",
          "const": "system_design"
        },
        {
          "type": "string",
          "const": "ai_ml"
        },
        {
          "type": "string",
          "const": "oop"
        },
        {
          "type": "string",
          "const": "tech_leadership"
        }
      ]
    }
  }
}
```

### generateBehavioralContent

**Description:** Generate customized behavioral interview content for a company using AI

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId"
  ],
  "properties": {
    "companyId": {
      "type": "number",
      "description": "The company ID"
    }
  }
}
```

### generateJavaSolutions

**Description:** Generate Java OOP solutions for existing problems that are missing them

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getCategories

**Description:** Get all categories with problem counts

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getChatHistory

**Description:** Get chat conversation history for a company in a specific context

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "context"
  ],
  "properties": {
    "context": {
      "type": "string",
      "description": "Chat context: job_posting, behavioral, or general"
    },
    "companyId": {
      "type": "number",
      "description": "The company ID"
    },
    "jobPostingId": {
      "type": "number",
      "description": "Optional job posting ID for posting-specific chats"
    }
  }
}
```

### getCompanies

**Description:** Get all companies the user is preparing for

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getCompanyDetails

**Description:** Get full details for a company including notes, problems, and job postings

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId"
  ],
  "properties": {
    "companyId": {
      "type": "number",
      "description": "The company ID"
    }
  }
}
```

### getProblem

**Description:** Get a single problem with full details including solution

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "problemId"
  ],
  "properties": {
    "problemId": {
      "type": "number",
      "description": "The problem ID"
    }
  }
}
```

### getProblems

**Description:** Get interview problems with optional category and difficulty filters

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "maximum": 50,
      "minimum": 1
    },
    "category": {
      "anyOf": [
        {
          "type": "string",
          "const": "dsa"
        },
        {
          "type": "string",
          "const": "system_design"
        },
        {
          "type": "string",
          "const": "ai_ml"
        },
        {
          "type": "string",
          "const": "oop"
        },
        {
          "type": "string",
          "const": "tech_leadership"
        }
      ]
    },
    "difficulty": {
      "anyOf": [
        {
          "type": "string",
          "const": "easy"
        },
        {
          "type": "string",
          "const": "medium"
        },
        {
          "type": "string",
          "const": "hard"
        }
      ]
    }
  }
}
```

### getProgress

**Description:** Get user's overall progress statistics

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Daily curation of interview problems across all categories

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### markProblemAttempted

**Description:** Mark a problem as started/attempted

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "problemId"
  ],
  "properties": {
    "problemId": {
      "type": "number",
      "description": "The problem ID"
    }
  }
}
```

### markProblemSolved

**Description:** Mark a problem as solved with optional notes

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "problemId"
  ],
  "properties": {
    "notes": {
      "type": "string",
      "description": "User notes about solution"
    },
    "problemId": {
      "type": "number",
      "description": "The problem ID"
    }
  }
}
```

### regenerateProblem

**Description:** Force regenerate content for a problem with missing or empty content

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "problemId"
  ],
  "properties": {
    "problemId": {
      "type": "number",
      "description": "The problem ID to regenerate content for"
    }
  }
}
```

### saveCompanyNotes

**Description:** Save notes about a company's values, principles, culture

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "notes"
  ],
  "properties": {
    "notes": {
      "type": "string",
      "maxLength": 10000,
      "description": "Notes about company values/principles"
    },
    "companyId": {
      "type": "number",
      "description": "The company ID"
    }
  }
}
```

### searchProblemsForTagging

**Description:** Search problems to tag to a company

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "Search query for problem title"
    },
    "companyId": {
      "type": "number",
      "description": "Company ID to exclude already-tagged problems"
    }
  }
}
```

### sendChatMessage

**Description:** Send a message in a company prep chat and get an AI response

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "context",
    "message"
  ],
  "properties": {
    "context": {
      "type": "string",
      "description": "Chat context: job_posting, behavioral, or general"
    },
    "message": {
      "type": "string",
      "maxLength": 10000,
      "minLength": 1,
      "description": "The user's message"
    },
    "companyId": {
      "type": "number",
      "description": "The company ID"
    },
    "jobPostingId": {
      "type": "number",
      "description": "Optional job posting ID for posting-specific chats"
    }
  }
}
```

### tagProblemToCompany

**Description:** Link a problem to a company for tracking

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "problemId"
  ],
  "properties": {
    "companyId": {
      "type": "number",
      "description": "The company ID"
    },
    "problemId": {
      "type": "number",
      "description": "The problem ID"
    }
  }
}
```

### untagProblemFromCompany

**Description:** Remove a problem link from a company

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "problemId"
  ],
  "properties": {
    "companyId": {
      "type": "number",
      "description": "The company ID"
    },
    "problemId": {
      "type": "number",
      "description": "The problem ID"
    }
  }
}
```

### updateCompanyName

**Description:** Rename a company

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "companyId",
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 200,
      "minLength": 1,
      "description": "New company name"
    },
    "companyId": {
      "type": "number",
      "description": "The company ID"
    }
  }
}
```

