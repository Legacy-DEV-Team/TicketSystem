import { z } from 'zod';

export const DiscordIdSchema = z.string().regex(/^\d{17,19}$/, 'Invalid Discord ID');

export const EmailSchema = z.string().email('Invalid email address');

export const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number');

export const UserSchema = z.object({
  discordId: DiscordIdSchema,
  username: z.string().min(1).max(32),
  discriminator: z.string().length(4),
  avatar: z.string().optional(),
  email: EmailSchema.optional(),
  password: PasswordSchema.optional()
});

export const GuildConfigSchema = z.object({
  autoCloseEnabled: z.boolean().default(true),
  autoCloseHours: z.number().min(1).max(168).default(72),
  cooldownEnabled: z.boolean().default(true),
  cooldownMinutes: z.number().min(1).max(1440).default(60),
  devModeEnabled: z.boolean().default(false),
  devModeRoles: z.array(DiscordIdSchema).default([]),
  logChannelId: DiscordIdSchema.optional(),
  transcriptChannelId: DiscordIdSchema.optional(),
  blockedUsers: z.array(DiscordIdSchema).default([]),
  maxActiveTickets: z.number().min(1).max(50).default(5),
  customBotToken: z.string().optional(),
  customDomain: z.string().url().optional()
});

export const TicketCategorySchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  channelId: DiscordIdSchema,
  emoji: z.string().max(10).optional(),
  requiredRoles: z.array(DiscordIdSchema).default([]),
  blockedRoles: z.array(DiscordIdSchema).default([])
});

export const TicketSchema = z.object({
  guildId: DiscordIdSchema,
  categoryId: z.string().min(1),
  userId: DiscordIdSchema,
  reason: z.string().max(500).optional(),
  customName: z.string().max(100).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
});

export const SystemConfigSchema = z.object({
  discord: z.object({
    defaultBot: z.object({
      token: z.string().optional(),
      clientId: DiscordIdSchema.optional(),
      clientSecret: z.string().optional(),
      enabled: z.boolean().default(false)
    }),
    oauth: z.object({
      clientId: DiscordIdSchema.optional(),
      clientSecret: z.string().optional(),
      redirectUri: z.string().url().optional()
    })
  }),
  payments: z.object({
    stripe: z.object({
      publicKey: z.string().optional(),
      secretKey: z.string().optional(),
      webhookSecret: z.string().optional(),
      enabled: z.boolean().default(false)
    }),
    paypal: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      webhookId: z.string().optional(),
      environment: z.enum(['sandbox', 'production']).default('sandbox'),
      enabled: z.boolean().default(false)
    }),
    patreon: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      enabled: z.boolean().default(false)
    })
  }),
  domain: z.object({
    primary: z.string().default('localhost:3000'),
    allowCustomDomains: z.boolean().default(false),
    sslEnabled: z.boolean().default(false)
  }),
  features: z.object({
    maxFreeGuilds: z.number().min(1).default(1),
    maxProGuilds: z.number().min(1).default(5),
    maxEnterpriseGuilds: z.number().default(-1),
    transcriptRetentionDays: z.number().min(1).default(365)
  })
});

export const SubscriptionSchema = z.object({
  userId: DiscordIdSchema,
  guildId: DiscordIdSchema,
  provider: z.enum(['stripe', 'paypal', 'patreon']),
  plan: z.enum(['free', 'pro', 'enterprise']),
  amount: z.number().min(0),
  currency: z.string().length(3),
  interval: z.enum(['month', 'year'])
});

export const WebhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  timestamp: z.number()
});

export const ApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()),
  expiresAt: z.date().optional()
});

export const DomainVerificationSchema = z.object({
  domain: z.string().url(),
  challengeRecord: z.string(),
  verified: z.boolean().default(false)
});

export const TranscriptFilterSchema = z.object({
  guildId: DiscordIdSchema.optional(),
  userId: DiscordIdSchema.optional(),
  status: z.enum(['open', 'closed', 'pending_close']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(25)
});

export const BulkActionSchema = z.object({
  action: z.enum(['close', 'delete', 'assign', 'tag']),
  ticketIds: z.array(z.string()).min(1).max(100),
  value: z.string().optional()
});

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
}

export function validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> {
  return (schema as any).partial().parse(data);
}