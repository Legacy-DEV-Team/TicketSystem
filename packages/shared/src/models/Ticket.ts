import { Schema, model, Document } from 'mongoose';

export interface ITicketMessage {
  id: string;
  authorId: string;
  authorUsername: string;
  content: string;
  attachments: string[];
  timestamp: Date;
  isBot: boolean;
}

export interface ITicket extends Document {
  guildId: string;
  ticketNumber: number;
  threadId: string;
  channelId: string;
  categoryId: string;
  userId: string;
  username: string;
  status: 'open' | 'closed' | 'pending_close';
  reason?: string;
  customName?: string;
  messages: ITicketMessage[];
  participants: string[];
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  lastActivity: Date;
  autoCloseAt?: Date;
  closedAt?: Date;
  closedBy?: string;
  transcriptUrl?: string;
  transcriptPath?: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema({
  id: { type: String, required: true },
  authorId: { type: String, required: true },
  authorUsername: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  timestamp: { type: Date, required: true },
  isBot: { type: Boolean, default: false }
});

const TicketSchema = new Schema<ITicket>({
  guildId: { type: String, required: true, index: true },
  ticketNumber: { type: Number, required: true },
  threadId: { type: String, required: true, unique: true, index: true },
  channelId: { type: String, required: true },
  categoryId: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'closed', 'pending_close'], 
    default: 'open',
    index: true
  },
  reason: { type: String },
  customName: { type: String },
  messages: [TicketMessageSchema],
  participants: [{ type: String }],
  assignedTo: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  tags: [{ type: String }],
  lastActivity: { type: Date, default: Date.now, index: true },
  autoCloseAt: { type: Date },
  closedAt: { type: Date },
  closedBy: { type: String },
  transcriptUrl: { type: String },
  transcriptPath: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
}, {
  timestamps: true
});

TicketSchema.index({ guildId: 1, ticketNumber: 1 }, { unique: true });
TicketSchema.index({ guildId: 1, status: 1 });
TicketSchema.index({ userId: 1, status: 1 });
TicketSchema.index({ lastActivity: 1 });
TicketSchema.index({ autoCloseAt: 1 });

export const Ticket = model<ITicket>('Ticket', TicketSchema);