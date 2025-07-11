import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';
import { CronJob } from 'cron';
import {
  DatabaseService,
  logger,
  AuthService,
  SystemConfig,
  Guild
} from '@ticket-system/shared';

import { ButtonHandler } from './handlers/buttonHandler';
import { ModalHandler } from './handlers/modalHandler';
import { SelectHandler } from './handlers/selectHandler';
import { TicketHandler } from './handlers/ticketHandler';
import { AutoCloseService } from './services/autoCloseService';
import { TranscriptService } from './services/transcriptService';

class DiscordBot {
  public client: Client;
  private app: express.Application;
  private buttonHandler: ButtonHandler;
  private modalHandler: ModalHandler;
  private selectHandler: SelectHandler;
  private ticketHandler: TicketHandler;
  private autoCloseService: AutoCloseService;
  private transcriptService: TranscriptService;
  private customBots: Map<string, Client> = new Map();

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    });

    this.app = express();
    this.app.use(express.json());

    this.buttonHandler = new ButtonHandler();
    this.modalHandler = new ModalHandler();
    this.selectHandler = new SelectHandler();
    this.ticketHandler = new TicketHandler();
    this.autoCloseService = new AutoCloseService();
    this.transcriptService = new TranscriptService();

    this.setupEventHandlers();
    this.setupWebhookServer();
    this.startAutoCloseJob();
  }

  private setupEventHandlers() {
    this.client.once('ready', async () => {
      logger.info(`Bot logged in as ${this.client.user?.tag}`);
      await this.initializeCustomBots();
    });

    this.client.on('interactionCreate', async (interaction) => {
      try {
        if (interaction.isButton()) {
          await this.buttonHandler.handle(interaction);
        } else if (interaction.isModalSubmit()) {
          await this.modalHandler.handle(interaction);
        } else if (interaction.isStringSelectMenu()) {
          await this.selectHandler.handle(interaction);
        }
      } catch (error) {
        logger.error('Error handling interaction:', error);
      }
    });

    this.client.on('threadUpdate', async (oldThread, newThread) => {
      if (newThread.archived && !oldThread.archived) {
        await this.ticketHandler.handleThreadArchived(newThread);
      }
    });

    this.client.on('guildCreate', async (guild) => {
      logger.info(`Bot added to guild: ${guild.name} (${guild.id})`);
      await this.ticketHandler.initializeGuild(guild);
    });

    this.client.on('guildDelete', async (guild) => {
      logger.info(`Bot removed from guild: ${guild.name} (${guild.id})`);
      await Guild.findOneAndUpdate(
        { guildId: guild.id },
        { isActive: false }
      );
    });
  }

  private setupWebhookServer() {
    this.app.post('/webhook/config-update', async (req, res) => {
      try {
        const { guildId, config } = req.body;
        await this.handleConfigUpdate(guildId, config);
        res.status(200).json({ success: true });
      } catch (error) {
        logger.error('Error handling config update:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    this.app.post('/webhook/bot-restart', async (req, res) => {
      try {
        const { guildId } = req.body;
        await this.restartCustomBot(guildId);
        res.status(200).json({ success: true });
      } catch (error) {
        logger.error('Error restarting custom bot:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        botStatus: this.client.readyAt ? 'ready' : 'not ready'
      });
    });

    const port = process.env.BOT_WEBHOOK_PORT || 3001;
    this.app.listen(port, () => {
      logger.info(`Bot webhook server listening on port ${port}`);
    });
  }

  private async initializeCustomBots() {
    try {
      const guilds = await Guild.find({
        'config.customBotToken': { $exists: true, $ne: null },
        isActive: true
      });

      for (const guild of guilds) {
        if (guild.config.customBotToken) {
          await this.createCustomBot(guild.guildId, guild.config.customBotToken);
        }
      }
    } catch (error) {
      logger.error('Error initializing custom bots:', error);
    }
  }

  private async createCustomBot(guildId: string, token: string) {
    try {
      if (this.customBots.has(guildId)) {
        await this.destroyCustomBot(guildId);
      }

      const customClient = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers
        ]
      });

      customClient.on('ready', () => {
        logger.info(`Custom bot for guild ${guildId} is ready`);
      });

      customClient.on('interactionCreate', async (interaction) => {
        if (interaction.guildId !== guildId) return;

        try {
          if (interaction.isButton()) {
            await this.buttonHandler.handle(interaction);
          } else if (interaction.isModalSubmit()) {
            await this.modalHandler.handle(interaction);
          } else if (interaction.isStringSelectMenu()) {
            await this.selectHandler.handle(interaction);
          }
        } catch (error) {
          logger.error(`Error handling custom bot interaction for guild ${guildId}:`, error);
        }
      });

      await customClient.login(token);
      this.customBots.set(guildId, customClient);

      logger.info(`Custom bot created for guild ${guildId}`);
    } catch (error) {
      logger.error(`Error creating custom bot for guild ${guildId}:`, error);
    }
  }

  private async destroyCustomBot(guildId: string) {
    const customBot = this.customBots.get(guildId);
    if (customBot) {
      await customBot.destroy();
      this.customBots.delete(guildId);
      logger.info(`Custom bot destroyed for guild ${guildId}`);
    }
  }

  private async restartCustomBot(guildId: string) {
    const guild = await Guild.findOne({ guildId });
    if (guild?.config.customBotToken) {
      await this.createCustomBot(guildId, guild.config.customBotToken);
    }
  }

  private async handleConfigUpdate(guildId: string, config: any) {
    const guild = await Guild.findOne({ guildId });
    if (!guild) return;

    if (config.customBotToken && config.customBotToken !== guild.config.customBotToken) {
      await this.createCustomBot(guildId, config.customBotToken);
    } else if (!config.customBotToken && guild.config.customBotToken) {
      await this.destroyCustomBot(guildId);
    }
  }

  private startAutoCloseJob() {
    new CronJob('0 */5 * * * *', async () => {
      try {
        await this.autoCloseService.processAutoClose();
      } catch (error) {
        logger.error('Error in auto-close job:', error);
      }
    }, null, true);

    logger.info('Auto-close job started (runs every 5 minutes)');
  }

  public getBotForGuild(guildId: string): Client {
    return this.customBots.get(guildId) || this.client;
  }

  public async start() {
    try {
      await DatabaseService.getInstance().connectMongoDB(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-system'
      );

      await DatabaseService.getInstance().connectRedis(
        process.env.REDIS_URL || 'redis://localhost:6379'
      );

      const systemConfig = await SystemConfig.findOne({ name: 'system' });
      if (!systemConfig?.discord.defaultBot.token) {
        throw new Error('Default bot token not configured in system settings');
      }

      await AuthService.getInstance().initialize();

      await this.client.login(systemConfig.discord.defaultBot.token);

      logger.info('Discord bot started successfully');
    } catch (error) {
      logger.error('Error starting bot:', error);
      process.exit(1);
    }
  }

  public async stop() {
    await this.client.destroy();
    
    for (const [, customBot] of this.customBots) {
      await customBot.destroy();
    }
    
    await DatabaseService.getInstance().disconnect();
    logger.info('Bot stopped successfully');
  }
}

const bot = new DiscordBot();

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await bot.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await bot.stop();
  process.exit(0);
});

bot.start();