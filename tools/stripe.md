# Tool Server: stripe

**ID:** b265c335-9475-43a9-b679-db45ffacb01a

**Short Description:** Access Stripe payment & subscription data

## Description

Connect your Stripe account and manage all things on it via Dreamer.

## Tools (15)

### search_stripe_documentation

**Description:** Search the Stripe documentation for the given question and language.

It takes two arguments:
- question (str): The user question to search an answer for in the Stripe documentation.
- language (str, optional): The programming language to search for in the the documentation.


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "question"
  ],
  "properties": {
    "language": {
      "enum": [
        "dotnet",
        "go",
        "java",
        "node",
        "php",
        "ruby",
        "python",
        "curl"
      ],
      "type": "string",
      "description": "The programming language to search for in the the documentation."
    },
    "question": {
      "type": "string",
      "description": "The user question about integrating with Stripe will be used to search the documentation."
    },
    "search_only_api_ref": {
      "type": "boolean",
      "description": "When set to true, search only in the Stripe API reference documentation instead of the full documentation set. Use true when users need specific API implementation details, code examples, or parameter references. Use false (default) for conceptual explanations, best practices, integration guides, or troubleshooting help."
    }
  }
}
```

### get_stripe_account_info

**Description:** This will get the account info for the logged in Stripe account.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### list_customers

**Description:** This tool will fetch a list of Customers from Stripe.

It takes two arguments:
- limit (int, optional): The number of customers to return.
- email (str, optional): A case-sensitive filter on the list based on the customer's email field.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "A case-sensitive filter on the list based on the customer's email field. The value must be a string."
    },
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100."
    }
  }
}
```

### list_products

**Description:** This tool will fetch a list of Products from Stripe.

It takes one optional argument:
- limit (int, optional): The number of products to return.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10."
    }
  }
}
```

### list_prices

**Description:** This tool will fetch a list of Prices from Stripe.

It takes two arguments.
- product (str, optional): The ID of the product to list prices for.
- limit (int, optional): The number of prices to return.

Note that the price unit_amount returned is in currency minor units, e.g. cents for USD and yen for JPY.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10."
    },
    "product": {
      "type": "string",
      "description": "The ID of the product to list prices for."
    }
  }
}
```

### list_invoices

**Description:** This tool will fetch a list of Invoices from Stripe.

It takes two arguments:
- customer (str, optional): The ID of the customer to list invoices for.

- limit (int, optional): The number of invoices to return.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10."
    },
    "customer": {
      "type": "string",
      "description": "The ID of the customer to list invoices for."
    }
  }
}
```

### retrieve_balance

**Description:** This tool will retrieve the balance from Stripe. It takes no input.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### list_payment_intents

**Description:** This tool will list payment intents in Stripe.

It takes two arguments:
- customer (str, optional): The ID of the customer to list payment intents for.
- limit (int, optional): The number of payment intents to return.

Note that the payment intent amount returned is in currency minor units, e.g. cents for USD and yen for JPY.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100."
    },
    "customer": {
      "type": "string",
      "description": "The ID of the customer to list payment intents for."
    }
  }
}
```

### list_subscriptions

**Description:** This tool will list all subscriptions in Stripe.

It takes four arguments:
- customer (str, optional): The ID of the customer to list subscriptions for.

- price (str, optional): The ID of the price to list subscriptions for.
- status (str, optional): The status of the subscriptions to list.
- limit (int, optional): The number of subscriptions to return.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100."
    },
    "price": {
      "type": "string",
      "description": "The ID of the price to list subscriptions for."
    },
    "status": {
      "enum": [
        "active",
        "all",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "trialing",
        "unpaid"
      ],
      "type": "string",
      "description": "The status of the subscriptions to retrieve."
    },
    "customer": {
      "type": "string",
      "description": "The ID of the customer to list subscriptions for."
    }
  }
}
```

### list_coupons

**Description:** This tool will fetch a list of Coupons from Stripe.

It takes one optional argument:
- limit (int, optional): The number of coupons to return.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100."
    }
  }
}
```

