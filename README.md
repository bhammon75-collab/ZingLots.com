# ZingLots - Live Auction Platform

ZingLots is a modern B2B surplus marketplace and live auction platform built with React, TypeScript, and Supabase. Experience real-time bidding, secure payments, and transparent transactions.

## 🚀 Features

- **Live Auctions**: Real-time bidding with instant updates
- **Secure Payments**: Stripe integration with escrow protection
- **B2B Marketplace**: Specialized for surplus and business inventory
- **User Dashboards**: Separate buyer and seller interfaces
- **Real-time Communication**: LiveKit integration for live streams
- **Mobile Responsive**: Works seamlessly across all devices

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Payments**: Stripe Connect, PayPal integration
- **Real-time**: LiveKit for video/audio streaming
- **State Management**: TanStack Query
- **Testing**: Vitest, Testing Library

## 📦 Getting Started

### Prerequisites

- Node.js 18+ (use nvm for version management)
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd ZingLots.com

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

1. **Supabase Configuration**: Set up your Supabase project and configure:
   - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
   - LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL
   - SITE_URL (frontend origin), STRIPE_PLATFORM_FEE_BPS=1200

2. **Database Setup**: Run migrations in SQL Editor:
   - `docs/migrations/0001_app_schema.sql`
   - `docs/migrations/0002_end_lot.sql`
   - `docs/migrations/0003_seed_demo.sql`

3. **Supabase Configuration**:
   - Enable Auth: Email (magic link or password)
   - Create Storage buckets: lot-photos (public), evidence (private), lot-images (public), lot-docs (private)
   - Enable Realtime for tables: app.lots and app.bids

4. **Deploy Edge Functions** (Dashboard → Edge Functions):
   - `livekit-token` - Generate LiveKit access tokens
   - `stripe-onboard` - Stripe Connect onboarding
   - `checkout-create-session` - Create Stripe checkout sessions
   - `stripe-webhook` - Handle Stripe webhook events
   - `admin-settle` - Administrative settlement
   - `email-send` - Dev/test email sending

## 📱 PWA Support

ZingLots includes Progressive Web App features:

```bash
# Generate app icons from SVG
npm run generate:icons
```

Icons are automatically generated in multiple sizes for:
- PWA/Android (192x192, 512x512)
- iOS (various sizes)
- Favicons (16x16, 32x32, etc.)
- Social sharing (256x256, 512x512, 1024x1024)

## 🧪 Testing

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run smoke tests
npm run test:smoke
```

## 🏗️ Development Workflow

### Package Manager

Choose one for consistent builds:
- **NPM**: `npm ci && npm run dev` (remove bun.lockb)
- **Bun**: `bun install && bun run dev` (remove package-lock.json)

### Build & Deploy

```bash
npm run lint        # ESLint check
npm run build       # Production build
npm run ci          # Full CI: lint + build
npm run preview     # Preview production build
```

## 🔧 Quick Test Flow

1. Open `/qa` in two browser tabs
2. Set a Lot ID and place sample bids
3. Use "Shorten Soft-Close (20s)" to test real-time extensions
4. End Lot (demo) to generate invoiced orders
5. Test payment flow with `checkout-create-session`
6. Set shipping tracking with `orders-set-tracking`
7. Complete settlement with `admin-settle`

## 📚 Key Directories

```
├── public/
│   ├── icons/           # App icons and favicons
│   └── site.webmanifest # PWA manifest
├── src/
│   ├── components/      # React components
│   ├── pages/          # Route components
│   ├── integrations/   # Supabase client
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── supabase/           # Database schema and functions
├── docs/               # Documentation and migrations
└── scripts/            # Build and utility scripts
```

## 🎨 Branding

The ZingLots brand uses a red bolt logo (#E53935). To regenerate brand assets:

```bash
npm run generate:icons
```

This creates all necessary icon sizes from the source SVG at `public/icons/bolt.svg`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions, please contact the development team or create an issue in this repository.

---

**ZingLots** - Revolutionizing B2B surplus auctions with modern technology.

