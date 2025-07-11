import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  guildId: string;
  provider: 'stripe' | 'paypal' | 'patreon';
  subscriptionId: string;
  customerId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  webhookData: Record<string, unknown>[];
  metadata: Map<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true, index: true },
  guildId: { type: String, required: true, index: true },
  provider: { 
    type: String, 
    enum: ['stripe', 'paypal', 'patreon'], 
    required: true 
  },
  subscriptionId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  plan: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'past_due', 'unpaid'], 
    required: true,
    index: true
  },
  currentPeriodStart: { type: Date, required: true },
  currentPeriodEnd: { type: Date, required: true, index: true },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  interval: { type: String, enum: ['month', 'year'], required: true },
  webhookData: [{ type: Schema.Types.Mixed }],
  metadata: { type: Map, of: Schema.Types.Mixed }
}, {
  timestamps: true
});

SubscriptionSchema.index({ userId: 1, guildId: 1 });
SubscriptionSchema.index({ provider: 1, subscriptionId: 1 });
SubscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);