# Authentication

Discord Ticket SaaS uses a secure authentication system based on JWT tokens with EdDSA (Ed25519) signatures. This guide covers authentication methods, token management, and security best practices.

## Authentication Methods

### 1. Discord OAuth2 (Web Dashboard)

The web dashboard uses Discord OAuth2 for user authentication:

```typescript
// Redirect user to Discord OAuth2
window.location.href = '/api/auth/discord';

// After authorization, user is redirected back with session
// Session cookies are automatically managed
```

### 2. API Token Authentication

For API access, use JWT tokens obtained through the dashboard:

```http
Authorization: Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 3. Service-to-Service Authentication

For server-to-server communication, use API keys:

```http
Authorization: ApiKey api_key_your_service_key_here
```

## Token Types

### Access Tokens

- **Purpose**: API authentication
- **Lifetime**: 15 minutes (configurable)
- **Algorithm**: EdDSA (Ed25519)
- **Storage**: Memory/HTTP-only cookies

```json
{
  "alg": "EdDSA",
  "typ": "JWT"
}
{
  "sub": "user_63f9876543210abcdef12345",
  "iat": 1705312800,
  "exp": 1705313700,
  "aud": "ticket-system",
  "iss": "https://yourdomain.com",
  "scope": ["tickets:read", "tickets:write", "guilds:read"],
  "guild_id": "guild_789012345678901234"
}
```

### Refresh Tokens

- **Purpose**: Obtain new access tokens
- **Lifetime**: 7 days (configurable)
- **Storage**: HTTP-only secure cookies
- **Rotation**: Automatic on use

### API Keys

- **Purpose**: Service authentication
- **Lifetime**: No expiration (until revoked)
- **Format**: `api_key_` prefix + 32 random characters
- **Permissions**: Scoped to specific resources

## Obtaining Tokens

### Web Dashboard

1. **Login with Discord**:
   ```http
   GET /api/auth/discord
   ```

2. **Automatic token management** - tokens are handled in HTTP-only cookies

### API Token Generation

1. **Access the dashboard** and navigate to **Settings → API Tokens**

2. **Create a new token**:
   ```http
   POST /api/v1/auth/tokens
   Authorization: Bearer your-session-token
   Content-Type: application/json

   {
     "name": "My Integration",
     "scopes": ["tickets:read", "tickets:write"],
     "guild_id": "guild_123456789",
     "expires_in": 86400
   }
   ```

3. **Response**:
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
       "expires_at": "2024-01-16T10:30:00Z",
       "scopes": ["tickets:read", "tickets:write"],
       "guild_id": "guild_123456789"
     }
   }
   ```

## Token Scopes

### User Scopes

| Scope | Description |
|-------|-------------|
| `profile:read` | Read user profile information |
| `profile:write` | Update user profile |
| `guilds:read` | List user's Discord servers |
| `guilds:write` | Manage guild settings |

### Ticket Scopes

| Scope | Description |
|-------|-------------|
| `tickets:read` | Read tickets |
| `tickets:write` | Create and update tickets |
| `tickets:delete` | Delete tickets |
| `tickets:close` | Close tickets |

### Admin Scopes

| Scope | Description |
|-------|-------------|
| `admin:system` | System administration |
| `admin:users` | User management |
| `admin:guilds` | Guild administration |
| `admin:analytics` | Access analytics |

### Special Scopes

| Scope | Description |
|-------|-------------|
| `webhook:receive` | Receive webhook events |
| `api:full` | Full API access (dangerous) |

## Making Authenticated Requests

### Using Access Tokens

```http
GET /api/v1/tickets
Authorization: Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Using API Keys

```http
GET /api/v1/tickets
Authorization: ApiKey api_key_your_service_key_here
Content-Type: application/json
```

### JavaScript/Node.js Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://yourdomain.com/api/v1',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

// Make authenticated request
const response = await api.get('/tickets');
console.log(response.data);
```

### Python Example

```python
import requests

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://yourdomain.com/api/v1/tickets',
    headers=headers
)

print(response.json())
```

### cURL Example

```bash
curl -X GET \
  'https://yourdomain.com/api/v1/tickets' \
  -H 'Authorization: Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

## Token Refresh

### Automatic Refresh (Web)

Web sessions automatically refresh tokens using HTTP-only cookies:

```http
POST /api/auth/refresh
Cookie: refresh_token=...

Response:
Set-Cookie: access_token=new_token; HttpOnly; Secure; SameSite=Strict
```

### Manual Refresh (API)

```http
POST /api/v1/auth/refresh
Authorization: Bearer expired_access_token
Content-Type: application/json

