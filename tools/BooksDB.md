# Tool Server: BooksDB

**ID:** dd240f0e-2b62-47c9-a6fd-948eb96e7b61

**Short Description:** Search and retrieve detailed book information from Open Library's vast catalog, with automatic Google Books fallback for missing data. Features intelligent caching, rate limiting, and rich metadata in

## Description

Search and retrieve detailed book information from Open Library's vast catalog, with automatic Google Books fallback for missing data. Features intelligent caching, rate limiting, and rich metadata including descriptions, covers, authors, subjects, and ISBNs. Perfect for building book recommendation engines, reading trackers, and library apps.

## Tools (5)

### searchBooks

**Description:** Search for books by title, author, or general query. Returns a list of matching books with basic metadata including title, authors, publication year, ratings, and cover images.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 10,
      "maximum": 100,
      "minimum": 1,
      "description": "Maximum number of results to return (1-100, default 10)"
    },
    "query": {
      "type": "string",
      "description": "Search query - can include book title, author name, or keywords"
    },
    "offset": {
      "type": "number",
      "default": 0,
      "minimum": 0,
      "description": "Number of results to skip for pagination (default 0)"
    }
  },
  "additionalProperties": false
}
```

### getBookDetails

**Description:** Get detailed information about a specific book including description, subjects, authors, publication info, and covers. Accepts ISBN, Open Library ID (OLID), or other identifiers.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "identifier"
  ],
  "properties": {
    "identifier": {
      "type": "string",
      "description": "Book identifier - can be ISBN (10 or 13 digit), Open Library ID (e.g., OL45804W), LCCN, or OCLC number"
    },
    "identifierType": {
      "enum": [
        "isbn",
        "olid",
        "lccn",
        "oclc"
      ],
      "type": "string",
      "description": "Type of identifier (auto-detected if not specified)"
    }
  },
  "additionalProperties": false
}
```

### getBookCover

**Description:** Get the cover image URL for a book. Returns URLs for all available sizes (small, medium, large). Supports ISBN, Open Library ID (olid), or cover ID.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "identifier"
  ],
  "properties": {
    "size": {
      "enum": [
        "S",
        "M",
        "L"
      ],
      "type": "string",
      "default": "M",
      "description": "Desired image size - S (small, ~90px), M (medium, ~180px), L (large, ~500px). Default: M"
    },
    "identifier": {
      "type": "string",
      "description": "The book identifier - ISBN (10 or 13), Open Library ID, or numeric cover ID"
    },
    "identifierType": {
      "enum": [
        "isbn",
        "olid",
        "id"
      ],
      "type": "string",
      "default": "isbn",
      "description": "Type of identifier provided (default: isbn). Use \"id\" for numeric Open Library cover IDs."
    }
  },
  "additionalProperties": false
}
```

### getAuthor

**Description:** Get detailed information about an author including biography, birth/death dates, photos, and a list of their published works on Open Library.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "authorId"
  ],
  "properties": {
    "authorId": {
      "type": "string",
      "description": "Open Library author ID (e.g., OL23919A for J.K. Rowling)"
    }
  },
  "additionalProperties": false
}
```

### getBooksBySubject

**Description:** Browse and discover books by subject or genre. Returns books in the category along with related subjects and top authors. Good for book discovery and recommendations.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "subject"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 10,
      "maximum": 100,
      "minimum": 1,
      "description": "Maximum number of books to return (1-100, default 10)"
    },
    "offset": {
      "type": "number",
      "default": 0,
      "minimum": 0,
      "description": "Number of books to skip for pagination (default 0)"
    },
    "subject": {
      "type": "string",
      "description": "Subject or genre to browse (e.g., \"science fiction\", \"mystery\", \"cooking\", \"biography\")"
    }
  },
  "additionalProperties": false
}
```

