import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  passwordHash?: string;
  refreshTokens: string[];
  isAdmin: boolean;
  subscriptionStatus: 'free' | 'pro' | 'enterprise';
  subscriptionId?: string;
  subscriptionExpires?: Date;
  accessibleGuilds: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar: { type: String },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  refreshTokens: [{ type: String }],
  isAdmin: { type: Boolean, default: false },
  subscriptionStatus: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'], 
    default: 'free' 
  },
  subscriptionId: { type: String },
  subscriptionExpires: { type: Date },
  accessibleGuilds: [{ type: String }],
  lastLogin: { type: Date }
}, {
  timestamps: true
});

UserSchema.index({ discordId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ subscriptionStatus: 1 });

export const User = model<IUser>('User', UserSchema);