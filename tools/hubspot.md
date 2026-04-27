# Tool Server: hubspot

**ID:** 38533561-b4bf-4f1c-826e-c65279ffc346

**Short Description:** Manage your Hubspot from Dreamer

## Description

View & update your Hubspot records from Dreamer

## Tools (6)

### search_crm_objects

**Description:** Purpose:
  1. Searches and retrieves actual CRM records from HubSpot based on filters and criteria.
  2. Returns a 'total' count attribute that can help perform analytical tasks on large datasets.
  3. Useful to sample data from a specific object type to understand the data model.
  4. Can list and filter by associations between objects (e.g., "contacts associated with company X or contacts with num_associated_deals > 1")
  5. Use the search_owners tool to list users/owners in the HubSpot account.

Returns: List of matching CRM records containing:
  - id: Unique identifier for the CRM object
  - properties: Key-value pairs of property names and their values for the requested properties
  - urlTemplate: URL template to view the object in HubSpot (replace {property_name} with the property value from the response)
  - total: Total count of records matching the search criteria (for analytics and pagination)
  - offset: Current pagination offset for retrieving the next page of results

Usage Guidance:
  1. This searches for ACTUAL DATA (records), not field definitions. To discover available fields, use search_properties.
  2. Always check 'total' count to ensure you're not missing data due to pagination limits. You MUST NOT use sample data or insufficient data as a substitute for actual data.
  3. Use the `get_crm_objects` without properties to understand the data model of an objectType.
  4. You can include a maximum of five filterGroups with up to 6 filters in each group, with a maximum of 18 filters in total.
  5. [Important] CRM Analysis can be a complex task. Work with the user to refine requirements and segment large datasets into manageable parts before performing analysis.
  6. [Important] You MUST include a clickable URL for every record returned, without exception. ALWAYS include UTM params in the URL.


**Input Schema:**

```json
{
  "type": "object",
  "$defs": {},
  "required": [
    "objectType"
  ],
  "properties": {
    "limit": {
      "type": "integer",
      "description": "Maximum number of results per page. Max: 200, Default: 100"
    },
    "query": {
      "type": "string",
      "description": "Optional text to search for within the default searchable properties of the specified object type.\nUses simple text matching (contains)\nEach object type has different searchable properties.\ncontacts - firstname, lastname, email, phone, company),\ncompanies - name, website, domain, phone),\ndeals - dealname, pipeline, dealstage, description, dealtype)\nticket - subject, content, hs_pipeline_stage, hs_ticket_category, hs_ticket_id)\n\nMax length - 200 chars"
    },
    "sorts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "propertyName",
          "direction"
        ],
        "properties": {
          "direction": {
            "enum": [
              "ASCENDING",
              "DESCENDING"
            ],
            "type": "string",
            "description": "The order to sort by"
          },
          "propertyName": {
            "type": "string",
            "description": "The name of the property to sort by"
          }
        },
        "additionalProperties": false
      },
      "description": "Optional sorting rules for results. Only one sort rule can be applied"
    },
    "offset": {
      "type": "integer",
      "description": "Paging cursor token for pagination"
    },
    "objectType": {
      "type": "string",
      "description": "Mandatory field specifying ObjectType to search for objects for."
    },
    "properties": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional list of property names to include in results. Returns default set if empty"
    },
    "filterGroups": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [],
        "properties": {
          "filters": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "propertyName",
                "operator"
              ],
              "properties": {
                "value": {
                  "type": "string",
                  "description": "Value parameter for single-value operators (EQ, NEQ, LT, LTE, GT, GTE, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN)"
                },
                "values": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Set of values for multi-value operators like IN and NOT_IN"
                },
                "operator": {
                  "type": "string",
                  "description": "Filter operator:\n  EQ, NEQ, LT, LTE, GT, GTE, BETWEEN, IN, NOT_IN, HAS_PROPERTY, NOT_HAS_PROPERTY, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN\nUsage:\n  No additional parameters required for HAS_PROPERTY and NOT_HAS_PROPERTY"
                },
                "highValue": {
                  "type": "string",
                  "description": "High value for range-based operators like BETWEEN"
                },
                "propertyName": {
                  "type": "string",
                  "description": "Specify the name of the Crm Object Property to filter on.\n\nAdditionally, this can also be used to search for records that are associated with other specific records by using the pseudo-property associated_{objectType}.\nFor example, the request below searches for all records associated with a contact that has the contact ID of 123:\n {\n   \"propertyName\": \"associated_contacts\",\n   \"operator\": \"EQ\",\n   \"value\": \"123\"\n }\noperation \"IN\" can also be used to filter by multiple associated records:\n\nYou can also use the following properties to filter by the number of associated records:\n\nTickets - hs_num_associated_companies\nCompanies - num_associated_contacts, num_associated_deals\nContacts - num_associated_deals\nDeals - num_associated_contacts"
                }
              },
              "description": " Represents a filter condition for CRM object searches.\n Filters specify criteria that property values must meet to be included in search results.\n The available operators are defined in {@link PropertyFilterOperator}.\n",
              "additionalProperties": false
            },
            "description": "Set of filters in this group. All filters combined with logical AND"
          }
        },
        "description": " Represents a group of filters that are logically connected with AND operators.\n Multiple filter groups in a search request are combined with OR operators.\n",
        "additionalProperties": false
      },
      "description": "* The filter groups that define the search criteria.\n * Filters that match ALL of several conditions (AND logic) should be put in the same filterGroup.\n * Filters that match AT LEAST ONE of several conditions (OR logic) should be put in a separate filterGroup."
    }
  },
  "definitions": {},
  "additionalProperties": false
}
```

