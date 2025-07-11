import { Ticket, Guild, logger, ITicket } from '@ticket-system/shared';
import { TranscriptService } from './transcriptService';

export class AutoCloseService {
  private transcriptService: TranscriptService;

  constructor() {
    this.transcriptService = new TranscriptService();
  }

  async processAutoClose() {
    try {
      const expiredTickets = await Ticket.find({
        status: 'open',
        autoCloseAt: { $lte: new Date() }
      });

      for (const ticket of expiredTickets) {
        await this.closeTicket(ticket);
      }

      if (expiredTickets.length > 0) {
        logger.info(`Auto-closed ${expiredTickets.length} tickets`);
      }
    } catch (error) {
      logger.error('Error in auto-close process:', error);
    }
  }

  private async closeTicket(ticket: ITicket) {
    try {
      await this.transcriptService.generateTranscript(ticket);
      
      ticket.status = 'closed';
      ticket.closedBy = 'system';
      ticket.closedAt = new Date();
      await ticket.save();

      await Guild.findOneAndUpdate(
        { guildId: ticket.guildId },
        { $inc: { activeTickets: -1 } }
      );

      logger.info(`Auto-closed ticket ${ticket.ticketNumber} in guild ${ticket.guildId}`);
    } catch (error) {
      logger.error(`Error auto-closing ticket ${ticket.ticketNumber}:`, error);
    }
  }
}