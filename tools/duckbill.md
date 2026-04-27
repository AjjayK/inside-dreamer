# Tool Server: duckbill

**ID:** 515bddf5-6a8d-4c7d-aab8-42292380bca3

**Short Description:** AI that actually gets sh*t done

## Tools (5)

### duckbill_request_call

**Description:** Request a phone call to be made by a Duckbill human agent.

Args:
    call_request: Describe the phone call you need made. Include:
        - Who to call (business name, or phone number if you have it)
        - What you need (reservation, appointment, inquiry, etc.)
        - Any relevant details (dates, times, account numbers, preferences)

Returns:
    A dictionary containing task_id and status for the call request.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "call_request"
  ],
  "properties": {
    "call_request": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "additionalProperties": true
}
```

### duckbill_list_tasks

**Description:** List active call requests for your Duckbill account.

Returns:
    A dictionary containing a list of pending and in-progress call requests.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

**Output Schema:**

```json
{
  "type": "object",
  "additionalProperties": true
}
```

### duckbill_get_task

**Description:** Get the status and results of a phone call request.

Use this to check if a call has been made, see what was discussed,
and get the outcome of the conversation.

Args:
    task_id: The UUID of the call request to check.

Returns:
    A dictionary containing:
    - task_id: The request UUID
    - name: Brief summary of the call
    - description: The original call request
    - status: Current status (e.g., "Pending", "In Progress", "Completed")
    - status_summary: What happened on the call or current progress
    - created_at: When the call was requested
    - updated_at: When the status was last updated
    - conversation: Full conversation history with the Duckbill agent

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "task_id"
  ],
  "properties": {
    "task_id": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "additionalProperties": true
}
```

### duckbill_send_message

**Description:** Send a message to the Duckbill agent handling your call request.

Use this to provide additional information, answer questions from the agent,
or clarify details before or after the call is made.

Args:
    task_id: The UUID of the call request.
    message: Your message to the agent. Be clear and specific.

Returns:
    A dictionary confirming the message was sent.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "task_id",
    "message"
  ],
  "properties": {
    "message": {
      "type": "string"
    },
    "task_id": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "additionalProperties": true
}
```

### duckbill_cancel_task

**Description:** Cancel a pending call request.

Use this if you no longer need the call to be made.

Args:
    task_id: The UUID of the call request to cancel.

Returns:
    A dictionary confirming the cancellation.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "task_id"
  ],
  "properties": {
    "task_id": {
      "type": "string"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "additionalProperties": true
}
```

