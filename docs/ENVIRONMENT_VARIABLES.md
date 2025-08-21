# Environment Variables Guide

This document outlines all required environment variables for ZingLots.com production deployment.

## 🚀 **Production Deployment Checklist**

### **Critical: Set these variables in your deployment environment**

## Frontend (Vercel/Client)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FUNCTIONS_BASE=https://<ref>.functions.supabase.co/functions/v1  # Optional; auto-derived from VITE_SUPABASE_URL if omitted

# Feature Flags  
VITE_FEATURE_LIVE_SHOWS=false  # Set to true to enable LiveKit features
```

## Backend (Supabase Edge Functions)

### **Core Required Variables**
```bash
# Supabase (Auto-set by Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security (CRITICAL for production)
SITE_URL=https://your-domain.com  # Locks CORS to your domain
EMAIL_FROM=noreply@your-domain.com  # Required if email function is used
RESEND_API_KEY=re_XXXXXXXXXXXXXXXX  # Or POSTMARK_API_TOKEN / SENDGRID_API_KEY
```

### **Stripe Integration**
```bash
# Required for payments
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
STRIPE_PLATFORM_FEE_BPS=1200  # Default: 12% platform fee
```

### **PayPal Integration**
```bash
# Required for PayPal payments
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_API_BASE=https://api-m.paypal.com  # or https://api-m.sandbox.paypal.com for testing
```

### **LiveKit (Live Streaming)**
```bash
# Required if VITE_FEATURE_LIVE_SHOWS=true
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_REST_URL=https://your-livekit-url.com  # or LIVEKIT_URL
```

---

## 📋 **Function-Specific Requirements**

### **admin-settle**
- ✅ `STRIPE_SECRET_KEY`
- ✅ `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### **checkout-create-session**  
- ✅ `SITE_URL`
- ✅ `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- 🔧 `STRIPE_PLATFORM_FEE_BPS` (optional, defaults to 1200)

### **stripe-webhook**
- ✅ `SITE_URL`
- ✅ `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`  
- ✅ `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### **stripe-onboard / stripe-connect-onboard**
- ✅ `SITE_URL`
- ✅ `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `STRIPE_SECRET_KEY`

### **paypal-create-order / paypal-capture-order**
- ✅ `SITE_URL`
- ✅ `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- 🔧 `PAYPAL_API_BASE` (optional, defaults to sandbox)

### **livekit-start-egress / livekit-stop-egress**  
- ✅ `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- ✅ `LIVEKIT_REST_URL` (or `LIVEKIT_URL`)

### **bids-csv / lots-import-csv / orders-set-tracking**
- ✅ `SITE_URL`
- ✅ `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔐 **Security Best Practices**

### **Production Deployment**
1. **NEVER commit secrets to git**
2. **Set `SITE_URL`** to lock CORS to your domain (instead of `*`)
3. **Use live Stripe keys** (`sk_live_...`) in production
4. **Use production PayPal endpoint** (`https://api-m.paypal.com`)
5. **Rotate keys regularly** and store in secure environment

### **Testing/Development**
1. **Use test keys** (`sk_test_...`) for Stripe
2. **Use sandbox PayPal** (`https://api-m.sandbox.paypal.com`)
3. **Set `SITE_URL=http://localhost:8080`** for local development

---

## 🚨 **Common Issues**

### **CORS Errors**
❌ **Problem**: `Access to fetch at '...' has been blocked by CORS policy`  
✅ **Solution**: Set `SITE_URL` in your Edge Function environment

### **Stripe Webhook Failures**  
❌ **Problem**: Webhook signature verification fails  
✅ **Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard

### **PayPal Integration Issues**
❌ **Problem**: PayPal API returns 401 Unauthorized  
✅ **Solution**: Verify `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are correct

### **LiveKit Connection Fails**
❌ **Problem**: LiveKit tokens invalid or connection refused  
✅ **Solution**: Check `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and `LIVEKIT_REST_URL`

---

## 📖 **Quick Setup Commands**

### **Vercel Deployment**
```bash
# Set frontend environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY  
vercel env add VITE_FEATURE_LIVE_SHOWS

# Deploy
vercel --prod
```

### **Supabase Edge Functions**
```bash
# Set secrets (run for each required variable)
supabase secrets set SITE_URL=https://your-domain.com
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy functions
supabase functions deploy --project-ref your-project-ref
```

### **Local Development**  
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
VITE_FEATURE_LIVE_SHOWS=false
```

---

*This guide implements the ChatGPT-5 audit recommendations for comprehensive environment variable documentation and production deployment best practices.*
