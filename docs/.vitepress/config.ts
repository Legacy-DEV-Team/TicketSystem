import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Ticket System',
  description: 'Professional Discord ticket management system documentation',
  // Custom domain: docs.ticketsystem.fyi
  // Backup domain: legacy-dev-team.github.io/TicketSystem
  base: '/',
  
  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/icon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/icon.png' }],
    ['meta', { name: 'theme-color', content: '#5865f2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Ticket System | Documentation' }],
    ['meta', { property: 'og:site_name', content: 'Ticket System' }],
    ['meta', { property: 'og:image', content: 'https://docs.ticketsystem.fyi/logo.png' }],
    ['meta', { property: 'og:url', content: 'https://docs.ticketsystem.fyi/' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/overview' },
      { text: 'Examples', link: '/examples/basic-setup' },
      { 
        text: 'Legal',
        items: [
          { text: 'Legal Overview', link: '/legal' },
          { text: 'Terms of Service', link: '/terms-of-service' },
          { text: 'Privacy Policy', link: '/privacy-policy' },
          { text: 'Cookie Policy', link: '/cookie-policy' }
        ]
      },
      { 
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/Legacy-DEV-Team/TicketSystem/blob/main/CHANGELOG.md' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'First Setup', link: '/guide/first-setup' }
          ]
        },
        {
          text: 'Bot Configuration',
          collapsed: false,
          items: [
            { text: 'Discord Bot Setup', link: '/guide/bot-setup' },
            { text: 'Permissions & Roles', link: '/guide/permissions' },
            { text: 'Ticket Categories', link: '/guide/categories' },
            { text: 'Auto-Close System', link: '/guide/auto-close' }
          ]
        },
        {
          text: 'Web Panel',
          collapsed: false,
          items: [
            { text: 'Dashboard Overview', link: '/guide/dashboard' },
            { text: 'User Management', link: '/guide/user-management' },
            { text: 'Analytics & Reports', link: '/guide/analytics' },
            { text: 'Custom Domains', link: '/guide/custom-domains' }
          ]
        },
        {
          text: 'Advanced Features',
          collapsed: false,
          items: [
            { text: 'Multi-Guild Management', link: '/guide/multi-guild' },
            { text: 'Custom Bot Tokens', link: '/guide/custom-bots' },
            { text: 'Webhooks & Integrations', link: '/guide/webhooks' },
            { text: 'Transcripts & Export', link: '/guide/transcripts' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Rate Limiting', link: '/api/rate-limiting' },
            { text: 'Error Handling', link: '/api/errors' }
          ]
        },
        {
          text: 'Endpoints',
          collapsed: false,
          items: [
            { text: 'System Config', link: '/api/system-config' },
            { text: 'Guilds', link: '/api/guilds' },
            { text: 'Tickets', link: '/api/tickets' },
            { text: 'Users', link: '/api/users' },
            { text: 'Subscriptions', link: '/api/subscriptions' },
            { text: 'Analytics', link: '/api/analytics' }
          ]
        },
        {
          text: 'Webhooks',
          collapsed: false,
          items: [
            { text: 'Webhook Overview', link: '/api/webhooks/overview' },
            { text: 'Ticket Events', link: '/api/webhooks/tickets' },
            { text: 'User Events', link: '/api/webhooks/users' },
            { text: 'Subscription Events', link: '/api/webhooks/subscriptions' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: 'Deployment',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/deployment/overview' },
            { text: 'Docker', link: '/deployment/docker' },
            { text: 'Railway', link: '/deployment/railway' },
            { text: 'Heroku', link: '/deployment/heroku' },
            { text: 'VPS Setup', link: '/deployment/vps' }
          ]
        },
        {
          text: 'Production',
          collapsed: false,
          items: [
            { text: 'Environment Variables', link: '/deployment/environment' },
            { text: 'Database Setup', link: '/deployment/database' },
            { text: 'SSL & Security', link: '/deployment/security' },
            { text: 'Monitoring', link: '/deployment/monitoring' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Basic Setup', link: '/examples/basic-setup' },
            { text: 'Multi-Server Bot', link: '/examples/multi-server' },
            { text: 'Custom Integration', link: '/examples/custom-integration' },
            { text: 'Webhook Handling', link: '/examples/webhooks' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Legacy-DEV-Team/TicketSystem' },
      { icon: 'discord', link: 'https://discord.gg/tb3KrFc2ED' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Ticket System',
      links: [
        { text: 'Terms of Service', link: '/terms-of-service' },
        { text: 'Privacy Policy', link: '/privacy-policy' },
        { text: 'Cookie Policy', link: '/cookie-policy' }
      ]
    },

    editLink: {
              pattern: 'https://github.com/Legacy-DEV-Team/TicketSystem/edit/main/docs/:path'
    },

    search: {
      provider: 'local'
    }
  }
})