'use client'

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

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

export default function AdminPage() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/system-config');
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to load configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading configuration' });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Configuration saved successfully' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving configuration' });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (path: string, value: any) => {
    if (!config) return;
    
    const keys = path.split('.');
    const newConfig = { ...config };
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateKeys = async () => {
    const masterKey = btoa(Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => String.fromCharCode(b)).join(''));
    updateConfig('encryption.masterKey', masterKey);
    
    setMessage({ type: 'success', text: 'New encryption keys generated' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading configuration...</span>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Configuration</h2>
          <button 
            onClick={fetchConfig}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Discord Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Discord Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Bot Token
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.botToken ? 'text' : 'password'}
                    value={config.discord.defaultBot.token || ''}
                    onChange={(e) => updateConfig('discord.defaultBot.token', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bot token from Discord Developer Portal"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('botToken')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets.botToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Client ID
                </label>
                <input
                  type="text"
                  value={config.discord.defaultBot.clientId || ''}
                  onChange={(e) => updateConfig('discord.defaultBot.clientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bot application ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Client Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.botSecret ? 'text' : 'password'}
                    value={config.discord.defaultBot.clientSecret || ''}
                    onChange={(e) => updateConfig('discord.defaultBot.clientSecret', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bot application secret"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('botSecret')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets.botSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OAuth Client ID
                </label>
                <input
                  type="text"
                  value={config.discord.oauth.clientId || ''}
                  onChange={(e) => updateConfig('discord.oauth.clientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="OAuth application ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OAuth Client Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.oauthSecret ? 'text' : 'password'}
                    value={config.discord.oauth.clientSecret || ''}
                    onChange={(e) => updateConfig('discord.oauth.clientSecret', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="OAuth application secret"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('oauthSecret')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets.oauthSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="botEnabled"
                  checked={config.discord.defaultBot.enabled}
                  onChange={(e) => updateConfig('discord.defaultBot.enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="botEnabled" className="ml-2 text-sm text-gray-700">
                  Enable default bot
                </label>
              </div>
            </div>
          </div>

          {/* Payment Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Configuration</h2>
            
            {/* Stripe */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Stripe</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publishable Key
                  </label>
                  <input
                    type="text"
                    value={config.payments.stripe.publicKey || ''}
                    onChange={(e) => updateConfig('payments.stripe.publicKey', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="pk_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.stripeSecret ? 'text' : 'password'}
                      value={config.payments.stripe.secretKey || ''}
                      onChange={(e) => updateConfig('payments.stripe.secretKey', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="sk_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('stripeSecret')}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.stripeSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.stripeWebhook ? 'text' : 'password'}
                      value={config.payments.stripe.webhookSecret || ''}
                      onChange={(e) => updateConfig('payments.stripe.webhookSecret', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="whsec_..."
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('stripeWebhook')}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.stripeWebhook ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="stripeEnabled"
                    checked={config.payments.stripe.enabled}
                    onChange={(e) => updateConfig('payments.stripe.enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="stripeEnabled" className="ml-2 text-sm text-gray-700">
                    Enable Stripe payments
                  </label>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">PayPal</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={config.payments.paypal.clientId || ''}
                    onChange={(e) => updateConfig('payments.paypal.clientId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.paypalSecret ? 'text' : 'password'}
                      value={config.payments.paypal.clientSecret || ''}
                      onChange={(e) => updateConfig('payments.paypal.clientSecret', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('paypalSecret')}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.paypalSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Environment
                  </label>
                  <select
                    value={config.payments.paypal.environment}
                    onChange={(e) => updateConfig('payments.paypal.environment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="paypalEnabled"
                    checked={config.payments.paypal.enabled}
                    onChange={(e) => updateConfig('payments.paypal.enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="paypalEnabled" className="ml-2 text-sm text-gray-700">
                    Enable PayPal payments
                  </label>
                </div>
              </div>
            </div>

            {/* Patreon */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Patreon</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={config.payments.patreon.clientId || ''}
                    onChange={(e) => updateConfig('payments.patreon.clientId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.patreonSecret ? 'text' : 'password'}
                      value={config.payments.patreon.clientSecret || ''}
                      onChange={(e) => updateConfig('payments.patreon.clientSecret', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('patreonSecret')}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.patreonSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="patreonEnabled"
                    checked={config.payments.patreon.enabled}
                    onChange={(e) => updateConfig('payments.patreon.enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="patreonEnabled" className="ml-2 text-sm text-gray-700">
                    Enable Patreon integration
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain & Security</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Domain
                </label>
                <input
                  type="text"
                  value={config.domain.primary}
                  onChange={(e) => updateConfig('domain.primary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-domain.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowCustomDomains"
                  checked={config.domain.allowCustomDomains}
                  onChange={(e) => updateConfig('domain.allowCustomDomains', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowCustomDomains" className="ml-2 text-sm text-gray-700">
                  Allow custom domains for premium users
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sslEnabled"
                  checked={config.domain.sslEnabled}
                  onChange={(e) => updateConfig('domain.sslEnabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sslEnabled" className="ml-2 text-sm text-gray-700">
                  Force SSL/HTTPS
                </label>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={generateKeys}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Generate New Encryption Keys</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  This will generate new master encryption keys for the system. Existing encrypted data will need to be re-encrypted.
                </p>
              </div>
            </div>
          </div>

          {/* Features Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Limits</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Free Guilds
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.features.maxFreeGuilds}
                  onChange={(e) => updateConfig('features.maxFreeGuilds', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Pro Guilds
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.features.maxProGuilds}
                  onChange={(e) => updateConfig('features.maxProGuilds', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Enterprise Guilds (-1 for unlimited)
                </label>
                <input
                  type="number"
                  min="-1"
                  value={config.features.maxEnterpriseGuilds}
                  onChange={(e) => updateConfig('features.maxEnterpriseGuilds', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transcript Retention (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.features.transcriptRetentionDays}
                  onChange={(e) => updateConfig('features.transcriptRetentionDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}