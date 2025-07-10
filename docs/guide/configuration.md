# Configuration

This guide covers all configuration options for Discord Ticket SaaS, including system-wide settings, Discord bot configuration, and payment provider setup.

## Overview

Discord Ticket SaaS is designed to be fully configurable through the web interface. All sensitive configuration (API keys, tokens, secrets) is stored securely in the database with encryption, eliminating the need for physical configuration files in production.

## Admin Panel Access

The admin panel is accessible at `/admin` and requires specific permissions:

1. **Super Admin**: Full system access (configured during installation)
2. **System Admin**: Can modify system-wide settings
3. **Guild Admin**: Can only modify settings for their Discord servers

```typescript
// Access levels
enum AdminRole {
  SUPER_ADMIN = 'super_admin',     // Full system access
  SYSTEM_ADMIN = 'system_admin',   // System settings only
  GUILD_ADMIN = 'guild_admin'      // Guild-specific settings
}
```

## System Configuration

### Core Settings

Access: **Admin Panel → System → Core Settings**

```typescript
interface CoreSettings {
  // Application Settings
  applicationName: string;          // "Discord Ticket SaaS"
  applicationUrl: string;           // "https://yourdomain.com"
  supportEmail: string;             // "support@yourdomain.com"
  
  // Feature Flags
  enableRegistrations: boolean;     // Allow new user registrations
  enableMultiGuild: boolean;        // Allow multiple Discord servers per user
  enableCustomDomains: boolean;     // Allow custom domain configuration
  enablePayments: boolean;          // Enable subscription billing
  
  // Rate Limiting
  rateLimitWindow: number;          // Rate limit window (seconds)
  rateLimitMax: number;             // Max requests per window
  
  // Session Settings
  sessionTimeout: number;           // Session timeout (minutes)
  maxConcurrentSessions: number;    // Max concurrent sessions per user
}
```

### Security Configuration

Access: **Admin Panel → System → Security**

```typescript
interface SecuritySettings {
  // Password Policy
  passwordMinLength: number;        // Minimum password length
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  passwordMaxAge: number;           // Password expiration (days)
  
  // Account Security
  enableTwoFactor: boolean;         // Require 2FA for admin accounts
  enableIPWhitelisting: boolean;    // Restrict admin access by IP
  allowedIPs: string[];             // Whitelisted IP addresses
  
  // Encryption Settings (read-only, configured during installation)
  argon2: {
    timeCost: number;               // Argon2id time cost (default: 2)
    memoryCost: number;             // Argon2id memory cost (default: 65536)
    parallelism: number;            // Argon2id parallelism (default: 2)
  };
  
  // JWT Settings
  jwtAccessTokenExpiry: string;     // Access token expiry (default: "15m")
  jwtRefreshTokenExpiry: string;    // Refresh token expiry (default: "7d")
}
```

## Discord Configuration

### Bot Settings

Access: **Admin Panel → Discord → Bot Configuration**

```typescript
interface BotSettings {
  // Primary Bot (System-wide)
  primaryBot: {
    token: string;                  // Discord bot token (encrypted)
    clientId: string;               // Discord application client ID
    clientSecret: string;           // Discord application client secret (encrypted)
    enabled: boolean;               // Enable primary bot
  };
  
  // Custom Bot Support
  allowCustomBots: boolean;         // Allow guilds to use custom bot tokens
  customBotRequiresPro: boolean;    // Require Pro subscription for custom bots
  
  // Bot Behavior
  defaultPresence: {
    status: 'online' | 'idle' | 'dnd' | 'invisible';
    activity: {
      type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'COMPETING';
      name: string;
      url?: string;                 // For streaming activity
    };
  };
  
  // Auto-moderation
  enableAutoMod: boolean;           // Enable automatic content moderation
  autoModLevel: 'low' | 'medium' | 'high';
  
  // Logging
  enableAuditLogs: boolean;         // Log all bot actions
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}
```

### OAuth2 Configuration

Access: **Admin Panel → Discord → OAuth2**

