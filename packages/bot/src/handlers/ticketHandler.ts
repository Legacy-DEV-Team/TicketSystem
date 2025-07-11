import { Guild as DiscordGuild, ThreadChannel } from 'discord.js';
import { Guild, Ticket, logger } from '@ticket-system/shared';

export class TicketHandler {
  async createTicket(data: {
    guildId: string;
    categoryId: string;
    userId: string;
    username: string;
    channelId: string;
  }) {
    const guild = await Guild.findOne({ guildId: data.guildId });
    if (!guild) throw new Error('Guild not found');

    const ticketNumber = guild.nextTicketNumber;
    
    const ticket = new Ticket({
      guildId: data.guildId,
      ticketNumber,
      threadId: 'placeholder',
      channelId: data.channelId,
      categoryId: data.categoryId,
      userId: data.userId,
      username: data.username,
      status: 'open'
    });

    await ticket.save();
    
    await Guild.findByIdAndUpdate(guild._id, {
      $inc: { nextTicketNumber: 1, totalTickets: 1, activeTickets: 1 }
    });

    return ticket;
  }

  async closeTicket(threadId: string, closedBy: string) {
    const ticket = await Ticket.findOne({ threadId });
    if (!ticket) return null;

    ticket.status = 'closed';
    ticket.closedBy = closedBy;
    ticket.closedAt = new Date();
    await ticket.save();

    await Guild.findOneAndUpdate(
      { guildId: ticket.guildId },
      { $inc: { activeTickets: -1 } }
    );

    return ticket;
  }

  async initializeGuild(discordGuild: DiscordGuild) {
    const existingGuild = await Guild.findOne({ guildId: discordGuild.id });
    if (existingGuild) {
      existingGuild.isActive = true;
      await existingGuild.save();
      return;
    }

    const guild = new Guild({
      guildId: discordGuild.id,
      name: discordGuild.name,
      icon: discordGuild.icon,
      ownerId: discordGuild.ownerId,
      isActive: true
    });

    await guild.save();
    logger.info(`Initialized guild: ${discordGuild.name} (${discordGuild.id})`);
  }

  async handleThreadArchived(thread: ThreadChannel) {
    const ticket = await Ticket.findOne({ threadId: thread.id });
    if (ticket && ticket.status === 'open') {
      await this.closeTicket(thread.id, 'system');
      logger.info(`Auto-closed ticket ${ticket.ticketNumber} due to thread archive`);
    }
  }
}