### list_disputes

**Description:** This tool will fetch a list of disputes in Stripe.

It takes the following arguments:
- charge (string, optional): Only return disputes associated to the charge specified by this charge ID.
- payment_intent (string, optional): Only return disputes associated to the PaymentIntent specified by this PaymentIntent ID.


**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "integer",
      "default": 10,
      "maximum": 100,
      "minimum": 1,
      "description": "A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10."
    },
    "charge": {
      "type": "string",
      "description": "Only return disputes associated to the charge specified by this charge ID."
    },
    "payment_intent": {
      "type": "string",
      "description": "Only return disputes associated to the PaymentIntent specified by this PaymentIntent ID."
    }
  }
}
```

### search_stripe_resources

**Description:** This tool can be used to search for specific Stripe resources using a custom Stripe query syntax.
It is only able to search for the following resources: customers, payment_intents, charges, invoices, prices, products, subscriptions. It returns a maximum of 100 results.

IMPORTANT: For most use cases, prefer using the specific `list_` tools (e.g., `list_customers`, `list_payment_intents`) when you know the resource type you need. Only use this search tool when you need to:
- Search across multiple resource types simultaneously
- Search by field values that aren't supported by list tools
- Use complex query syntax that isn't supported by list tools

It takes one argument:
- query (str): The query consisting of the Stripe resource to query for and the query clause in Stripe's custom query syntax to query metadata for.

Note that any amount returned is in currency minor units, e.g. cents for USD and yen for JPY.


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "This query string should be formatted as 'resource:query_clause', where 'resource' is one of (customers, payment_intents, charges, invoices, prices, products, subscriptions), and 'query_clause' is the actual query in Stripe's custom query syntax to query metadata for that resource.\n\nFor example, for the query: customers:email:\"jenny.rosen@example.com\"\nresource: `customers`\nquery_clause: `email:\"jenny.rosen@example.com\"`\n\nA query clause consists of a field, operator, and value.\n\n## Query Fields for customers\n* created\n* email\n* metadata\n* name\n* phone\n\n## Query Fields for payment_intents\n* amount\n* created\n* currency\n* customer\n* metadata\n* status\n\n## Query Fields for charges\n* amount\n* billing_details.address.postal_code\n* created\n* currency\n* customer\n* disputed\n* metadata\n* payment_method_details.{{SOURCE}}.last4\n* payment_method_details.{{SOURCE}}.exp_month\n* payment_method_details.{{SOURCE}}.exp_year\n* payment_method_details.{{SOURCE}}.brand\n* payment_method_details.{{SOURCE}}.fingerprint\n* refunded\n* status\n\n## Query Fields for invoices\n* created\n* currency\n* customer\n* last_finalization_error_code\n* last_finalization_error_type\n* metadata\n* number\n* receipt_number\n* status\n* subscription\n* total\n\n## Query Fields for prices\n* active\n* currency\n* lookup_key\n* metadata\n* product\n* type\n\n## Query Fields for products\n* active\n* description\n* metadata\n* name\n* shippable\n* url\n\n## Query Fields for subscriptions\n* created\n* metadata\n* status\n* canceled_at\n\n## Search Operators\nThe following table lists the syntax that you can use to construct a query:\n\n| Syntax | Usage | Description | When to Use | Examples |\n|--------|-------|-------------|-------------|----------|\n| `:` | `field:value` | Exact match operator (case insensitive) | **ONLY when you know the exact complete value** | `currency:\"eur\"` returns records where the currency is exactly \"EUR\" |\n| `~` | `field~value` | Substring match operator (minimum 3 characters) | **ALWAYS use for domain searches, partial names, email parts** | `email~\"foo.com\"` returns emails containing \"foo.com\" |\n| `AND`, `and` | `field:value1 AND field:value2` | Returns records that match both clauses | Combining multiple conditions | `status:\"active\" AND amount:500` |\n| `OR`, `or` | `field:value1 OR field:value2` | Returns records that match either clause | Alternative conditions | `currency:\"usd\" OR currency:\"eur\"` |\n| `-` | `-field:value` | Returns records that don't match the clause | Excluding specific values | `-currency:\"jpy\"` returns records not in JPY |\n| `NULL`, `null` | `field:null` | Checks for field presence (empty/null values) | Finding empty fields | `url:null` returns records where URL field is empty |\n| `>`, `<`, `>=`, `<=`, `=` | `field>value`, `field<value`, etc. | Numeric comparison operators | Amount ranges, dates | `amount>=\"10\"` returns records with amount >= 10 |\n| `` | `\" \"\"\"` | Escape quotes within quotes | When quotes are in the search value | `description:\"the story called \"The Sky and the Sea.\"\"` |\n\n## Query Rules\n* You can combine up to 10 query clauses in a search by separating them with a space or using AND/OR keywords (case insensitive)\n* You cannot combine AND and OR in the same query\n* No parentheses are supported for operator precedence\n* By default, the API combines clauses with AND logic\n* You must use quotation marks around string values (optional for numeric values)\n* You can escape quotes inside quotes with a backslash (\\)\n\n## Examples\n\nInput: Look up charges matching a custom metadata value.\nOutput: charges:metadata['order_id']:'1234567890'\n\nInput: Look up charges matching the last 4 digits of the card used for the payment.\nOutput: charges:payment_method_details.card.last4:4242\n\nInput: Look up customers matching an email.\nOutput: customers:email:'jenny.rosen@example.com'\n\nInput: Look up PaymentIntents not in the USD currency.\nOutput: payment_intents:-currency:'usd'\n\nInput: Filter invoice objects with a total greater than 1000.\nOutput: invoices:total>1000\n\nInput: Filter payments with a amount over $100.\nReasoning: Stripe \"amount\" field is in cents, so we use 1000 instead of 100\nOutput: payment_intents:amount>1000\n\nInput: Look up charges matching a combination of metadata and currency.\nOutput: charges:metadata['key']:'value' AND currency:'usd'\n\nInput: Search for customers with email containing \"john\".\nOutput: customers:email~\"john\"\n\nInput: Find products where the description field is empty.\nOutput: products:description:null\n\nInput: Search for payments with amounts greater than or equal to 5000.\nOutput: payment_intents:amount>=5000\n\nInput: Search for products with description with escaped quotes.\nOutput: products:description:\"The story called \"The Sky and the Sea\".\"\n"
    }
  }
}
```

### fetch_stripe_resources

**Description:** Retrieve Stripe object details by ID.

IMPORTANT: Only call this tool after search_stripe_resources is called to get specific object IDs. Do not use this tool to discover or search for objects.

This tool fetches the object information from Stripe including all available fields. It is only able to fetch the following resources (prefixes):
- Payment Intents (pi_)
- Charges (ch_)
- Invoices (in_)
- Prices (price_)
- Products (prod_)
- Subscriptions (sub_)
- Customers (cus_)

It takes one argument:
- id (str): The unique identifier for the Stripe object (e.g. cus_123, pi_123).

Note that any amount returned is in currency minor units, e.g. cents for USD and yen for JPY.


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "The unique identifier for the Stripe object (e.g. cus_123, pi_123)."
    }
  }
}
```

