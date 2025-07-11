---
layout: home

hero:
  name: "Ticket System"
  text: "Professional Discord Ticket Management"
  tagline: Multi-guild support, custom domains, and enterprise-grade security
  image:
    src: /logo.svg
    alt: Ticket System
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/Legacy-DEV-Team/TicketSystem
    - theme: alt
      text: Live Demo
      link: https://ticketsystem.fyi/dashboard

features:
  - icon: 🎫
    title: Thread-Based Tickets
    details: Modern Discord threads with automatic numbering and rich formatting. No slash commands needed - everything works with buttons.

  - icon: 🏢
    title: Multi-Guild Management
    details: Manage unlimited Discord servers from a single dashboard. Perfect for communities, businesses, and enterprises.

  - icon: 🔐
    title: Enterprise Security
    details: Argon2id password hashing, AES-256-GCM encryption, and EdDSA JWT signing. SOC 2 compliant infrastructure.

  - icon: 📊
    title: Advanced Analytics
    details: Real-time insights into ticket volume, response times, customer satisfaction, and team performance.

  - icon: 🎨
    title: Custom Branding
    details: White-label solutions with custom domains, bot tokens, and complete branding control for your organization.

  - icon: 💳
    title: Subscription Management
    details: Built-in billing with Stripe, PayPal, and Patreon integration. Automatic feature gating and usage tracking.

  - icon: 🔗
    title: API & Webhooks
    details: Comprehensive REST API with webhook support for real-time integrations with your existing tools and workflows.

  - icon: 📝
    title: Rich Transcripts
    details: Beautiful HTML transcripts with full conversation history, attachments, and export capabilities.

  - icon: ⚡
    title: Auto-Close System
    details: Configurable inactivity timers with smart notifications. Keeps your support queue clean and organized.
---

## Quick Start

Get your Discord ticket system running in minutes:

### For Server Owners

```bash
# 1. Add the bot to your Discord server
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot

# 2. Access the web dashboard
https://ticketsystem.fyi/dashboard

# 3. Configure your first ticket category
# 4. Start supporting your community!
```

### For Developers

```bash
# Clone and install
git clone https://github.com/Legacy-DEV-Team/TicketSystem.git
cd TicketSystem
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev
```

## Architecture Overview

Ticket System is built with a modern, scalable architecture:

```mermaid
graph TB
    A[Discord Bot] --> B[Web Panel]
    B --> C[MongoDB]
    B --> D[Redis]
    B --> E[Payment Providers]
    A --> F[Discord API]
    B --> G[REST API]
    G --> H[Webhooks]
```

- **Discord Bot**: Multi-guild Discord.js bot with custom token support
- **Web Panel**: Next.js dashboard with admin configuration
- **Database**: MongoDB for data persistence, Redis for sessions
- **Security**: Argon2id + AES-256-GCM + EdDSA encryption
- **Payments**: Stripe, PayPal, and Patreon integration

## Key Features

### 🎯 **Ticket Management**
- Thread-based tickets with automatic numbering
- Configurable categories and permissions
- Auto-close system with customizable timers
- Rich HTML transcripts with full history

### 🏢 **Multi-Guild Support**
- Manage unlimited Discord servers
- Per-guild configuration and branding
- Custom bot tokens for white-label solutions
- Centralized analytics and reporting

### 🔐 **Enterprise Security**
- Industry-standard encryption (Argon2id, AES-256-GCM, EdDSA)
- Role-based access control
- Audit logs and activity tracking
- GDPR compliant data handling

### 💰 **SaaS Business Model**
- Multiple subscription tiers (Free, Pro, Enterprise)
- Automatic billing and subscription management
- Usage tracking and feature gating
- Revenue analytics and reporting

### 🔗 **Developer Friendly**
- Comprehensive REST API
- Real-time webhooks
- OpenAPI documentation
- TypeScript support throughout

## Community & Support

- 📚 **[Documentation](/guide/getting-started)** - Complete setup guides and API reference
- 💬 **[Discord Server](https://discord.gg/dayewa6xP6)** - Get help from our community
- 🐛 **[GitHub Issues](https://github.com/Legacy-DEV-Team/TicketSystem/issues)** - Report bugs and request features
- 📧 **[Email Support](mailto:support@ticketsystem.fyi)** - Enterprise support available

## License

This project is open source and available under the [MIT License](https://github.com/Legacy-DEV-Team/TicketSystem/blob/main/LICENSE).