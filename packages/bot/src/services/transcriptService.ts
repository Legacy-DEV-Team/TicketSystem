import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@ticket-system/shared';

export class TranscriptService {
  private transcriptDir: string;

  constructor() {
    this.transcriptDir = path.join(process.cwd(), '../../transcripts');
    this.ensureDirectoryExists();
  }

  async generateTranscript(ticket: any): Promise<string> {
    try {
      const guildDir = path.join(this.transcriptDir, ticket.guildId);
      if (!fs.existsSync(guildDir)) {
        fs.mkdirSync(guildDir, { recursive: true });
      }

      const fileName = `ticket-${ticket.ticketNumber.toString().padStart(4, '0')}.html`;
      const filePath = path.join(guildDir, fileName);

      const html = this.generateHTML(ticket);
      fs.writeFileSync(filePath, html, 'utf8');

      const transcriptUrl = `/transcripts/${ticket.guildId}/${fileName}`;
      
      ticket.transcriptPath = filePath;
      ticket.transcriptUrl = transcriptUrl;
      await ticket.save();

      logger.info(`Generated transcript for ticket ${ticket.ticketNumber}`);
      return transcriptUrl;
    } catch (error) {
      logger.error('Error generating transcript:', error);
      throw error;
    }
  }

  private generateHTML(ticket: any): string {
    const messages = ticket.messages || [];
    
    const messagesHtml = messages.map((msg: any) => `
      <div class="message">
        <div class="message-header">
          <span class="author">${msg.authorUsername}</span>
          <span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
        </div>
        <div class="message-content">${msg.content}</div>
        ${msg.attachments.length > 0 ? `
          <div class="attachments">
            ${msg.attachments.map((url: string) => `<a href="${url}" target="_blank">Attachment</a>`).join(', ')}
          </div>
        ` : ''}
      </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket ${ticket.ticketNumber} - ${ticket.username}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .ticket-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .info-item { background: #f8f9fa; padding: 10px; border-radius: 4px; }
        .messages { margin-top: 20px; }
        .message { margin-bottom: 15px; padding: 10px; border-left: 3px solid #007bff; background: #f8f9fa; }
        .message-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; }
        .author { color: #007bff; }
        .timestamp { color: #666; font-size: 0.9em; }
        .message-content { margin: 5px 0; }
        .attachments { margin-top: 5px; font-size: 0.9em; }
        .attachments a { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket #${ticket.ticketNumber}</h1>
            <div class="ticket-info">
                <div class="info-item"><strong>User:</strong> ${ticket.username}</div>
                <div class="info-item"><strong>Status:</strong> ${ticket.status}</div>
                <div class="info-item"><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</div>
                <div class="info-item"><strong>Closed:</strong> ${ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : 'N/A'}</div>
            </div>
        </div>
        <div class="messages">
            <h2>Messages</h2>
            ${messagesHtml || '<p>No messages in this ticket.</p>'}
        </div>
    </div>
</body>
</html>`;
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.transcriptDir)) {
      fs.mkdirSync(this.transcriptDir, { recursive: true });
    }
  }
}