{
  "refresh_token": "your_refresh_token"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "access_token": "new_access_token",
    "expires_at": "2024-01-15T11:30:00Z",
    "refresh_token": "new_refresh_token"
  }
}
```

## Security Features

### Token Encryption

- **Access tokens**: Signed with EdDSA (Ed25519)
- **Refresh tokens**: Encrypted with AES-256-GCM
- **API keys**: Hashed with Argon2id

### Security Headers

All authenticated endpoints require:

```http
X-Requested-With: XMLHttpRequest
X-CSRF-Token: csrf_token_here (for state-changing operations)
```

### Rate Limiting

Authentication endpoints have strict rate limits:

- **Login attempts**: 5 per minute per IP
- **Token generation**: 10 per hour per user
- **API requests**: Varies by subscription tier

## Error Handling

### Authentication Errors

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {
      "type": "token_expired",
      "expires_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `UNAUTHORIZED` | Invalid/expired token | Refresh or re-authenticate |
| `FORBIDDEN` | Insufficient permissions | Check token scopes |
| `INVALID_TOKEN` | Malformed token | Generate new token |
| `TOKEN_EXPIRED` | Expired token | Refresh token |
| `SCOPE_INSUFFICIENT` | Missing required scope | Request token with correct scopes |

## Best Practices

### Token Security

1. **Store tokens securely**:
   ```typescript
   // ✅ Good - environment variable
   const token = process.env.API_TOKEN;
   
   // ❌ Bad - hardcoded
   const token = 'eyJhbGciOiJFZERTQSI...';
   ```

2. **Use HTTPS only**:
   ```typescript
   // ✅ Good
   const baseURL = 'https://yourdomain.com/api';
   
   // ❌ Bad
   const baseURL = 'http://yourdomain.com/api';
   ```

3. **Handle token expiration**:
   ```typescript
   async function makeRequest(url: string) {
     try {
       return await api.get(url);
     } catch (error) {
       if (error.response?.status === 401) {
         await refreshToken();
         return await api.get(url); // Retry with new token
       }
       throw error;
     }
   }
   ```

### Scope Management

1. **Use principle of least privilege**:
   ```json
   {
     "scopes": ["tickets:read"],  // ✅ Only what's needed
     // "scopes": ["api:full"]    // ❌ Too broad
   }
   ```

2. **Guild-specific tokens**:
   ```json
   {
     "guild_id": "specific_guild_id",  // ✅ Limit to specific guild
     // "guild_id": null               // ❌ Access to all guilds
   }
   ```

### Token Management

1. **Regular rotation**:
   ```typescript
   // Rotate tokens every 24 hours
   setInterval(async () => {
     await rotateApiKey();
   }, 24 * 60 * 60 * 1000);
   ```

2. **Monitor usage**:
   ```typescript
   // Log token usage for security auditing
   const response = await api.get('/tickets');
   logger.info('API request', {
     endpoint: '/tickets',
     tokenId: 'token_123',
     userId: 'user_456'
   });
   ```

## Development and Testing

### Mock Authentication

For development, you can use mock authentication:

```bash
# Enable dev mode (DO NOT use in production)
DEV_MODE=true
SKIP_AUTH=true
```

### Testing Tokens

Generate test tokens for development:

```http
POST /api/v1/auth/tokens/test
Authorization: Bearer dev_token
Content-Type: application/json

{
  "scopes": ["tickets:read", "tickets:write"],
  "expires_in": 3600
}
```

### Webhook Authentication

Webhooks use HMAC-SHA256 signatures:

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Migration Guide

### From v0.x to v1.x

1. **Update token format**:
   ```typescript
   // Old format (deprecated)
   Authorization: Token your-token-here
   
   // New format
   Authorization: Bearer your-jwt-token
   ```

2. **Update scopes**:
   ```typescript
   // Old scopes (deprecated)
   ['read', 'write', 'admin']
   
   // New scopes
   ['tickets:read', 'tickets:write', 'admin:system']
   ```

## Troubleshooting

### Common Issues

1. **Token not working**:
   - Check token expiration
   - Verify scopes are sufficient
   - Ensure proper Authorization header format

2. **CORS errors**:
   - Check Origin header
   - Verify domain is whitelisted
   - Use proper HTTPS

3. **Rate limiting**:
   - Implement exponential backoff
   - Check rate limit headers
   - Upgrade subscription for higher limits

### Debug Mode

Enable debug logging for authentication:

```bash
LOG_LEVEL=debug
AUTH_DEBUG=true
```

This will log detailed authentication information (excluding sensitive data).

## Next Steps

- **[Rate Limiting](/api/rate-limiting)** - Understand API rate limits
- **[Error Handling](/api/errors)** - Handle API errors properly
- **[Webhooks](/api/webhooks/overview)** - Set up real-time notifications
- **[SDKs](/api/sdks)** - Use official SDKs for easier integration