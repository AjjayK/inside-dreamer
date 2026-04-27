# Tool Server: trivago

**ID:** cfd42b6e-f8da-4ff1-b88a-9bc3a412014e

**Short Description:** Find your ideal hotel at the best price.

## Description

Hotel & destination search, from trivago

## Tools (3)

### trivago-accommodation-radius-search

**Description:** 
		Search for accommodations and hotels using a coordinates and radius on Trivago.

		Use this tool when you want to find accommodations near a specific location or street.

		Additional Information: 
		{
		"knownInformation": {
			"currentYear": "2026",
			"today": "2026-02-26"
		}
		}
		
		

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "radius",
    "latitude",
    "longitude",
    "arrival",
    "departure"
  ],
  "properties": {
    "rooms": {
      "type": "number",
      "minimum": 1,
      "description": "\n\t\tThe number of rooms, Number of rooms must be lower than or equal to the number of adults\n\t"
    },
    "adults": {
      "type": "number",
      "minimum": 1,
      "description": "\n\t\tThe number of adults.\n\t"
    },
    "radius": {
      "type": "number",
      "description": "\n\t\tThe radius in meters that you want to search for.\n\t\t"
    },
    "arrival": {
      "type": "string",
      "description": "\n\t\tThe arrival date in YYYY-MM-DD format, today is 2026-02-26.\n\n\t\tThe arrival date MUST be before the departure date. If the arrival date is not in the future, notify the user that the arrival date is not in the future.\n\t\t"
    },
    "filters": {
      "type": "object",
      "properties": {
        "gym": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a gym"
        },
        "spa": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a spa"
        },
        "pool": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a pool"
        },
        "kitchen": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a kitchen"
        },
        "parking": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has parking"
        },
        "freeWiFi": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has free WiFi"
        },
        "petFriendly": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation is pet friendly"
        },
        "airConditioning": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has air conditioning"
        },
        "freeCancellation": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has free cancellation"
        },
        "breakfastIncluded": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation includes breakfast"
        }
      },
      "description": "\n\t\tThe filters that you want to apply to the search.\n\t\tSet true or false for each filter.\n\t\tMultiple filters can be selected.\n\t\t"
    },
    "children": {
      "type": "number",
      "minimum": 0,
      "description": "\n\t\tThe number of children.\n\t"
    },
    "latitude": {
      "type": "number",
      "description": "\n\t\tThe latitude of the location that you want to search for.\n\t\t"
    },
    "departure": {
      "type": "string",
      "description": "\n\t\tThe departure date in YYYY-MM-DD format, today is 2026-02-26.\n\n\t\tThe departure date MUST be after the arrival date. If the departure date is not after the arrival date, notify the user that the departure date is not after the arrival date.\n\t\t"
    },
    "longitude": {
      "type": "number",
      "description": "\n\t\tThe longitude of the location that you want to search for.\n\t\t"
    },
    "hotel_rating": {
      "type": "object",
      "properties": {
        "1star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 1 star rating"
        },
        "2star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 2 star rating"
        },
        "3star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 3 star rating"
        },
        "4star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 4 star rating"
        },
        "5star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 5 star rating"
        }
      },
      "description": "\n\t\tThe hotel rating that you want to filter by.\n\t\tSet true or false for each rating.\n\t\tMultiple ratings can be selected.\n\t"
    },
    "children_ages": {
      "type": "string",
      "description": "\n\t\tDashed separated list of children ages, e.g. 10-12-14\n\t"
    },
    "review_rating": {
      "type": "object",
      "properties": {
        "rating70": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 7.0+"
        },
        "rating75": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 7.5+"
        },
        "rating80": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 8.0+"
        },
        "rating85": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 8.5+"
        }
      },
      "description": "\n\t\tThe guest review rating that you want to filter by.\n\t\tSet true or false for each rating.\n\t\tMultiple ratings can be selected.\n\t"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "required": [
    "accommodations"
  ],
  "properties": {
    "error": {
      "type": "string",
      "description": "The error if the tool failed to execute."
    },
    "accommodations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "accommodation_id",
          "arrival",
          "departure",
          "accommodation_name",
          "address",
          "postal_code",
          "currency",
          "price_per_night",
          "price_per_stay",
          "advertisers",
          "hotel_rating",
          "country_city",
          "review_rating",
          "top_amenities",
          "accommodation_url",
          "latitude",
          "longitude",
          "distance",
          "distance_to_city_center",
          "main_image"
        ],
        "properties": {
          "address": {
            "type": "string",
            "description": "Street address of the accommodation."
          },
          "arrival": {
            "type": "string",
            "description": "Arrival date in YYYY-MM-DD format."
          },
          "currency": {
            "type": "string",
            "description": "Currency of the price."
          },
          "distance": {
            "type": "string",
            "description": "Human-readable distance label."
          },
          "latitude": {
            "type": "number",
            "description": "Latitude coordinate of the accommodation."
          },
          "departure": {
            "type": "string",
            "description": "Departure date in YYYY-MM-DD format."
          },
          "longitude": {
            "type": "number",
            "description": "Longitude coordinate of the accommodation."
          },
          "main_image": {
            "type": "string",
            "description": "URL of the main image of the accommodation."
          },
          "advertisers": {
            "type": "string",
            "description": "Name of the advertiser/booking provider."
          },
          "booking_url": {
            "type": "string",
            "description": "Direct URL to book the accommodation."
          },
          "postal_code": {
            "type": "string",
            "description": "Postal code of the accommodation."
          },
          "country_city": {
            "type": "string",
            "description": "Country and city location label."
          },
          "hotel_rating": {
            "type": "integer",
            "description": "Hotel star classification rating."
          },
          "review_rating": {
            "type": "string",
            "description": "Formatted guest review rating."
          },
          "top_amenities": {
            "type": "string",
            "description": "Comma-separated list of top amenities."
          },
          "price_per_stay": {
            "type": "string",
            "description": "Formatted price per stay."
          },
          "price_per_night": {
            "type": "string",
            "description": "Formatted price per night."
          },
          "accommodation_id": {
            "type": "string",
            "description": "Unique identifier for the accommodation."
          },
          "accommodation_url": {
            "type": "string",
            "description": "URL to the accommodation page on Trivago."
          },
          "accommodation_name": {
            "type": "string",
            "description": "Name of the accommodation."
          },
          "distance_to_city_center": {
            "type": "object",
            "required": [
              "value",
              "unit"
            ],
            "properties": {
              "unit": {
                "type": "string",
                "description": "The unit of the distance to the city center."
              },
              "value": {
                "type": "number",
                "description": "The distance value to the city center."
              }
            },
            "description": "Distance to the city center with value and unit."
          }
        }
      },
      "description": "The list of accommodations."
    },
    "system_message": {
      "type": "string",
      "description": "The system message to AI/LLM to understand the task that you must to do."
    },
    "validation_errors": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "message",
          "argument",
          "value"
        ],
        "properties": {
          "value": {
            "type": "string",
            "description": "The value that caused the error."
          },
          "message": {
            "type": "string",
            "description": "The error message."
          },
          "argument": {
            "type": "string",
            "description": "The argument that caused the error."
          }
        }
      },
      "description": "The validation errors if the tool failed to execute."
    }
  }
}
```

### trivago-accommodation-search

**Description:** 
		Search for accommodations and hotels on Trivago.

		Use this tool when you want to find accommodations in broader areas like cities, countries, etc.

		If you are interested in a specific location, use the trivago-accommodation-radius-search tool.

		Additional Information: 
		{
		"knownInformation": {
			"currentYear": "2026",
			"today": "2026-02-26"
		}
		}
		
		

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "ns",
    "id",
    "arrival",
    "departure"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "\n\t\tThe ID of the location that you want to search for.\n\t\t"
    },
    "ns": {
      "type": "number",
      "description": "\n\t\tThe NS of the location that you want to search for.\n\t\t"
    },
    "rooms": {
      "type": "number",
      "minimum": 1,
      "description": "\n\t\tThe number of rooms, Number of rooms must be lower than or equal to the number of adults\n\t"
    },
    "adults": {
      "type": "number",
      "minimum": 1,
      "description": "\n\t\tThe number of adults.\n\t"
    },
    "arrival": {
      "type": "string",
      "description": "\n\t\tThe arrival date in YYYY-MM-DD format, today is 2026-02-26.\n\n\t\tThe arrival date MUST be before the departure date. If the arrival date is not in the future, notify the user that the arrival date is not in the future.\n\t\t"
    },
    "filters": {
      "type": "object",
      "properties": {
        "gym": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a gym"
        },
        "spa": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a spa"
        },
        "pool": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a pool"
        },
        "kitchen": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a kitchen"
        },
        "parking": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has parking"
        },
        "freeWiFi": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has free WiFi"
        },
        "petFriendly": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation is pet friendly"
        },
        "airConditioning": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has air conditioning"
        },
        "freeCancellation": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has free cancellation"
        },
        "breakfastIncluded": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation includes breakfast"
        }
      },
      "description": "\n\t\tThe filters that you want to apply to the search.\n\t\tSet true or false for each filter.\n\t\tMultiple filters can be selected.\n\t\t"
    },
    "children": {
      "type": "number",
      "minimum": 0,
      "description": "\n\t\tThe number of children.\n\t"
    },
    "departure": {
      "type": "string",
      "description": "\n\t\tThe departure date in YYYY-MM-DD format, today is 2026-02-26.\n\n\t\tThe departure date MUST be after the arrival date. If the departure date is not after the arrival date, notify the user that the departure date is not after the arrival date.\n\t\t"
    },
    "hotel_rating": {
      "type": "object",
      "properties": {
        "1star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 1 star rating"
        },
        "2star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 2 star rating"
        },
        "3star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 3 star rating"
        },
        "4star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 4 star rating"
        },
        "5star": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a 5 star rating"
        }
      },
      "description": "\n\t\tThe hotel rating that you want to filter by.\n\t\tSet true or false for each rating.\n\t\tMultiple ratings can be selected.\n\t"
    },
    "children_ages": {
      "type": "string",
      "description": "\n\t\tDashed separated list of children ages, e.g. 10-12-14\n\t"
    },
    "review_rating": {
      "type": "object",
      "properties": {
        "rating70": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 7.0+"
        },
        "rating75": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 7.5+"
        },
        "rating80": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 8.0+"
        },
        "rating85": {
          "type": "boolean",
          "default": false,
          "description": "Whether the accommodation has a Guest Rating of 8.5+"
        }
      },
      "description": "\n\t\tThe guest review rating that you want to filter by.\n\t\tSet true or false for each rating.\n\t\tMultiple ratings can be selected.\n\t"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "required": [
    "accommodations"
  ],
  "properties": {
    "error": {
      "type": "string",
      "description": "The error if the tool failed to execute."
    },
    "accommodations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "accommodation_id",
          "arrival",
          "departure",
          "accommodation_name",
          "address",
          "postal_code",
          "currency",
          "price_per_night",
          "price_per_stay",
          "advertisers",
          "hotel_rating",
          "country_city",
          "review_rating",
          "top_amenities",
          "accommodation_url",
          "latitude",
          "longitude",
          "distance",
          "distance_to_city_center",
          "main_image"
        ],
        "properties": {
          "address": {
            "type": "string",
            "description": "Street address of the accommodation."
          },
          "arrival": {
            "type": "string",
            "description": "Arrival date in YYYY-MM-DD format."
          },
          "currency": {
            "type": "string",
            "description": "Currency of the price."
          },
          "distance": {
            "type": "string",
            "description": "Human-readable distance label."
          },
          "latitude": {
            "type": "number",
            "description": "Latitude coordinate of the accommodation."
          },
          "departure": {
            "type": "string",
            "description": "Departure date in YYYY-MM-DD format."
          },
          "longitude": {
            "type": "number",
            "description": "Longitude coordinate of the accommodation."
          },
          "main_image": {
            "type": "string",
            "description": "URL of the main image of the accommodation."
          },
          "advertisers": {
            "type": "string",
            "description": "Name of the advertiser/booking provider."
          },
          "booking_url": {
            "type": "string",
            "description": "Direct URL to book the accommodation."
          },
          "postal_code": {
            "type": "string",
            "description": "Postal code of the accommodation."
          },
          "country_city": {
            "type": "string",
            "description": "Country and city location label."
          },
          "hotel_rating": {
            "type": "integer",
            "description": "Hotel star classification rating."
          },
          "review_rating": {
            "type": "string",
            "description": "Formatted guest review rating."
          },
          "top_amenities": {
            "type": "string",
            "description": "Comma-separated list of top amenities."
          },
          "price_per_stay": {
            "type": "string",
            "description": "Formatted price per stay."
          },
          "price_per_night": {
            "type": "string",
            "description": "Formatted price per night."
          },
          "accommodation_id": {
            "type": "string",
            "description": "Unique identifier for the accommodation."
          },
          "accommodation_url": {
            "type": "string",
            "description": "URL to the accommodation page on Trivago."
          },
          "accommodation_name": {
            "type": "string",
            "description": "Name of the accommodation."
          },
          "distance_to_city_center": {
            "type": "object",
            "required": [
              "value",
              "unit"
            ],
            "properties": {
              "unit": {
                "type": "string",
                "description": "The unit of the distance to the city center."
              },
              "value": {
                "type": "number",
                "description": "The distance value to the city center."
              }
            },
            "description": "Distance to the city center with value and unit."
          }
        }
      },
      "description": "The list of accommodations."
    },
    "system_message": {
      "type": "string",
      "description": "The system message to AI/LLM to understand the task that you must to do."
    },
    "validation_errors": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "message",
          "argument",
          "value"
        ],
        "properties": {
          "value": {
            "type": "string",
            "description": "The value that caused the error."
          },
          "message": {
            "type": "string",
            "description": "The error message."
          },
          "argument": {
            "type": "string",
            "description": "The argument that caused the error."
          }
        }
      },
      "description": "The validation errors if the tool failed to execute."
    }
  }
}
```

