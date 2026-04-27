# Tool Server: instacart

**ID:** 80957784-0732-4b26-a184-1513736c61d0

**Short Description:** Shopping with Instacart

## Description

Manage your shopping list on Instacart

## Tools (2)

### create-recipe

**Description:** Create a recipe page on Instacart Marketplace

Note: Quantities specified are approximate and may be interpreted differently by Instacart. Users should review their Instacart cart to confirm quantities and make any necessary adjustments before checkout.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "title",
    "ingredients"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the recipe (required)"
    },
    "author": {
      "type": "string",
      "description": "Author of the recipe"
    },
    "servings": {
      "type": "number",
      "description": "Number of servings the recipe makes"
    },
    "image_url": {
      "type": "string",
      "description": "URL of the recipe image (500x500 pixels)"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the ingredient (required)"
          },
          "unit": {
            "type": "string",
            "description": "Unit of measurement (e.g., cup, tablespoon, ounce)"
          },
          "quantity": {
            "type": "number",
            "description": "Quantity of the ingredient"
          },
          "displayText": {
            "type": "string",
            "description": "Optional display text for the ingredient"
          }
        },
        "additionalProperties": false
      },
      "minItems": 1,
      "description": "List of ingredients (at least one required)"
    },
    "cooking_time": {
      "type": "number",
      "description": "Cooking time in minutes"
    },
    "instructions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of instructions for preparing the recipe"
    }
  },
  "additionalProperties": false
}
```

### create-shopping-list

**Description:** Create a shopping list page on Instacart Marketplace

Note: Quantities specified are approximate and may be interpreted differently by Instacart. Users should review their Instacart cart to confirm quantities and make any necessary adjustments before checkout.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "title",
    "lineItems"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the shopping list (required)"
    },
    "image_url": {
      "type": "string",
      "description": "URL of the shopping list image (500x500 pixels)"
    },
    "lineItems": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the line item (required)"
          },
          "unit": {
            "type": "string",
            "description": "Unit of measurement (e.g., cup, tablespoon, ounce). If not provided, the line item will not be added to the shopping list."
          },
          "quantity": {
            "type": "number",
            "description": "Quantity of the line item. If not provided, the line item will not be added to the shopping list."
          },
          "displayText": {
            "type": "string",
            "description": "Optional display text for the line item"
          }
        },
        "additionalProperties": false
      },
      "minItems": 1,
      "description": "List of line items (at least one required)"
    },
    "expires_in": {
      "type": "number",
      "description": "Number of days the shopping list expires in. If not provided, the shopping list will never expire."
    },
    "instructions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of instructions for preparing the shopping list"
    },
    "landingPageConfiguration": {
      "type": "object",
      "properties": {
        "enablePantryItems": {
          "type": "boolean",
          "description": "Enable pantry items. Items identified as a pantry item will not be automatically added to the shopping list."
        },
        "partnerLinkbackUrl": {
          "type": "string",
          "description": "URL of the partner linkback"
        }
      },
      "description": "The configuration for the landing page",
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

