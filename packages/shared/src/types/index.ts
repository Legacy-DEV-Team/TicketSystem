import type { z } from 'zod';
import type {
  UserSchema,
  GuildConfigSchema,
  TicketCategorySchema,
  TicketSchema,
  SystemConfigSchema,
  SubscriptionSchema
} from '../utils/validators';

export type UserInput = z.infer<typeof UserSchema>;
export type GuildConfigInput = z.infer<typeof GuildConfigSchema>;
export type TicketCategoryInput = z.infer<typeof TicketCategorySchema>;
export type TicketInput = z.infer<typeof TicketSchema>;
export type SystemConfigInput = z.infer<typeof SystemConfigSchema>;
export type SubscriptionInput = z.infer<typeof SubscriptionSchema>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  icon_hash?: string;
  splash?: string;
  discovery_splash?: string;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region?: string;
  afk_channel_id?: string;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: DiscordRole[];
  emojis: DiscordEmoji[];
  features: string[];
  mfa_level: number;
  application_id?: string;
  system_channel_id?: string;
  system_channel_flags: number;
  rules_channel_id?: string;
  max_presences?: number;
  max_members?: number;
  vanity_url_code?: string;
  description?: string;
  banner?: string;
  premium_tier: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id?: string;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: DiscordWelcomeScreen;
  nsfw_level: number;
  stickers?: DiscordSticker[];
  premium_progress_bar_enabled: boolean;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: DiscordRoleTags;
}

export interface DiscordRoleTags {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: null;
}

export interface DiscordEmoji {
  id?: string;
  name?: string;
  roles?: string[];
  user?: DiscordUser;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface DiscordWelcomeScreen {
  description?: string;
  welcome_channels: DiscordWelcomeScreenChannel[];
}

export interface DiscordWelcomeScreenChannel {
  channel_id: string;
  description: string;
  emoji_id?: string;
  emoji_name?: string;
}

export interface DiscordSticker {
  id: string;
  pack_id?: string;
  name: string;
  description?: string;
  tags: string;
  asset?: string;
  type: number;
  format_type: number;
  available?: boolean;
  guild_id?: string;
  user?: DiscordUser;
  sort_value?: number;
}

export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: DiscordOverwrite[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: DiscordUser[];
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: string;
  rtc_region?: string;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: DiscordThreadMetadata;
  member?: DiscordThreadMember;
  default_auto_archive_duration?: number;
  permissions?: string;
}

export interface DiscordOverwrite {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

export interface DiscordThreadMetadata {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: string;
  locked: boolean;
  invitable?: boolean;
  create_timestamp?: string;
}

export interface DiscordThreadMember {
  id?: string;
  user_id?: string;
  join_timestamp: string;
  flags: number;
}

export interface PaymentProvider {
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: number;
  signature?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
}

export interface SystemStats {
  guilds: {
    total: number;
    active: number;
    premium: number;
  };
  tickets: {
    total: number;
    open: number;
    closedToday: number;
  };
  users: {
    total: number;
    activeToday: number;
    premium: number;
  };
  revenue: {
    monthly: number;
    total: number;
  };
}

export interface TicketStats {
  total: number;
  open: number;
  closed: number;
  averageResponseTime: number;
  satisfactionRating: number;
  categories: Record<string, number>;
}

export interface UserPermissions {
  canManageGuild: boolean;
  canManageTickets: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canManageSubscription: boolean;
  isAdmin: boolean;
}

export interface DomainVerification {
  domain: string;
  challengeRecord: string;
  verified: boolean;
  verifiedAt?: Date;
  lastChecked?: Date;
}

export interface MiddlewareContext {
  user?: {
    id: string;
    discordId: string;
    isAdmin: boolean;
    permissions: UserPermissions;
  };
  guild?: {
    id: string;
    config: Record<string, unknown>;
    subscription: Record<string, unknown>;
  };
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type TicketStatus = 'open' | 'closed' | 'pending_close';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type PaymentProviderType = 'stripe' | 'paypal' | 'patreon';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';