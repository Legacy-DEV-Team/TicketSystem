import { StringSelectMenuInteraction } from 'discord.js';
import { logger } from '@discord-ticket-saas/shared';

export class SelectHandler {
  async handle(interaction: StringSelectMenuInteraction) {
    const [action, ...params] = interaction.customId.split('_');

    switch (action) {
      case 'move':
        await this.handleMoveTicket(interaction);
        break;
      default:
        await interaction.reply({
          content: 'Unknown select menu interaction.',
          ephemeral: true
        });
    }
  }

  private async handleMoveTicket(interaction: StringSelectMenuInteraction) {
    await interaction.reply({
      content: 'Move ticket functionality will be implemented.',
      ephemeral: true
    });
  }
}