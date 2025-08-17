# ZingLots B2B Surplus Marketplace - Database Schema & Edge Functions

This branch transforms ZingLots from a collectibles auction platform to a **hyperlocal B2B surplus marketplace** focused on business equipment, construction materials, and commercial goods with local pickup requirements.

## 🏗️ Schema Architecture

### Core Tables

**Regions & Locations (PostGIS-enabled)**
- `regions` - Geographical markets (Seattle, Tacoma, etc.) with lat/lon centers
- `locations` - Business pickup/delivery locations with equipment flags (forklift, dock)

**Business Profiles & Verification**
- `profiles` - Enhanced for B2B with verification tiers (T0-T3) and business info
- `kyb_applications` - Know Your Business verification tracking

**B2B Marketplace Core**
- `lots` - Surplus items with B2B attributes (UoM, dimensions, equipment needs)
- `bids` - Radius-validated bidding with location tracking
- `escrow` - Secure payment holding until pickup confirmation
- `pickups` - QR code-based pickup verification system
- `inspections` - Pre-bid inspection scheduling
- `valuations` - AI-powered pricing assistance

### Key Features

1. **Hyperlocal Focus**: PostGIS integration for distance-based filtering
2. **B2B Verification Tiers**: 
   - T0: Browse only
   - T1: Bid up to $500
   - T2: Full marketplace access
   - T3: Verified business badge
3. **Local Pickup Only**: No platform-arranged delivery
4. **Soft-Close Anti-Snipe**: Auto-extends auction time for last-minute bids
5. **QR Pickup Verification**: Secure handoff with automatic seller payout

## 🚀 Edge Functions

### Core Marketplace Functions

#### `bids-place`
Places bids with comprehensive validation:
- **Radius Validation**: Haversine distance calculation vs pickup location
- **Verification Tier Limits**: Enforces T1 $500 limit, etc.
- **Anti-Snipe Protection**: Extends end time by 2 minutes if bid in last 2 minutes
- **Increment Validation**: Ensures minimum bid increments

```bash
curl -X POST https://your-project.supabase.co/functions/v1/bids-place \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "uuid",
    "amountCents": 15000,
    "bidderLat": 47.6062,
    "bidderLon": -122.3321
  }'
```

#### `connect-create-or-get`
Stripe Connect onboarding for sellers:
- Creates Express accounts for B2B sellers
- Handles existing account retrieval
- Returns onboarding URLs for KYC completion

```bash
curl -X POST https://your-project.supabase.co/functions/v1/connect-create-or-get \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshUrl": "https://yoursite.com/onboarding/refresh",
    "returnUrl": "https://yoursite.com/onboarding/complete"
  }'
```

#### `payments-create-intent`
Winner payment processing:
- Verifies winning bid and calculates fees
- Creates Stripe PaymentIntent with marketplace fee
- Sets up escrow record awaiting payment
- Generates QR token for pickup

```bash
curl -X POST https://your-project.supabase.co/functions/v1/payments-create-intent \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"lotId": "uuid"}'
```

#### `pickup-confirm`
QR-based pickup verification:
- Validates QR token and seller authorization
- Transfers seller payout via Stripe Connect
- Updates all related records (pickup, escrow, lot status)
- Supports proof photos

```bash
curl -X POST https://your-project.supabase.co/functions/v1/pickup-confirm \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "qrToken": "unique-qr-token",
    "proofPhotos": ["url1", "url2"]
  }'
```

## 📊 Materialized Views

### `lot_summary_mv`
Optimized lot browsing with:
- Current pricing and bid activity
- Seller verification status  
- Geographic data for distance filtering
- Time remaining calculations

### `seller_stats_mv`
Seller performance metrics:
- Total lots, sell-through rates
- Revenue calculations
- Average time to sell

### `region_stats_mv`
Regional marketplace health:
- Activity levels by geography
- Bidding competition metrics
- Pickup efficiency tracking

## 🔧 Migration from Collectibles Platform

### Database Changes
1. **New Enums**: Replaced collectibles categories with B2B verticals
2. **PostGIS Integration**: Added geographic capabilities
3. **Verification System**: Replaced simple KYC with business verification tiers
4. **Pickup System**: Added QR-based pickup confirmation

### Business Logic Changes
1. **Always-On Auctions**: Removed live show dependencies
2. **Local Pickup Only**: No shipping/delivery arrangements
3. **B2B Focus**: Construction, restaurant, municipal surplus categories
4. **Radius Validation**: Geographic constraints on bidding

## 🚀 Deployment Steps

1. **Run SQL Migrations** (in order):
   ```sql
   -- In Supabase SQL Editor:
   \i supabase/sql/001_extensions_enums.sql
   \i supabase/sql/010_regions_locations.sql
   \i supabase/sql/020_profiles.sql
   \i supabase/sql/030_lots_bids_escrow_pickups.sql
   \i supabase/sql/040_rls_policies.sql
   \i supabase/sql/050_materialized_views.sql
   ```

2. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy bids-place
   supabase functions deploy connect-create-or-get
   supabase functions deploy payments-create-intent
   supabase functions deploy pickup-confirm
   ```

3. **Set Environment Variables**:
   ```
   STRIPE_SECRET_KEY=sk_...
   STRIPE_PLATFORM_FEE_BPS=900
   SITE_URL=https://zinglots.com
   ```

4. **Enable Storage Buckets**:
   - `lot-photos` (public)
   - `evidence` (private)
   - `proof-photos` (private)

## 🎯 Next Steps

This foundation enables:
1. **Frontend Updates**: Region-based browsing, B2B lot creation
2. **AI Integration**: Listing assistance, pricing, moderation
3. **Mobile QR Scanner**: Pickup verification app
4. **Analytics Dashboard**: Regional health metrics

See the main PRD documents for the complete 25-task roadmap to full B2B marketplace functionality.