### get_properties

**Description:** Purpose:
  1. Fetches detailed property definitions (what fields exist) including data types, enumeration values for HubSpot CRM object properties.
  2. Particularly useful for discovering valid options in enumeration-type properties.
  3. To search for actual data, use search_crm_objects.

Returns: List of property definition objects containing:
- name: Property identifier
- label: Display label
- description: Property description
- type: Data type (string, enumeration, number, etc.)
- options: For enumeration types, list of valid values with labels

Usage Guidance:
  1. Property details can be unexpectedly large. Consider fetching in batches.
     It's not advised to pass an objects full list of properties into this tool.


**Input Schema:**

```json
{
  "type": "object",
  "$defs": {},
  "required": [
    "objectType"
  ],
  "properties": {
    "objectType": {
      "type": "string",
      "description": "The object type to get properties for. e.g., contacts, companies, deals, tickets, etc."
    },
    "propertyNames": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "The set of property names to retrieve"
    }
  },
  "definitions": {},
  "additionalProperties": false
}
```

### get_crm_objects

**Description:** Purpose: Fetches multiple CRM objects of the same object type in a single request.

Returns: A list of CRM objects with their properties, identified by their unique IDs, containing:
- id: Unique identifier for the CRM object
- properties: Key-value pairs of property names and their values
- createdAt: Timestamp when the object was created
- updatedAt: Timestamp when the object was last updated
- url: URL to view the object in HubSpot

Usage Guidance:
  1. Use the `search_crm_objects` tool to list a few objects first without a filter criteria.
  2. Then use the `get_crm_objects` tool to retrieve those objects by their IDs without any properties in the tool input to understand the data model.
  3. This will help you understand the structure of the objects and their properties.


**Input Schema:**

```json
{
  "type": "object",
  "$defs": {},
  "required": [
    "objectType"
  ],
  "properties": {
    "objectIds": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "List of object IDs to fetch. Min: 1, Max: 100"
    },
    "objectType": {
      "type": "string",
      "description": "Object type to fetch"
    },
    "properties": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of CRM Properties to include in the response"
    }
  },
  "definitions": {},
  "additionalProperties": false
}
```

### search_owners

**Description:** Purpose:
  1. Lists and searches for owners (users who can be assigned to CRM records) in a HubSpot account.
  2. Supports searching by name/email or batch lookup by owner IDs.

  HubSpot owner ids and user IDs are distinct, lookups only work when owner ids are provided specifically

Returns: List of owner objects containing:
- ownerId: The ID to use for hubspot_owner_id assignments
- name: Display name of the owner
- isActive: Whether the owner is currently active

Examples:
- Search by name: `{"searchQuery": "John Smith"}`
- Lookup specific IDs: `{"ownerIds": [12345, 67890]}`
- Paginate results: `{"limit": 50, "offset": 50}`


**Input Schema:**

```json
{
  "type": "object",
  "$defs": {},
  "required": [],
  "properties": {
    "limit": {
      "type": "integer",
      "description": "Maximum number of results to return. Defaults to 25, max 100"
    },
    "offset": {
      "type": "integer",
      "description": "Offset for pagination. Defaults to 0"
    },
    "ownerIds": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Optional list of owner IDs to lookup directly. When provided, search query is ignored"
    },
    "searchQuery": {
      "type": "string",
      "description": "Optional search query to find owners by name or email. Returns all owners if not provided"
    }
  },
  "definitions": {},
  "additionalProperties": false
}
```

### search_properties

