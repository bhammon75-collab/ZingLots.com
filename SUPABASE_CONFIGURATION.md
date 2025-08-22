# 🚀 Supabase Configuration Guide for ZingLots.com

## Quick Start (5 minutes)

### Step 1: Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub or email

### Step 2: Create a New Project
1. Click "New Project"
2. Enter project details:
   - **Name**: `zinglots` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

### Step 3: Get Your API Keys
Once your project is created (takes ~2 minutes):

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 4: Configure Your Local Environment

Create a `.env` file in your project root:

```bash
# In your terminal
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Feature Flags
VITE_FEATURE_LIVE_SHOWS=false
```

## 📊 Database Setup

### Option 1: Use Existing Schema (Recommended)

The project includes migrations in `/supabase/migrations/`. To apply them:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
# Your project ref is in Settings → General
```

3. Run migrations:
```bash
supabase db push
```

### Option 2: Manual Table Creation

If you prefer to set up tables manually, create these core tables in the SQL Editor:

```sql
-- Create schema
CREATE SCHEMA IF NOT EXISTS app;

-- Basic auctions table for testing
CREATE TABLE app.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  hero_image_url TEXT,
  current_bid DECIMAL(10,2),
  lots_count INTEGER DEFAULT 1,
  ends_at TIMESTAMPTZ,
  region_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Basic lots table
CREATE TABLE app.lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  hero_image_url TEXT,
  current_bid DECIMAL(10,2),
  lots_count INTEGER DEFAULT 1,
  ends_at TIMESTAMPTZ,
  region_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.lots ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Public can read auctions" ON app.auctions
  FOR SELECT USING (true);

CREATE POLICY "Public can read lots" ON app.lots
  FOR SELECT USING (true);
```

### Add Sample Data (Optional)

To see real data instead of mock data:

```sql
-- Insert sample auctions for Seattle
INSERT INTO app.auctions (title, hero_image_url, current_bid, lots_count, ends_at, region_slug)
VALUES 
  ('Construction Equipment Lot', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837', 2500, 15, NOW() + INTERVAL '3 days', 'seattle'),
  ('Restaurant Kitchen Package', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', 1800, 25, NOW() + INTERVAL '2 days', 'seattle'),
  ('Office Furniture Bundle', 'https://images.unsplash.com/photo-1555212697-194d092e3b8f', 950, 40, NOW() + INTERVAL '5 days', 'seattle');

-- Add more regions
INSERT INTO app.auctions (title, hero_image_url, current_bid, lots_count, ends_at, region_slug)
VALUES 
  ('Industrial Machinery', 'https://images.unsplash.com/photo-1565043666747-69f6646db940', 5500, 8, NOW() + INTERVAL '4 days', 'los-angeles'),
  ('Medical Equipment', 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5', 3200, 12, NOW() + INTERVAL '6 days', 'new-york');
```

## 🔐 Authentication Setup (Optional)

### Enable Authentication Providers

1. Go to **Authentication** → **Providers** in Supabase
2. Enable providers you want:
   - **Email**: For email/password auth
   - **Google**: For Google sign-in
   - **Magic Link**: For passwordless login

### Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `http://localhost:5173` (development)
   - **Redirect URLs**: Add `http://localhost:5173/*`

## 🚀 Deployment Configuration

### For Vercel Deployment

Add these environment variables in Vercel dashboard:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Set for all environments (Production, Preview, Development)

### For Other Platforms

Ensure these environment variables are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🧪 Testing Your Configuration

### 1. Test Locally

```bash
# Start the dev server
npm run dev

# Visit http://localhost:5173/r/seattle
# You should see either:
# - Real data (if you added sample data)
# - Mock data (if no data in Supabase)
```

### 2. Check Browser Console

Open browser DevTools and look for:
- ✅ "Using mock data for region: seattle" (if no real data)
- ✅ No Supabase connection errors
- ❌ If you see errors, check your credentials

### 3. Verify in Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. Check if your tables exist
3. Try inserting a test record

## 🔧 Troubleshooting

### Common Issues

#### 1. "Supabase not configured" in console
**Solution**: Check that both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`

#### 2. CORS errors
**Solution**: 
- Check that your site URL is added in Supabase Authentication settings
- Ensure you're using the correct project URL

#### 3. Tables don't exist
**Solution**: Run the SQL commands in the Database Setup section

#### 4. No data showing
**Solution**: This is normal! The app will show mock data if no real data exists.

## 📝 Environment Variables Reference

```env
# Required for Supabase connection
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Optional - for Supabase Edge Functions
VITE_SUPABASE_FUNCTIONS_BASE=https://xxxxx.supabase.co/functions/v1

# Feature flags
VITE_FEATURE_LIVE_SHOWS=false  # Set to true to enable live auction features

# Payment providers (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=...

# LiveKit for streaming (optional)
VITE_LIVEKIT_URL=wss://...
VITE_LIVEKIT_API_KEY=...
```

## 🎉 Success Checklist

- [ ] Created Supabase account and project
- [ ] Copied API keys to `.env` file
- [ ] Created database tables (or ran migrations)
- [ ] Tested locally and saw auction data (real or mock)
- [ ] Added environment variables to deployment platform

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)

## 💡 Tips

1. **Free Tier Limits**: The free tier includes:
   - 500MB database
   - 2GB bandwidth
   - 50,000 monthly active users
   - Perfect for development and small projects

2. **Security**: Never commit your `.env` file to Git. The anon key is safe to use in frontend code.

3. **Mock Data Fallback**: The app automatically shows professional mock data when Supabase has no data, so your site always looks populated.

4. **Real-time Features**: Supabase supports real-time subscriptions for live auction updates (future enhancement).

---

**Need Help?** The app works perfectly with just the mock data, so you can develop without Supabase initially and add it later when ready for production.