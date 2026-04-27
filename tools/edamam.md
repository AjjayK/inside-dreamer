# Tool Server: edamam

**ID:** 62d893d6-9f37-4ba4-9905-39a34a48f775

**Short Description:** Food/nutrition data for use across Sidekick & agents

## Description

Use Edamam to search foods, fetch nutrition, and analyze food recipes.

## Tools (4)

### searchFood

**Description:** Search for foods in the Edamam Food Database. Returns food items with their IDs, labels, basic nutrients (calories, protein, fat, carbs), and available measures (serving sizes like 'cup', 'tablespoon', 'gram'). Use the returned foodId with getNutrition for detailed nutritional breakdown.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "The food item to search for (e.g., 'apple', 'chicken breast', 'brown rice', 'cheddar cheese')"
    },
    "category": {
      "enum": [
        "generic-foods",
        "generic-meals",
        "packaged-foods",
        "fast-foods"
      ],
      "type": "string",
      "description": "Filter by food category. Options: 'generic-foods' (whole foods like fruits, vegetables), 'generic-meals' (prepared dishes), 'packaged-foods' (branded/packaged items), 'fast-foods' (restaurant items)"
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
    "success",
    "fetchedAt"
  ],
  "properties": {
    "count": {
      "type": "number"
    },
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
    "foods": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "foodId",
          "label"
        ],
        "properties": {
          "brand": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "foodId": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "measures": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "uri",
                "label"
              ],
              "properties": {
                "uri": {
                  "type": "string"
                },
                "label": {
                  "type": "string"
                },
                "weight": {
                  "type": "number"
                }
              },
              "additionalProperties": false
            }
          },
          "nutrients": {
            "type": "object",
            "additionalProperties": {
              "type": "number"
            }
          },
          "categoryLabel": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "query": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getNutrition