**Description:**   Purpose:
    1. Finds the most relevant CRM property definitions using efficient keyword-based search optimized for <1.5s response times.
    2. Lists all property definitions for specified object type when no search terms provided.
    3. To search for actual data, use search_crm_objects
  Returns: A filtered list of properties matching the search criteria containing:
  - name: Property identifier
  - label: Display label
  - description: Property description
  - matchScore: Relevance score for the property based on the search query (absent if no query is provided)
  Usage Guidance:
    1. Use keywords field for multiple related property guesses in a SINGLE request (recommended for performance)
    2. MAXIMUM OF 5 KEYWORDS ALLOWED PER REQUEST - exceeding this limit will return a validation error
    3. Keywords should be property name guesses, not natural language phrases
    4. Use query field for backward compatibility with single property guess
    5. No search terms provided: Returns ALL properties for the object type (useful for discovery)
  Examples:
  - User Input: "total number of open tickets grouped by urgency"
    Thoughts: Customer is asking for total number of open tickets grouped by "urgency". I will look for the best matches on the "urgency" property for the "TICKET" object type.
    Property Search Query:
    - `{
        "objectType": "TICKET",
        "keywords": ["urgency"]
      }`
  - User Input: "calls assigned to me"
    Thoughts: Customer is asking us to filter by calls assigned to them. I have a few guesses for what that property might be called: "assigned_to", "assignee", "owned_by", or "owner". Let me search for those on the "CALL" object type in one efficient request.
    Property Search Query:
    - `{
        "objectType": "CALL",
        "keywords": ["assignee", "assigned_to", "call_owner", "owned_by"]
      }`
  - User Input: "list each company with its name, employees amount, zip code, and when we last touched base"
    Thoughts: Customer is asking us to list companies by a few attributes. I will guess keywords for each of those properties and search for them on the "COMPANY" object type in one request.
    Property Search Query:
    - `{
        "objectType": "COMPANY",
        "keywords": ["name", "employees", "zip_code", "last_contact"]
      }`
  - User Input: "tickets for this year to identify top 10 most problems our customers face"
    Thoughts: Customer is asking us to analyze tickets. I will return all properties for the "TICKET" object type to help with discovery.
    Property Search Query:
    - `{
        "objectType": "TICKET"
      }`
  Common Mistakes:
  - Do not exceed 5 keywords per request (will return validation error)
  - Keywords should be property name guesses, not natural language phrases


**Input Schema:**

```json
{
  "type": "object",
  "$defs": {},
  "required": [
    "objectType"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "DEPRECATED: Use keywords instead.\nSingle search keyword for backward compatibility.\nIf both query and keywords are provided, keywords takes precedence.\nIf empty and no keywords provided, returns all properties for the object type."
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Multiple search keywords (max 5) to find relevant properties using efficient keyword-based search.\nSupports searching for multiple related property concepts in a single request.\n\nExamples:\n- [\"urgency\"] - Single keyword search\n- [\"assignee\", \"assigned_to\", \"owner\"] - Multiple related keywords for assignment\n- [\"name\", \"employees\", \"zip\", \"contact\"] - Multiple unrelated keywords for different properties\n\nIf both query and keywords are provided, keywords takes precedence.\nIf empty and no query provided, returns all properties for the object type."
    },
    "objectType": {
      "type": "string",
      "description": "The name of the object type to search properties for"
    }
  },
  "definitions": {},
  "additionalProperties": false
}
```

### get_user_details

**Description:** Purpose
  1. Analyzes the current HubSpot access token, providing context about the user's permissions and account details.

Usage Guidance:
  1. This tool must be used before performing any operations with Hubspot tools to determine the identity of the user, and permissions they have on their Hubspot account.
  2. This tool only return information for the current user. Search for "users" objectType using the search_crm_objects tool to find other users/owners in the HubSpot account.
  3. This tool provides the availability of crm object types to the current user. Use these values in tools which expect crm object type parameters.
  4. This tool provides more accurate availability of the other tools provided by this MCP service. This is critical when tool returned in the response is not `AVAILABLE`.
  5. Every non `AVAILABLE` object type or tool requires some user interaction to resolve, noting that some issues cannot be resolved by just the user themselves.

Availability Guidance:
  1. If an object or tool returns `AVAILABLE`, it is free to use without issue.
  2. If it returns `REQUIRES_REAUTHORIZATION`, the user needs to perform a new authorization flow through HubSpot to unlock new access.
     This is possible through disconnecting and reconnecting the HubSpot connector through their settings.
  3. If it returns `REQUIRES_PERMISSION_MODIFICATION`, the user lacks the correct permission in their HubSpot account.
     If the only way to resolve a task is to use this tool or object, you should inform the user of their lacking permissions and let them decide if they want to ask their administrator for more privilege.
  4. If it returns `REQUIRES_ACCOUNT_MODIFICATION`, the whole HubSpot account lacks the correct permissions and would require an account upgrade.
     Again, inform the user about these tools or objects only if the presented task can only be solved using them.
  5. If it returns `BLOCKED_FOR_PORTALS_WITH_SENSITIVE_DATA`, the operation involves sensitive data, and no troubleshooting will unblock usage of the object or tool.
     If the only way to resolve a task is to use this tool or object, inform the user of the issue and ask them how they would like to proceed.
  6. If it returns `REQUIRES_OPTIN`, give the users the instructions in the potentialTools section of the response for how to opt in.

Returns:
  1. User ID, Hub ID, App ID, token type, detailed owner information, and account information.
  2. A mapping of crm object type to current availability
  3. A mapping of other mcp tools to current availability
  4. The uiDomain and hubId can be used to construct URLs to the HubSpot UI for the user.
  5. If the user is an owner, the ownerId will help identify objects that are owned by the user.


**Input Schema:**

```json
{
  "type": "object",
  "$defs": {},
  "required": [],
  "properties": {},
  "definitions": {},
  "additionalProperties": false
}
```

