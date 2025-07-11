import { NextRequest, NextResponse } from 'next/server';

// Simplified system config interface
interface SystemConfig {
  discord: {
    defaultBot: {
      token?: string;
      clientId?: string;
      clientSecret?: string;
      enabled: boolean;
    };
    oauth: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
    };
  };
  payments: {
    stripe: {
      publicKey?: string;
      secretKey?: string;
      webhookSecret?: string;
      enabled: boolean;
    };
    paypal: {
      clientId?: string;
      clientSecret?: string;
      webhookId?: string;
      environment: 'sandbox' | 'production';
      enabled: boolean;
    };
    patreon: {
      clientId?: string;
      clientSecret?: string;
      accessToken?: string;
      refreshToken?: string;
      enabled: boolean;
    };
  };
  domain: {
    primary: string;
    allowCustomDomains: boolean;
    sslEnabled: boolean;
  };
  features: {
    maxFreeGuilds: number;
    maxProGuilds: number;
    maxEnterpriseGuilds: number;
    transcriptRetentionDays: number;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
    allowedUsers: string[];
  };
}

export async function GET(_request: NextRequest) {
  try {
    // TODO: Implement proper database connection
    // For now, return a mock configuration
    const config: SystemConfig = {
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
      },
      domain: {
        primary: 'localhost:3000',
        allowCustomDomains: false,
        sslEnabled: false
      },
      features: {
        maxFreeGuilds: 1,
        maxProGuilds: 5,
        maxEnterpriseGuilds: -1,
        transcriptRetentionDays: 365
      },
      maintenance: {
        enabled: false,
        allowedUsers: []
      }
    };

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
    console.error('Error fetching system config:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    // TODO: Implement proper database operations
    
    console.log('System configuration updated');

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating system config:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section } = body;

    // TODO: Add authentication check for admin users
    // TODO: Implement proper database operations

    console.log(`System configuration section '${section}' updated`);

    return NextResponse.json({
      success: true,
      message: `${section} configuration updated successfully`
    });

  } catch (error) {
    console.error('Error updating system config section:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}