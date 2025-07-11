# API Overview

Discord Ticket SaaS provides a comprehensive REST API for managing tickets, users, guilds, and system configuration. The API follows RESTful principles and uses JSON for request and response bodies.

## Base URL

```
https://yourdomain.com/api
```

For self-hosted instances, replace `yourdomain.com` with your domain.

## API Versioning

The API uses URL-based versioning. The current version is `v1`.

```
https://yourdomain.com/api/v1/...
```

## Request Format

### Content Type

All requests should use `application/json` content type:

```http
Content-Type: application/json
```

### Request Body

Request bodies should be valid JSON:

```json
{
  "name": "General Support",
  "description": "Get help with general questions",
  "emoji": "🎫"
}
```

## Response Format

### Success Responses

All successful responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123",
    "version": "v1"
  }
}
```

### Error Responses

Error responses include detailed error information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "name",
        "message": "Name is required",
        "code": "REQUIRED"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123",
    "version": "v1"
  }
}
```

## HTTP Status Codes

The API uses standard HTTP status codes:

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no response body |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Pagination

List endpoints support pagination using cursor-based pagination:

### Request Parameters

```
GET /api/v1/tickets?limit=20&cursor=eyJpZCI6IjYzZjk4...
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Number of items per page (max 100) |
| `cursor` | string | - | Cursor for next page |
| `sort` | string | `created_at:desc` | Sort order |

### Response Format

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "hasNext": true,
    "hasPrevious": false,
    "nextCursor": "eyJpZCI6IjYzZjk4...",
    "previousCursor": null,
    "total": 150,
    "limit": 20
  }
}
```

## Filtering and Sorting

### Filtering

Most list endpoints support filtering:

```
GET /api/v1/tickets?status=open&created_after=2024-01-01
```

Common filter operators:
- `eq` (equals) - default
- `ne` (not equals)
- `gt` (greater than)
- `gte` (greater than or equal)
- `lt` (less than)
- `lte` (less than or equal)
- `in` (in array)
- `contains` (string contains)

Examples:
```
?status=open                    # status equals "open"
?created_at:gte=2024-01-01     # created_at >= 2024-01-01
?tags:in=bug,feature           # tags contains "bug" OR "feature"
?title:contains=payment        # title contains "payment"
```

### Sorting

Sort by one or more fields:

```
?sort=created_at:desc          # Sort by created_at descending
?sort=priority:asc,created_at:desc  # Multiple sort fields
```

## Field Selection

Select specific fields to reduce response size:

```
GET /api/v1/tickets?fields=id,title,status,created_at
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "ticket_123",
      "title": "Login Issue",
      "status": "open",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Expanding Relations

Include related data in responses:

```
GET /api/v1/tickets?expand=user,guild,category
```

Response includes full user, guild, and category objects instead of just IDs.

## API Endpoints

### Core Resources

| Resource | Base URL | Description |
|----------|----------|-------------|
| **Tickets** | `/api/v1/tickets` | Manage support tickets |
| **Users** | `/api/v1/users` | User management |
| **Guilds** | `/api/v1/guilds` | Discord server management |
| **Categories** | `/api/v1/categories` | Ticket categories |
| **Analytics** | `/api/v1/analytics` | Analytics and reporting |

### System Resources

| Resource | Base URL | Description |
|----------|----------|-------------|
| **System Config** | `/api/v1/system/config` | System configuration |
| **Subscriptions** | `/api/v1/subscriptions` | Subscription management |
| **Webhooks** | `/api/v1/webhooks` | Webhook management |
| **Health** | `/api/v1/health` | Health checks |

## Example Requests

### Create a Ticket

```http
POST /api/v1/tickets
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "title": "Payment Issue",
  "description": "Cannot process payment for Pro subscription",
  "category_id": "cat_123",
  "guild_id": "guild_456",
  "priority": "high",
  "tags": ["payment", "subscription"]
}
```

### Get Tickets with Filtering

```http
GET /api/v1/tickets?status=open&guild_id=guild_456&expand=user,category
Authorization: Bearer your-jwt-token
```

### Update System Configuration

```http
PATCH /api/v1/system/config
Authorization: Bearer your-admin-jwt-token
Content-Type: application/json

{
  "discord": {
    "primaryBot": {
      "enabled": true
    }
  },
  "payments": {
    "stripe": {
      "enabled": true
    }
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @ticket-system/api-client
```

```typescript
import { TicketSystemAPI } from '@ticket-system/api-client';

const api = new DiscordTicketAPI({
  baseUrl: 'https://yourdomain.com/api',
  token: 'your-jwt-token'
});

// Create a ticket
const ticket = await api.tickets.create({
  title: 'Payment Issue',
  description: 'Cannot process payment',
  category_id: 'cat_123',
  guild_id: 'guild_456'
});

// Get tickets with filtering
const tickets = await api.tickets.list({
  status: 'open',
  guild_id: 'guild_456',
  expand: ['user', 'category']
});
```

### Python

```bash
pip install ticket-system
```

```python
from discord_ticket_saas import DiscordTicketAPI

api = DiscordTicketAPI(
    base_url='https://yourdomain.com/api',
    token='your-jwt-token'
)

# Create a ticket
ticket = api.tickets.create({
    'title': 'Payment Issue',
    'description': 'Cannot process payment',
    'category_id': 'cat_123',
    'guild_id': 'guild_456'
})

# Get tickets
tickets = api.tickets.list(
    status='open',
    guild_id='guild_456',
    expand=['user', 'category']
)
```

### cURL Examples

```bash
# Get tickets
curl -X GET \
  'https://yourdomain.com/api/v1/tickets?status=open' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json'

# Create a ticket
curl -X POST \
  'https://yourdomain.com/api/v1/tickets' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Payment Issue",
    "description": "Cannot process payment",
    "category_id": "cat_123",
    "guild_id": "guild_456"
  }'
```

## OpenAPI Specification

The complete API specification is available in OpenAPI 3.0 format:

- **Swagger UI**: [https://yourdomain.com/api/docs](https://yourdomain.com/api/docs)
- **JSON Spec**: [https://yourdomain.com/api/openapi.json](https://yourdomain.com/api/openapi.json)
- **YAML Spec**: [https://yourdomain.com/api/openapi.yaml](https://yourdomain.com/api/openapi.yaml)

## Postman Collection

Import our Postman collection for easy API testing:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/your-collection-id)

## Next Steps

- **[Authentication](/api/authentication)** - Learn about API authentication
- **[Rate Limiting](/api/rate-limiting)** - Understand rate limiting
- **[Webhooks](/api/webhooks/overview)** - Set up real-time notifications
- **[Tickets API](/api/tickets)** - Manage support tickets
- **[Users API](/api/users)** - User management endpoints