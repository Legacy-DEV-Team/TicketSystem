import { NextRequest, NextResponse } from 'next/server';
import {
  DatabaseService,
  SystemConfig,
  AuthService,
  logger,
  SystemConfigSchema,
  validateInput
} from '@discord-ticket-saas/shared';

export async function GET(request: NextRequest) {
  try {
    await DatabaseService.getInstance().connectMongoDB(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-ticket-saas'
    );

    let config = await SystemConfig.findOne({ name: 'system' });
    
    if (!config) {
      config = new SystemConfig({
        name: 'system',
        discord: {
          defaultBot: {
            enabled: false
          },
          oauth: {}
        },
        payments: {
          stripe: { enabled: false },
          paypal: { enabled: false, environment: 'sandbox' },
          patreon: { enabled: false }
        }
      });
      await config.save();
    }

    // Don't send sensitive data to client
    const safeConfig = {
      discord: {
        defaultBot: {
          clientId: config.discord.defaultBot.clientId,
          enabled: config.discord.defaultBot.enabled
        },
        oauth: {
          clientId: config.discord.oauth.clientId,
          redirectUri: config.discord.oauth.redirectUri
        }
      },
      payments: {
        stripe: {
          publicKey: config.payments.stripe.publicKey,
          enabled: config.payments.stripe.enabled
        },
        paypal: {
          clientId: config.payments.paypal.clientId,
          environment: config.payments.paypal.environment,
          enabled: config.payments.paypal.enabled
        },
        patreon: {
          clientId: config.payments.patreon.clientId,
          enabled: config.payments.patreon.enabled
        }
      },
      domain: config.domain,
      features: config.features,
      maintenance: config.maintenance
    };

    return NextResponse.json({
      success: true,
      data: safeConfig
    });

  } catch (error) {
    logger.error('Error fetching system config:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Add authentication check for admin users
    
    await DatabaseService.getInstance().connectMongoDB(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-ticket-saas'
    );

    const validatedData = validateInput(SystemConfigSchema, body);

    let config = await SystemConfig.findOne({ name: 'system' });
    
    if (!config) {
      config = new SystemConfig({ name: 'system' });
    }

    // Update configuration
    config.discord = validatedData.discord;
    config.payments = validatedData.payments;
    config.domain = validatedData.domain;
    config.features = validatedData.features;

    // Handle encryption keys if provided
    if (body.encryption?.masterKey) {
      config.encryption.masterKey = body.encryption.masterKey;
      AuthService.getInstance().setMasterKey(body.encryption.masterKey);
    }

    if (body.encryption?.jwtPrivateKey && body.encryption?.jwtPublicKey) {
      config.encryption.jwtPrivateKey = body.encryption.jwtPrivateKey;
      config.encryption.jwtPublicKey = body.encryption.jwtPublicKey;
      AuthService.getInstance().setJWTKeys(
        body.encryption.jwtPrivateKey,
        body.encryption.jwtPublicKey
      );
    }

    await config.save();

    // Notify bot about configuration changes
    if (body.discord?.defaultBot?.token !== config.discord.defaultBot.token) {
      await fetch(`${process.env.BOT_WEBHOOK_URL || 'http://localhost:3001'}/webhook/config-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'default_bot_token_update',
          token: body.discord.defaultBot.token
        })
      }).catch(err => logger.error('Failed to notify bot:', err));
    }

    logger.info('System configuration updated');

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully'
    });

  } catch (error) {
    logger.error('Error updating system config:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;

    // TODO: Add authentication check for admin users

    await DatabaseService.getInstance().connectMongoDB(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-ticket-saas'
    );

    const config = await SystemConfig.findOne({ name: 'system' });
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'System configuration not found' },
        { status: 404 }
      );
    }

    // Update specific section
    switch (section) {
      case 'discord':
        config.discord = { ...config.discord, ...data };
        break;
      case 'payments':
        config.payments = { ...config.payments, ...data };
        break;
      case 'domain':
        config.domain = { ...config.domain, ...data };
        break;
      case 'features':
        config.features = { ...config.features, ...data };
        break;
      case 'maintenance':
        config.maintenance = { ...config.maintenance, ...data };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid section' },
          { status: 400 }
        );
    }

    await config.save();

    logger.info(`System configuration section '${section}' updated`);

    return NextResponse.json({
      success: true,
      message: `${section} configuration updated successfully`
    });

  } catch (error) {
    logger.error('Error updating system config section:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}