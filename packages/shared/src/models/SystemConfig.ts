import { Schema, model, Document } from 'mongoose';

export interface IPaymentConfig {
  stripe: {
    publicKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    enabled: boolean;
  };
  paypal: {
    clientId?: string;
    clientSecret?: string;
    webhookId?: string;
    environment: 'sandbox' | 'production';
    enabled: boolean;
  };
  patreon: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    enabled: boolean;
  };
}

export interface IDiscordConfig {
  defaultBot: {
    token?: string;
    clientId?: string;
    clientSecret?: string;
    enabled: boolean;
  };
  oauth: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };
}

export interface ISystemConfig extends Document {
  name: 'system';
  discord: IDiscordConfig;
  payments: IPaymentConfig;
  encryption: {
    masterKey?: string;
    jwtPrivateKey?: string;
    jwtPublicKey?: string;
  };
  domain: {
    primary: string;
    allowCustomDomains: boolean;
    sslEnabled: boolean;
  };
  features: {
    maxFreeGuilds: number;
    maxProGuilds: number;
    maxEnterpriseGuilds: number;
    transcriptRetentionDays: number;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
    allowedUsers: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentConfigSchema = new Schema({
  stripe: {
    publicKey: { type: String },
    secretKey: { type: String },
    webhookSecret: { type: String },
    enabled: { type: Boolean, default: false }
  },
  paypal: {
    clientId: { type: String },
    clientSecret: { type: String },
    webhookId: { type: String },
    environment: { type: String, enum: ['sandbox', 'production'], default: 'sandbox' },
    enabled: { type: Boolean, default: false }
  },
  patreon: {
    clientId: { type: String },
    clientSecret: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    enabled: { type: Boolean, default: false }
  }
});

const DiscordConfigSchema = new Schema({
  defaultBot: {
    token: { type: String },
    clientId: { type: String },
    clientSecret: { type: String },
    enabled: { type: Boolean, default: false }
  },
  oauth: {
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String }
  }
});

const SystemConfigSchema = new Schema<ISystemConfig>({
  name: { type: String, default: 'system', unique: true },
  discord: { type: DiscordConfigSchema, default: () => ({}) },
  payments: { type: PaymentConfigSchema, default: () => ({}) },
  encryption: {
    masterKey: { type: String },
    jwtPrivateKey: { type: String },
    jwtPublicKey: { type: String }
  },
  domain: {
    primary: { type: String, default: 'localhost:3000' },
    allowCustomDomains: { type: Boolean, default: false },
    sslEnabled: { type: Boolean, default: false }
  },
  features: {
    maxFreeGuilds: { type: Number, default: 1 },
    maxProGuilds: { type: Number, default: 5 },
    maxEnterpriseGuilds: { type: Number, default: -1 },
    transcriptRetentionDays: { type: Number, default: 365 }
  },
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: { type: String },
    allowedUsers: [{ type: String }]
  }
}, {
  timestamps: true
});

export const SystemConfig = model<ISystemConfig>('SystemConfig', SystemConfigSchema);