### stripe_integration_recommender

**Description:** Guides users through Stripe integration planning via interactive Q&A.
Analyzes payment requirements and recommends the appropriate Stripe products
(Checkout, Elements, Billing, Connect, etc.) with step-by-step implementation guidance.

WHEN TO USE:
  Call this tool when the user expresses:
  - Payment keywords: "payments", "checkout", "billing", "subscriptions", "invoices"
  - Commercial intent: "sell", "monetize", "charge users", "e-commerce"
  - Stripe mention: User references "Stripe" directly

IMPORTANT BEHAVIOR:
  - You may call this tool with partial information—the tool will ask clarifying questions. Do not wait until you have complete requirements.
  - Once a plan is in progress, stay in the Q&A flow until completion. If the user asks for clarification or advice (e.g., "what's best for me?"), answer them, then continue with the plan. Only exit early if the user explicitly requests it or the tool returns an unrecoverable error.
  - When the tool returns type="question", present the question to the user exactly as provided.

PARAMETERS:
  - plan_id (optional): Required for continuing/updating. Omit when starting new plan.
  - answer (required): For new plans, provide summary. For existing plans, provide user response. Accepts option selections ('Option 1'), natural language, clarifying questions, or 'UNKNOWN'.
  - notes (optional):
      Technical context you've observed (e.g., "Python/Flask backend", "user wants minimal code to go live quickly", "already has Stripe SDK installed").

