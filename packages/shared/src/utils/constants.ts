export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    maxGuilds: 1,
    maxTicketsPerMonth: 50,
    retentionDays: 7,
    features: ['basic_bot', 'simple_panel'],
    price: 0
  },
  PRO: {
    name: 'Pro',
    maxGuilds: 5,
    maxTicketsPerMonth: 500,
    retentionDays: 30,
    features: ['custom_bot', 'advanced_analytics', 'priority_support'],
    price: 9.99
  },
  ENTERPRISE: {
    name: 'Enterprise',
    maxGuilds: -1,
    maxTicketsPerMonth: -1,
    retentionDays: 365,
    features: ['custom_domain', 'white_label', 'sla_guarantee', 'dedicated_support'],
    price: 49.99
  }
} as const;

export const TICKET_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PENDING_CLOSE: 'pending_close'
} as const;

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  UNPAID: 'unpaid'
} as const;

export const PAYMENT_PROVIDERS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  PATREON: 'patreon'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export const DISCORD_LIMITS = {
  MAX_EMBED_DESCRIPTION: 4096,
  MAX_EMBED_FIELDS: 25,
  MAX_EMBED_FIELD_NAME: 256,
  MAX_EMBED_FIELD_VALUE: 1024,
  MAX_COMPONENTS_PER_ROW: 5,
  MAX_ROWS_PER_MESSAGE: 5,
  MAX_MODAL_INPUTS: 5
} as const;

export const RATE_LIMITS = {
  TICKET_CREATION: {
    FREE: { requests: 5, window: 3600 },
    PRO: { requests: 20, window: 3600 },
    ENTERPRISE: { requests: 100, window: 3600 }
  },
  API_CALLS: {
    FREE: { requests: 100, window: 3600 },
    PRO: { requests: 1000, window: 3600 },
    ENTERPRISE: { requests: 10000, window: 3600 }
  }
} as const;

export const ENCRYPTION_CONFIG = {
  ARGON2_OPTIONS: {
    type: 2,
    timeCost: 2,
    memoryCost: 65536,
    parallelism: 2,
    saltLength: 32
  },
  AES_ALGORITHM: 'aes-256-gcm',
  IV_LENGTH: 12,
  SALT_LENGTH: 32
} as const;

export const JWT_CONFIG = {
  ALGORITHM: 'EdDSA',
  CURVE: 'Ed25519',
  ACCESS_TOKEN_EXPIRES: 15 * 60,
  REFRESH_TOKEN_EXPIRES: 7 * 24 * 60 * 60
} as const;

export const REDIS_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  GUILD_CONFIG: (guildId: string) => `guild:${guildId}`,
  TICKET_COOLDOWN: (userId: string, guildId: string) => `cooldown:${userId}:${guildId}`,
  RATE_LIMIT: (key: string) => `ratelimit:${key}`,
  SYSTEM_CONFIG: 'system:config'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const WEBHOOK_EVENTS = {
  TICKET_CREATED: 'ticket.created',
  TICKET_CLOSED: 'ticket.closed',
  TICKET_UPDATED: 'ticket.updated',
  USER_BLOCKED: 'user.blocked',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled'
} as const;