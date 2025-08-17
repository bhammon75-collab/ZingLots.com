# ZingLots.com - AI-Powered B2B Surplus Marketplace

## 🚀 Overview

ZingLots is a next-generation hyperlocal B2B surplus marketplace that leverages AI agents to automate operations, enhance user experience, and scale efficiently. Built with React, Supabase, and powered by Claude AI.

## 🤖 AI Agent Architecture

### Core AI Agents

1. **KYB Onboarding Agent** - Automated business verification
   - Document OCR and validation
   - Risk scoring and compliance checks
   - Real-time verification decisions

2. **Listing Copilot** - AI-powered listing creation
   - Computer vision for product categorization
   - SEO-optimized title and description generation
   - Automatic hazmat and compliance detection
   - Dimension and weight estimation

3. **Valuation Agent** - Data-driven pricing
   - Comparable sales analysis
   - Market trend detection
   - Dynamic pricing recommendations
   - Stale inventory management

4. **Trust & Safety Agent** - 24/7 content moderation
   - Prohibited item detection
   - PII scrubbing
   - Fraud prevention

5. **Support & Dispute Agent** - Automated customer service
   - FAQ handling
   - Dispute resolution suggestions
   - Intelligent ticket routing

6. **Lead Generation Agent** - Growth automation
   - Business prospect identification
   - Personalized outreach campaigns
   - Regional market analysis

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Maps**: PostGIS for geospatial queries
- **Payments**: Stripe Connect
- **Storage**: Supabase Storage

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Anthropic API key
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/bhammon75-collab/ZingLots.com.git
cd ZingLots.com
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup

#### Database Migrations

1. Go to your Supabase project SQL Editor
2. Run the migrations in order:
   - `supabase/migrations/001_core_marketplace_schema.sql`

#### Edge Function Secrets

Set these in Supabase Dashboard → Settings → Edge Functions:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Deploy Edge Functions

```bash
supabase functions deploy listing-copilot
supabase functions deploy kyb-verify
supabase functions deploy valuation-agent
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── marketplace/
│   │   │   ├── AIListingCreator.tsx    # AI-powered listing creation
│   │   │   ├── BusinessVerification.tsx # KYB onboarding flow
│   │   │   └── ValuationDisplay.tsx    # Pricing recommendations
│   │   └── ui/                         # shadcn/ui components
│   ├── pages/
│   │   ├── CreateListing.tsx
│   │   ├── Marketplace.tsx
│   │   └── SellerDashboard.tsx
│   └── integrations/
│       └── supabase/
├── supabase/
│   ├── functions/
│   │   ├── listing-copilot/           # AI listing generation
│   │   ├── kyb-verify/                # Business verification
│   │   ├── valuation-agent/           # Pricing engine
│   │   └── _shared/                   # Shared utilities
│   └── migrations/                    # Database schema
```

## 🔑 Key Features

### For Sellers
- **AI-Powered Listings**: Upload photos and let AI generate professional listings
- **Smart Pricing**: Get data-driven pricing recommendations
- **Automated Verification**: Quick business verification with AI document analysis
- **Inventory Management**: Track listings, bids, and pickups

### For Buyers
- **Hyperlocal Search**: Find surplus within your pickup radius
- **Verified Sellers**: All businesses are KYB-verified
- **Inspection Scheduling**: Schedule on-site inspections
- **QR Pickup Flow**: Secure pickup verification with QR codes

### Platform Features
- **Real-time Bidding**: WebSocket-powered live bidding
- **Anti-Snipe Protection**: Automatic time extensions
- **Escrow Payments**: Secure payment handling via Stripe
- **Regional Marketplaces**: City-specific surplus hubs

## 🧪 Testing AI Features

### Test Listing Creation
1. Navigate to `/create-listing`
2. Upload product photos
3. Click "Generate with AI"
4. Review AI suggestions
5. Get valuation estimate

### Test Business Verification
1. Go to seller onboarding
2. Upload business documents
3. Submit for verification
4. Check verification status

## 📊 Database Schema

Key tables with AI integration:

- `marketplace.businesses` - Verified seller accounts
- `marketplace.kyb_applications` - Verification records with AI analysis
- `marketplace.items` - Listings with AI-generated content
- `marketplace.valuations` - AI pricing recommendations
- `marketplace.ai_agent_logs` - Complete AI activity audit trail

## 🚀 Deployment

### Vercel Deployment

```bash
npm run build
vercel --prod
```

### Environment Variables (Production)

Set in Vercel Dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Supabase Edge Functions (Production)

```bash
supabase functions deploy --project-ref your-project-ref
```

## 📈 Monitoring & Analytics

### AI Agent Metrics
- Agent response times
- Token usage per agent
- Success/failure rates
- Cost per operation

### Marketplace KPIs
- Unique bidders per lot
- Sell-through rate
- Average time to first bid
- Pickup completion rate

## 🔒 Security Considerations

- All AI agents use service role keys (never exposed to client)
- RLS policies enforce data access controls
- PII is automatically scrubbed from logs
- Document uploads are virus-scanned
- Rate limiting on all AI endpoints

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test AI agents locally
4. Submit a pull request

## 📝 License

Private repository - All rights reserved

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@zinglots.com

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core marketplace functionality
- ✅ AI listing generation
- ✅ KYB verification
- ✅ Valuation engine

### Phase 2 (Q2 2025)
- [ ] Mobile app
- [ ] Advanced fraud detection
- [ ] Multi-language support
- [ ] Bulk import tools

### Phase 3 (Q3 2025)
- [ ] Predictive demand forecasting
- [ ] Automated inventory sourcing
- [ ] White-label solution
- [ ] API marketplace

---

Built with ❤️ by the ZingLots Team