```typescript
interface OAuth2Settings {
  // Discord OAuth2
  clientId: string;                 // Discord OAuth2 client ID
  clientSecret: string;             // Discord OAuth2 client secret (encrypted)
  redirectUri: string;              // OAuth2 redirect URI
  scopes: string[];                 // Requested OAuth2 scopes
  
  // Permissions
  requiredPermissions: string;      // Required Discord permissions (bitfield)
  adminPermissions: string;         // Admin-level permissions
  
  // Access Control
  allowedGuilds: string[];          // Restrict access to specific guilds (optional)
  blockedUsers: string[];           // Blocked Discord user IDs
  autoGrantAdmin: boolean;          // Auto-grant admin to Discord server owners
}
```

## Payment Configuration

### Stripe Integration

Access: **Admin Panel → Payments → Stripe**

```typescript
interface StripeSettings {
  // API Configuration
  enabled: boolean;                 // Enable Stripe payments
  publishableKey: string;           // Stripe publishable key
  secretKey: string;                // Stripe secret key (encrypted)
  webhookSecret: string;            // Stripe webhook secret (encrypted)
  
  // Subscription Products
  products: {
    free: {
      priceId: string;              // Stripe price ID for free tier
      features: string[];           // Enabled features
    };
    pro: {
      priceId: string;              // Stripe price ID for pro tier
      features: string[];
    };
    enterprise: {
      priceId: string;              // Stripe price ID for enterprise tier
      features: string[];
    };
  };
  
  // Configuration
  currency: string;                 // Default currency (USD, EUR, etc.)
  taxBehavior: 'inclusive' | 'exclusive';
  allowPromotions: boolean;         // Allow promo codes
  trialPeriodDays: number;          // Free trial period
}
```

### PayPal Integration

Access: **Admin Panel → Payments → PayPal**

```typescript
interface PayPalSettings {
  // API Configuration
  enabled: boolean;                 // Enable PayPal payments
  clientId: string;                 // PayPal client ID
  clientSecret: string;             // PayPal client secret (encrypted)
  environment: 'sandbox' | 'live';  // PayPal environment
  
  // Webhook Configuration
  webhookId: string;                // PayPal webhook ID
  webhookUrl: string;               // PayPal webhook URL
  
  // Subscription Plans
  plans: {
    pro: {
      planId: string;               // PayPal subscription plan ID
      features: string[];
    };
    enterprise: {
      planId: string;
      features: string[];
    };
  };
}
```

### Patreon Integration

Access: **Admin Panel → Payments → Patreon**

```typescript
interface PatreonSettings {
  // API Configuration
  enabled: boolean;                 // Enable Patreon integration
  clientId: string;                 // Patreon OAuth2 client ID
  clientSecret: string;             // Patreon OAuth2 client secret (encrypted)
  accessToken: string;              // Patreon creator access token (encrypted)
  refreshToken: string;             // Patreon refresh token (encrypted)
  
  // Campaign Configuration
  campaignId: string;               // Patreon campaign ID
  webhookSecret: string;            // Patreon webhook secret (encrypted)
  
  // Tier Mapping
  tiers: {
    [tierId: string]: {
      name: string;                 // Tier name
      features: string[];           // Enabled features
      minCentAmount: number;        // Minimum pledge amount (cents)
    };
  };
}
```

## Guild Configuration

### Basic Settings

Access: **Dashboard → Guild Settings → Basic**

```typescript
interface GuildSettings {
  // Guild Information
  guildId: string;                  // Discord guild ID
  name: string;                     // Guild display name
  description: string;              // Guild description
  timezone: string;                 // Guild timezone (IANA format)
  
  // Bot Configuration
  customBot: {
    enabled: boolean;               // Use custom bot token
    token: string;                  // Custom bot token (encrypted, Pro+ only)
    clientId: string;               // Custom bot client ID
  };
  
  // Subscription
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'canceled' | 'past_due';
  subscriptionEnd: Date;            // Subscription end date
  
  // Usage Limits
  monthlyTicketLimit: number;       // Monthly ticket limit
  storageLimit: number;             // Storage limit (bytes)
  transcriptRetentionDays: number;  // Transcript retention period
}
```

