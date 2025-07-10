import { Schema, model, Document } from 'mongoose';

export interface ITicketCategory {
  id: string;
  name: string;
  description: string;
  channelId: string;
  emoji?: string;
  requiredRoles: string[];
  blockedRoles: string[];
}

export interface IGuildConfig {
  autoCloseEnabled: boolean;
  autoCloseHours: number;
  cooldownEnabled: boolean;
  cooldownMinutes: number;
  devModeEnabled: boolean;
  devModeRoles: string[];
  logChannelId?: string;
  transcriptChannelId?: string;
  blockedUsers: string[];
  maxActiveTickets: number;
  ticketCategories: ITicketCategory[];
  customBotToken?: string;
  customDomain?: string;
}

export interface IGuild extends Document {
  guildId: string;
  name: string;
  icon?: string;
  ownerId: string;
  isActive: boolean;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  config: IGuildConfig;
  nextTicketNumber: number;
  totalTickets: number;
  activeTickets: number;
  createdAt: Date;
  updatedAt: Date;
}

const TicketCategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  channelId: { type: String, required: true },
  emoji: { type: String },
  requiredRoles: [{ type: String }],
  blockedRoles: [{ type: String }]
});

const GuildConfigSchema = new Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  autoCloseHours: { type: Number, default: 72 },
  cooldownEnabled: { type: Boolean, default: true },
  cooldownMinutes: { type: Number, default: 60 },
  devModeEnabled: { type: Boolean, default: false },
  devModeRoles: [{ type: String }],
  logChannelId: { type: String },
  transcriptChannelId: { type: String },
  blockedUsers: [{ type: String }],
  maxActiveTickets: { type: Number, default: 5 },
  ticketCategories: [TicketCategorySchema],
  customBotToken: { type: String },
  customDomain: { type: String }
});

const GuildSchema = new Schema<IGuild>({
  guildId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  icon: { type: String },
  ownerId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  subscriptionTier: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'], 
    default: 'free' 
  },
  config: { type: GuildConfigSchema, default: () => ({}) },
  nextTicketNumber: { type: Number, default: 1 },
  totalTickets: { type: Number, default: 0 },
  activeTickets: { type: Number, default: 0 }
}, {
  timestamps: true
});

GuildSchema.index({ guildId: 1 });
GuildSchema.index({ ownerId: 1 });
GuildSchema.index({ subscriptionTier: 1 });

export const Guild = model<IGuild>('Guild', GuildSchema);