**Description:** Get detailed nutritional information for a specific food item and quantity. Requires a foodId from searchFood. Returns comprehensive nutrition data including calories, macronutrients (protein, fat, carbs, fiber, sugar), micronutrients (vitamins, minerals), cholesterol, sodium, and daily value percentages. Also includes diet labels (e.g., 'Low-Carb') and health labels (e.g., 'Gluten-Free').

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "foodId"
  ],
  "properties": {
    "foodId": {
      "type": "string",
      "description": "The foodId from a searchFood result. This is a unique identifier like 'food_a1gb9ubb72c7snbuxr3weagwv0dd'. Get this by first calling searchFood."
    },
    "quantity": {
      "type": "number",
      "default": 100,
      "description": "The quantity of the measure unit. For example, quantity=2 with a 'cup' measure means '2 cups'. Default: 100 (typically used with grams)."
    },
    "measureUri": {
      "type": "string",
      "description": "The measure URI from searchFood results specifying the serving unit. Examples: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram' for grams, or use URIs from the 'measures' array in searchFood results for units like 'cup', 'tablespoon', 'slice'. Defaults to grams if not provided."
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
    "success",
    "fetchedAt"
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
    "foodId": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "summary": {
      "type": "object",
      "properties": {
        "fat": {
          "type": "number"
        },
        "carbs": {
          "type": "number"
        },
        "fiber": {
          "type": "number"
        },
        "sugar": {
          "type": "number"
        },
        "sodium": {
          "type": "number"
        },
        "protein": {
          "type": "number"
        },
        "calories": {
          "type": "number"
        },
        "cholesterol": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "calories": {
      "type": "number"
    },
    "cautions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "quantity": {
      "type": "number"
    },
    "fetchedAt": {
      "type": "string"
    },
    "dietLabels": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "totalDaily": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/properties/totalNutrients/additionalProperties"
      }
    },
    "totalWeight": {
      "type": "number"
    },
    "healthLabels": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "totalNutrients": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "unit": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### analyzeRecipe

**Description:** Analyze a recipe or ingredient list to get complete nutritional breakdown using natural language processing. Returns total and per-serving nutrition (calories, protein, fat, carbs, fiber, sugar, sodium), diet labels (e.g., 'High-Protein', 'Low-Fat'), health labels (e.g., 'Vegetarian', 'Gluten-Free'), allergen cautions, and parsed ingredient details. Ideal for meal planning, calorie tracking, and dietary analysis.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ingredients"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Name of the recipe (optional, but helpful for reference)"
    },
    "servings": {
      "type": "number",
      "description": "Number of servings the recipe makes. If provided, per-serving nutrition will be calculated."
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of ingredient strings in natural language. Each string should include quantity, unit, and ingredient name. Examples: ['2 cups all-purpose flour', '1/2 cup unsalted butter, softened', '3 large eggs', '1 tsp vanilla extract', '200g chicken breast', '1 medium onion, diced']. The API uses NLP to parse these."
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
    "success",
    "fetchedAt"
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
    "title": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "summary": {
      "type": "object",
      "properties": {
        "fat": {
          "type": "number"
        },
        "carbs": {
          "type": "number"
        },
        "fiber": {
          "type": "number"
        },
        "sugar": {
          "type": "number"
        },
        "sodium": {
          "type": "number"
        },
        "protein": {
          "type": "number"
        },
        "calories": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "calories": {
      "type": "number"
    },
    "cautions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "servings": {
      "type": "number"
    },
    "fetchedAt": {
      "type": "string"
    },
    "dietLabels": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "perServing": {
      "type": "object",
      "properties": {
        "fat": {
          "type": "number"
        },
        "carbs": {
          "type": "number"
        },
        "protein": {
          "type": "number"
        },
        "calories": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "totalDaily": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/properties/totalNutrients/additionalProperties"
      }
    },
    "ingredients": {
      "type": "array",
      "items": {}
    },
    "totalWeight": {
      "type": "number"
    },
    "healthLabels": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "totalNutrients": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "unit": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### searchRecipes

**Description:** Search Edamam's database of millions of web recipes. Returns recipe details including title, source URL, image, ingredients list, nutritional info, and cooking time. Filter by diet type, health/allergy restrictions, cuisine, meal type, and calorie range.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "diet": {
      "enum": [
        "balanced",
        "high-protein",
        "high-fiber",
        "low-fat",
        "low-carb",
        "low-sodium"
      ],
      "type": "string",
      "description": "Diet type filter. Options: 'balanced' (protein/fat/carbs balanced), 'high-protein', 'high-fiber', 'low-fat', 'low-carb', 'low-sodium'"
    },
    "query": {
      "type": "string",
      "description": "Recipe search query. Examples: 'chicken pasta', 'vegan chocolate cake', 'quick weeknight dinner', 'low carb breakfast'"
    },
    "health": {
      "type": "array",
      "items": {
        "enum": [
          "alcohol-free",
          "celery-free",
          "dairy-free",
          "egg-free",
          "fish-free",
          "gluten-free",
          "keto-friendly",
          "kidney-friendly",
          "kosher",
          "low-sugar",
          "paleo",
          "peanut-free",
          "pescatarian",
          "pork-free",
          "shellfish-free",
          "soy-free",
          "tree-nut-free",
          "vegan",
          "vegetarian",
          "wheat-free"
        ],
        "type": "string"
      },
      "description": "Health and allergy filters (can specify multiple). Options: 'vegan', 'vegetarian', 'pescatarian', 'paleo', 'keto-friendly', 'gluten-free', 'dairy-free', 'egg-free', 'peanut-free', 'tree-nut-free', 'soy-free', 'fish-free', 'shellfish-free', 'wheat-free', 'alcohol-free', 'celery-free', 'pork-free', 'kosher', 'kidney-friendly', 'low-sugar'"
    },
    "calories": {
      "type": "string",
      "description": "Calorie range per serving. Format: 'MIN-MAX' (e.g., '100-500' for 100-500 kcal). Can also use just max: '500' for under 500 kcal."
    },
    "mealType": {
      "enum": [
        "breakfast",
        "brunch",
        "lunch",
        "dinner",
        "snack",
        "teatime"
      ],
      "type": "string",
      "description": "Meal type filter. Options: 'breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'teatime'"
    },
    "maxResults": {
      "type": "number",
      "default": 10,
      "description": "Maximum number of recipes to return (1-20). Default: 10"
    },
    "cuisineType": {
      "enum": [
        "american",
        "asian",
        "british",
        "caribbean",
        "central europe",
        "chinese",
        "eastern europe",
        "french",
        "greek",
        "indian",
        "italian",
        "japanese",
        "korean",
        "kosher",
        "mediterranean",
        "mexican",
        "middle eastern",
        "nordic",
        "south american",
        "south east asian",
        "world"
      ],
      "type": "string",
      "description": "Cuisine type filter. Options: 'american', 'asian', 'british', 'caribbean', 'central europe', 'chinese', 'eastern europe', 'french', 'greek', 'indian', 'italian', 'japanese', 'korean', 'kosher', 'mediterranean', 'mexican', 'middle eastern', 'nordic', 'south american', 'south east asian', 'world'"
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
    "success",
    "fetchedAt"
  ],
  "properties": {
    "count": {
      "type": "number"
    },
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
    "query": {
      "type": "string"
    },
    "recipes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "label"
        ],
        "properties": {
          "image": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "source": {
            "type": "string"
          },
          "calories": {
            "type": "number"
          },
          "dishType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "mealType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "servings": {
            "type": "number"
          },
          "nutrients": {
            "type": "object",
            "properties": {
              "fat": {
                "$ref": "#/properties/recipes/items/properties/nutrients/properties/protein"
              },
              "carbs": {
                "$ref": "#/properties/recipes/items/properties/nutrients/properties/protein"
              },
              "fiber": {
                "$ref": "#/properties/recipes/items/properties/nutrients/properties/protein"
              },
              "protein": {
                "type": "object",
                "properties": {
                  "unit": {
                    "type": "string"
                  },
                  "label": {
                    "type": "string"
                  },
                  "quantity": {
                    "type": "number"
                  }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
          },
          "sourceUrl": {
            "type": "string"
          },
          "totalTime": {
            "type": "number"
          },
          "dietLabels": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "cuisineType": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "healthLabels": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "ingredientLines": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "caloriesPerServing": {
            "type": "number"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "totalResults": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

