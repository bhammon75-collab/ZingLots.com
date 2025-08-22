# Zing Lots Setup Guide

## Project Overview
Zing Lots is a modern live auction platform built with React, TypeScript, and Supabase. The platform enables real-time bidding, secure payments, and transparent transactions.

## Prerequisites
- Node.js 18+ (check `.nvmrc` for exact version)
- npm or yarn package manager
- Supabase account (for backend services)

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd zinglots-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure it with your values:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_FEATURE_LIVE_SHOWS`: Set to `true` to enable live streaming features
- Additional payment gateway keys if using Stripe/PayPal

### 4. Supabase Setup
1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env`
3. Run database migrations (if provided in `/supabase/migrations`)
4. Set up authentication providers as needed

## Development

### Running the Development Server
```bash
npm run dev
```
The application will be available at http://localhost:8080

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run ci` - Run all CI checks

## Project Structure
```
/workspace
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── integrations/   # External service integrations
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── supabase/          # Supabase configuration
└── scripts/           # Build and utility scripts
```

## Key Features
- **Live Auctions**: Real-time bidding system
- **B2B Marketplace**: Regional marketplace functionality
- **Seller Dashboard**: Comprehensive seller management
- **Buyer Dashboard**: Bid tracking and purchase history
- **Admin Panel**: Platform administration tools
- **PWA Support**: Progressive Web App capabilities
- **Responsive Design**: Mobile-first approach

## Performance Optimizations
- Code splitting with React.lazy for better initial load times
- Optimized bundle sizes with Vite
- Image optimization
- Caching strategies

## Security Features
- Content Security Policy (CSP) headers
- Supabase Row Level Security (RLS)
- Secure payment integrations
- Environment variable protection

## Deployment

### Building for Production
```bash
npm run build
```
This creates an optimized build in the `dist/` directory.

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure domain and SSL
- [ ] Set up CDN for static assets
- [ ] Configure monitoring and error tracking
- [ ] Set up backup strategies
- [ ] Review security headers

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure all required variables in `.env.example` are set
   - Check that Supabase credentials are valid

2. **Build Errors**
   - Run `npm run typecheck` to identify TypeScript issues
   - Check for ESLint errors with `npm run lint`

3. **Large Bundle Size**
   - Review imports and ensure tree-shaking is working
   - Consider additional code splitting

## Support
For issues or questions, please refer to the documentation or contact the development team.

## License
[Add license information here]