### trivago-search-suggestions

**Description:** 

	Suggestions are used to provide a list of possible search terms based on the user's query.

	Query can be city, country.

	You must pick output that are close to the user query.

	Example:
	Input:
		Query: "Berlin"
		Query: "Germany"
	

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
      "description": "\n\t\tThe query to search for suggestions.\n\n\t\tQuery must be city, country.\n\n\t\tif you know geolocation, you can use radius search tool to find accommodations near the location.\n\n\t\tif query or the location is ambiguous, clarify the query or location by asking the user for more information.\n\n\t\tWhen user ask for a query, you must follow these steps. If each step is not successful, try the next step:\n\t\t   1. first try to use query as it is\n\t\t   2. MUST find the city of the query by using internet search, use MUST the city to search for suggestions\n\t\t   3. MUST find the country of the query by using internet search, use MUST the country to search for suggestions\n\t"
    }
  }
}
```

**Output Schema:**

```json
{
  "type": "object",
  "required": [
    "suggestions"
  ],
  "properties": {
    "error": {
      "type": "string",
      "description": "The error message if the tool failed to execute."
    },
    "suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "suggestion_type",
          "location",
          "location_type"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "description": "The ID of the suggestion. It's used to search for the accommodation."
          },
          "ns": {
            "type": "integer",
            "description": "The NS of the suggestion. It's used to search for the accommodation."
          },
          "location": {
            "type": "string",
            "description": "The location of the suggestion."
          },
          "place_id": {
            "type": "string",
            "description": "The place ID of the suggestion."
          },
          "location_type": {
            "type": "string",
            "description": "The type of the location."
          },
          "location_label": {
            "type": "string",
            "description": "The label of the location."
          },
          "suggestion_type": {
            "type": "string",
            "description": "The type of the suggestion."
          }
        }
      },
      "description": "The list of suggestions."
    },
    "system_message": {
      "type": "string",
      "description": "The system message to AI/LLM to understand the task that you must to do."
    }
  }
}
```