Returns JSON:
  - type="question": Plan in progress. Contains `question` to present to user and `plan_id` to include in next call.
  - type="summary": plan_id, status, summary (blueprints, prerequisites, sample_code)
  - type="error": status, error (code, message, user_visible, agent_guidance)

WORKFLOW:
  - New plan: Call without plan_id + answer → Present question EXACTLY → Get answer → Call with plan_id + answer → Repeat
  - Continue plan: Present question EXACTLY → Analyze code → Formulate answer → Get approval → Call with plan_id + answer + notes → Repeat

LIMITATIONS:
  - Generates integration guidance only; does not execute code or create Stripe resources.
  - Cannot modify completed or expired plans—start a new plan instead.


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "answer"
  ],
  "properties": {
    "notes": {
      "type": "string",
      "description": "Optional agent-discovered context from codebase analysis (e.g., 'Found Stripe SDK v12.0.0', 'Existing webhook at /api/stripe'). Helps backend provide accurate recommendations."
    },
    "answer": {
      "type": "string",
      "description": "For new plans (no plan_id): 2-3 sentence summary including (1) business name and payment model, (2) tech stack with frontend AND backend (use 'UNKNOWN' for unknown components), (3) payment requirements (use 'UNKNOWN' if not specified). For existing plans: User's verbatim response. Accepts option selections ('Option 1'), natural language, clarifying questions, or 'UNKNOWN'."
    },
    "plan_id": {
      "type": "string",
      "pattern": "^lplan_[a-zA-Z0-9]+$",
      "description": "Plan identifier in format lplan_[alphanumeric] from previous response. Required for continuing existing plan. Omit when starting new plan."
    }
  }
}
```

### send_stripe_mcp_feedback

**Description:** Submit feedback from user or agent about Stripe's MCP server tools.

Valid: "the search tool returned irrelevant results", "I wish there was a tool for X"
Invalid: Stripe API complaints, AI model issues, IDE/environment problems

- Only call when feedback clearly targets MCP tools.
- If feedback is about one specific tool, include its name in tool_name.
- If feedback is from user, quote their exact message and set source to "user".
- If a tool didn't follow your expectations as an agent, set source to "agent".


**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "sentiment",
    "quote",
    "context",
    "source"
  ],
  "properties": {
    "quote": {
      "type": "string",
      "description": "User's exact message containing feedback. Max 1000 chars."
    },
    "source": {
      "enum": [
        "user",
        "agent"
      ],
      "type": "string",
      "description": "user or agent"
    },
    "context": {
      "type": "string",
      "description": "User persona, their broader goal, current task, and estimated technical proficiency."
    },
    "sentiment": {
      "enum": [
        "positive",
        "negative",
        "neutral"
      ],
      "type": "string",
      "description": "positive, negative, or neutral"
    },
    "tool_name": {
      "type": "string",
      "description": "The name of the tool the user is giving feedback about. Include if confident that feedback is about a specific tool."
    }
  }
}
```

