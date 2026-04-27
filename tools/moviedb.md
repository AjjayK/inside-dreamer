# Tool Server: moviedb

**ID:** a49d2fc4-f571-4122-b920-3da5d4644704

**Short Description:** Get information about movies and TV shows

## Description

Get information about movies and TV shows

## Tools (4)

### searchMovies

**Description:** Search for movies by title using The Movie Database API

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "default": 1,
      "description": "Page number for pagination (default: 1)"
    },
    "query": {
      "type": "string",
      "description": "The movie title to search for"
    },
    "language": {
      "type": "string",
      "default": "en-US",
      "description": "Language for results (default: en-US)"
    },
    "include_adult": {
      "type": "boolean",
      "default": false,
      "description": "Include adult content (default: false)"
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
    "page",
    "total_pages",
    "total_results",
    "results"
  ],
  "properties": {
    "page": {
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
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "title",
          "original_title",
          "overview",
          "release_date",
          "poster_path",
          "backdrop_path",
          "vote_average",
          "vote_count",
          "popularity",
          "adult",
          "genre_ids",
          "original_language",
          "video"
        ],
        "properties": {
          "id": {
            "type": "number"
          },
          "adult": {
            "type": "boolean"
          },
          "title": {
            "type": "string"
          },
          "video": {
            "type": "boolean"
          },
          "overview": {
            "type": "string"
          },
          "genre_ids": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "popularity": {
            "type": "number"
          },
          "poster_url": {
            "type": "string"
          },
          "vote_count": {
            "type": "number"
          },
          "poster_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "backdrop_url": {
            "type": "string"
          },
          "release_date": {
            "type": "string"
          },
          "vote_average": {
            "type": "number"
          },
          "backdrop_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "original_title": {
            "type": "string"
          },
          "original_language": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "total_pages": {
      "type": "number"
    },
    "total_results": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### searchTVShows

**Description:** Search for TV shows by title using The Movie Database API

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "page": {
      "type": "number",
      "default": 1,
      "description": "Page number for pagination (default: 1)"
    },
    "query": {
      "type": "string",
      "description": "The TV show title to search for"
    },
    "language": {
      "type": "string",
      "default": "en-US",
      "description": "Language for results (default: en-US)"
    },
    "include_adult": {
      "type": "boolean",
      "default": false,
      "description": "Include adult content (default: false)"
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
    "page",
    "total_pages",
    "total_results",
    "results"
  ],
  "properties": {
    "page": {
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
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "original_name",
          "overview",
          "first_air_date",
          "poster_path",
          "backdrop_path",
          "vote_average",
          "vote_count",
          "popularity",
          "adult",
          "genre_ids",
          "origin_country",
          "original_language"
        ],
        "properties": {
          "id": {
            "type": "number"
          },
          "name": {
            "type": "string"
          },
          "adult": {
            "type": "boolean"
          },
          "overview": {
            "type": "string"
          },
          "genre_ids": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "popularity": {
            "type": "number"
          },
          "poster_url": {
            "type": "string"
          },
          "vote_count": {
            "type": "number"
          },
          "poster_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "backdrop_url": {
            "type": "string"
          },
          "vote_average": {
            "type": "number"
          },
          "backdrop_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "original_name": {
            "type": "string"
          },
          "first_air_date": {
            "type": "string"
          },
          "origin_country": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "original_language": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "total_pages": {
      "type": "number"
    },
    "total_results": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### getPopularMovies

**Description:** Get popular movies using The Movie Database API

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "page": {
      "type": "number",
      "default": 1,
      "description": "Page number for pagination (default: 1)"
    },
    "language": {
      "type": "string",
      "default": "en-US",
      "description": "Language for results (default: en-US)"
    },
    "include_adult": {
      "type": "boolean",
      "default": false,
      "description": "Include adult content (default: false)"
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
    "page",
    "total_pages",
    "total_results",
    "results"
  ],
  "properties": {
    "page": {
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
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "title",
          "original_title",
          "overview",
          "release_date",
          "poster_path",
          "backdrop_path",
          "vote_average",
          "vote_count",
          "popularity",
          "adult",
          "genre_ids",
          "original_language",
          "video"
        ],
        "properties": {
          "id": {
            "type": "number"
          },
          "adult": {
            "type": "boolean"
          },
          "title": {
            "type": "string"
          },
          "video": {
            "type": "boolean"
          },
          "overview": {
            "type": "string"
          },
          "genre_ids": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "popularity": {
            "type": "number"
          },
          "poster_url": {
            "type": "string"
          },
          "vote_count": {
            "type": "number"
          },
          "poster_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "backdrop_url": {
            "type": "string"
          },
          "release_date": {
            "type": "string"
          },
          "vote_average": {
            "type": "number"
          },
          "backdrop_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "original_title": {
            "type": "string"
          },
          "original_language": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "total_pages": {
      "type": "number"
    },
    "total_results": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### getPopularTVShows

**Description:** Get popular TV shows using The Movie Database API

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "page": {
      "type": "number",
      "default": 1,
      "description": "Page number for pagination (default: 1)"
    },
    "language": {
      "type": "string",
      "default": "en-US",
      "description": "Language for results (default: en-US)"
    },
    "include_adult": {
      "type": "boolean",
      "default": false,
      "description": "Include adult content (default: false)"
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
    "page",
    "total_pages",
    "total_results",
    "results"
  ],
  "properties": {
    "page": {
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
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "original_name",
          "overview",
          "first_air_date",
          "poster_path",
          "backdrop_path",
          "vote_average",
          "vote_count",
          "popularity",
          "adult",
          "genre_ids",
          "origin_country",
          "original_language"
        ],
        "properties": {
          "id": {
            "type": "number"
          },
          "name": {
            "type": "string"
          },
          "adult": {
            "type": "boolean"
          },
          "overview": {
            "type": "string"
          },
          "genre_ids": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "popularity": {
            "type": "number"
          },
          "poster_url": {
            "type": "string"
          },
          "vote_count": {
            "type": "number"
          },
          "poster_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "backdrop_url": {
            "type": "string"
          },
          "vote_average": {
            "type": "number"
          },
          "backdrop_path": {
            "type": [
              "string",
              "null"
            ]
          },
          "original_name": {
            "type": "string"
          },
          "first_air_date": {
            "type": "string"
          },
          "origin_country": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "original_language": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "total_pages": {
      "type": "number"
    },
    "total_results": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

