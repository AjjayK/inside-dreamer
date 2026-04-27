# Agent: Sidekick Task Scheduler

**ID:** 4f3f0ce8-015b-4d9f-a3ac-acd37ac474eb

## Description

A task automation agent that lets you define, schedule, and manage Sidekick tasks. Create tasks with custom descriptions, set execution times for one-time or recurring runs, enable/disable tasks on the fly, and view all scheduled tasks in full mode to manage your automation workflow.

- **Define custom Sidekick tasks**, with detailed descriptions and execution instructions
- **Set execution timing**, with options for one-time runs or recurring schedules (daily, weekly, custom times)
- **Enable/disable tasks instantly**, to pause automation without deleting task configuration
- **Full task dashboard**, showing all scheduled tasks with status, timing, and quick controls for management

## Server Functions (12)

### completeOnboarding

**Description:** Marks onboarding as completed for the user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### createTask

**Description:** Creates a new scheduled task with the given configuration

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "name",
    "instructions",
    "scheduleType",
    "scheduleValue"
  ],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "Name of the task"
    },
    "weekDay": {
      "type": "number",
      "maximum": 6,
      "minimum": 0,
      "description": "Day of week for weekly schedule (0=Sunday, 6=Saturday)"
    },
    "priority": {
      "anyOf": [
        {
          "type": "string",
          "const": "normal"
        },
        {
          "type": "string",
          "const": "urgent"
        }
      ],
      "description": "Notification priority: normal (default) or urgent (sends push notification)"
    },
    "instructions": {
      "type": "string",
      "minLength": 1,
      "description": "Detailed instructions for what the sidekick task should do"
    },
    "scheduleType": {
      "anyOf": [
        {
          "type": "string",
          "const": "once"
        },
        {
          "type": "string",
          "const": "daily"
        },
        {
          "type": "string",
          "const": "weekly"
        },
        {
          "type": "string",
          "const": "custom"
        }
      ],
      "description": "Type of schedule: once (one-time), daily, weekly, or custom (cron)"
    },
    "scheduleValue": {
      "type": "string",
      "minLength": 1,
      "description": "For once: ISO 8601 timestamp. For daily/weekly: HH:MM time string. For custom: cron expression"
    }
  }
}
```

### deleteTask

**Description:** Deletes a scheduled task and removes its trigger/timer

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The task ID to delete"
    }
  }
}
```

### executeScheduledTask

**Description:** Executes a scheduled task (called by triggers and timers)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "taskId": {
      "type": "string",
      "description": "The task ID to execute (for timers)"
    },
    "triggerName": {
      "type": "string",
      "description": "The trigger name (for cron triggers)"
    }
  }
}
```

### getOnboardingStatus

**Description:** Checks if the user has completed onboarding

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTask

**Description:** Gets a single task by its ID

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The task ID"
    }
  }
}
```

### getTaskExecutions

**Description:** Gets the execution history for a task

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "taskId"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 10,
      "description": "Maximum number of executions to return"
    },
    "taskId": {
      "type": "number",
      "description": "The task ID to get executions for"
    }
  }
}
```

### getTasks

**Description:** Gets all scheduled tasks with their status and timing information

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Main background function for the task automation agent

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### runTaskNow

**Description:** Runs a scheduled task immediately without waiting for the schedule

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The task ID to run"
    }
  }
}
```

### toggleTask

**Description:** Enables or disables a scheduled task

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The task ID to toggle"
    }
  }
}
```

### updateTask

**Description:** Updates an existing task's configuration

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The task ID to update"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "New name for the task"
    },
    "weekDay": {
      "type": "number",
      "maximum": 6,
      "minimum": 0
    },
    "priority": {
      "anyOf": [
        {
          "type": "string",
          "const": "normal"
        },
        {
          "type": "string",
          "const": "urgent"
        }
      ],
      "description": "Notification priority: normal or urgent (sends push notification)"
    },
    "instructions": {
      "type": "string",
      "minLength": 1,
      "description": "New instructions for the task"
    },
    "scheduleType": {
      "anyOf": [
        {
          "type": "string",
          "const": "once"
        },
        {
          "type": "string",
          "const": "daily"
        },
        {
          "type": "string",
          "const": "weekly"
        },
        {
          "type": "string",
          "const": "custom"
        }
      ]
    },
    "scheduleValue": {
      "type": "string",
      "minLength": 1
    }
  }
}
```

