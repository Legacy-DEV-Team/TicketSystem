import { ModalSubmitInteraction } from 'discord.js';
import { logger } from '@ticket-system/shared';

export class ModalHandler {
  async handle(interaction: ModalSubmitInteraction) {
    const [action, ...params] = interaction.customId.split('_');

    switch (action) {
      case 'rename':
        await this.handleRenameTicket(interaction);
        break;
      default:
        await interaction.reply({
          content: 'Unknown modal interaction.',
          ephemeral: true
        });
    }
  }

  private async handleRenameTicket(interaction: ModalSubmitInteraction) {
    await interaction.reply({
      content: 'Rename ticket functionality will be implemented.',
      ephemeral: true
    });
  }
}