### Ticket System Configuration

Access: **Dashboard → Guild Settings → Tickets**

```typescript
interface TicketSystemSettings {
  // General Settings
  enabled: boolean;                 // Enable ticket system
  autoCloseHours: number;           // Auto-close after inactivity (hours)
  maxOpenTickets: number;           // Max open tickets per user
  allowAttachments: boolean;        // Allow file attachments
  
  // Channels & Categories
  logChannelId: string;             // Channel for ticket logs
  transcriptChannelId: string;      // Channel for transcripts
  archiveCategoryId: string;        // Category for archived tickets
  
  // Permissions
  supportRoleIds: string[];         // Support team role IDs
  adminRoleIds: string[];           // Admin role IDs
  blacklistedRoleIds: string[];     // Roles that cannot create tickets
  
  // Notifications
  notifyOnCreate: boolean;          // Notify staff when ticket created
  notifyOnClose: boolean;           // Notify user when ticket closed
  notifyChannelId: string;          // Channel for staff notifications
  
  // Cooldowns
  createCooldownMinutes: number;    // Cooldown between ticket creation
  bypassCooldownRoles: string[];    // Roles that bypass cooldown
}
```

## Environment Variables

For development and initial setup, these environment variables are used:

### Database Configuration

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/discord-ticket-saas
MONGODB_OPTIONS=retryWrites=true&w=majority

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```

### Application Configuration

```bash
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Security
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret-here
ENCRYPTION_KEY=your-32-byte-encryption-key
JWT_PRIVATE_KEY=your-ed25519-private-key
JWT_PUBLIC_KEY=your-ed25519-public-key
```

### Development Configuration

```bash
# Development only
DEV_MODE=true
SKIP_AUTH=false
MOCK_PAYMENTS=true
```

## Configuration Best Practices

### Security

1. **Use Strong Secrets**: Generate cryptographically secure random strings for all secrets
2. **Rotate Keys Regularly**: Implement a key rotation strategy for production
3. **Encrypt Sensitive Data**: All API keys and tokens are automatically encrypted
4. **Audit Access**: Regularly review admin access and permissions

### Performance

1. **Cache Configuration**: Use Redis for session storage and caching
2. **Database Optimization**: Configure MongoDB with appropriate indexes
3. **Rate Limiting**: Set appropriate rate limits based on your usage patterns
4. **CDN Usage**: Use a CDN for static assets and transcripts

### Monitoring

1. **Enable Logging**: Set appropriate log levels for your environment
2. **Health Checks**: Configure health check endpoints for monitoring
3. **Alerts**: Set up alerts for critical system events
4. **Metrics**: Monitor key performance indicators

## Configuration API

You can also manage configuration programmatically:

```typescript
// Get system configuration
const config = await SystemConfigService.getConfig();

// Update specific settings
await SystemConfigService.updateConfig({
  discord: {
    primaryBot: {
      enabled: true,
      token: 'new-bot-token'
    }
  }
});

// Get guild configuration
const guildConfig = await GuildService.getConfig(guildId);

// Update guild settings
await GuildService.updateConfig(guildId, {
  ticketSystem: {
    autoCloseHours: 48,
    maxOpenTickets: 3
  }
});
```

## Validation

All configuration is validated before being saved:

```typescript
// Configuration schema validation
const configSchema = z.object({
  discord: z.object({
    primaryBot: z.object({
      token: z.string().min(1, 'Bot token is required'),
      clientId: z.string().min(1, 'Client ID is required'),
      enabled: z.boolean()
    })
  }),
  // ... other validation rules
});
```

## Next Steps

After configuring your system:

1. **[Set up your first guild](/guide/first-setup)** - Add your Discord server
2. **[Configure ticket categories](/guide/categories)** - Create ticket categories
3. **[Set up permissions](/guide/permissions)** - Configure role-based access
4. **[Test the system](/guide/testing)** - Verify everything works correctly