# Migration Naming Convention

## Overview
All migration files in the `supabase/migrations` directory should follow a descriptive naming convention to make it easy to understand what each migration does without opening the file.

## Naming Format
```
YYYYMMDDHHMMSS_descriptive_name.sql
```

- **Timestamp prefix**: Ensures migrations run in the correct order
- **Underscore separator**: Separates timestamp from description
- **Descriptive name**: Clear, concise description using snake_case

## Examples

### ✅ Good Names
- `20250812181614_initial_schema.sql` - Creates the initial database schema
- `20250812223421_payment_processing.sql` - Adds payment processing tables
- `20250813031837_search_indexes.sql` - Creates search indexes
- `20250813062700_rls_policies.sql` - Implements Row Level Security policies

### ❌ Bad Names
- `20250812181614-.sql` - No description
- `20250812181614-update.sql` - Too vague
- `20250812181614_fix.sql` - Doesn't explain what's being fixed

## Categories of Migrations

| Category | Prefix/Suffix | Description |
|----------|---------------|-------------|
| Schema | `_schema`, `_tables` | Creating or altering tables |
| Functions | `_functions`, `_procedures` | Database functions and stored procedures |
| Indexes | `_indexes`, `_search` | Creating database indexes |
| Policies | `_policies`, `_rls` | Row Level Security policies |
| Triggers | `_triggers` | Database triggers |
| Views | `_views`, `_analytics` | Database views |
| Data | `_seed`, `_data` | Data migrations or seeding |
| Features | Feature name | Complete feature implementations |

## Current Migration Structure

| File | Type | Description |
|------|------|-------------|
| `20250812181614_initial_schema.sql` | Schema | Initial database schema with core tables, enums, RLS policies |
| `20250812222928_proxy_bidding_system.sql` | Feature | Proxy bidding, verification tiers, bundles, escrow |
| `20250812223522_notifications_system.sql` | Feature | Notification system for bids, wins, and outbids |
| `20250813031837_search_indexes.sql` | Index | Full-text search indexes |
| `20250813062700_rls_policies.sql` | Security | Row Level Security policies |

## Running the Rename Script

To rename existing migration files to follow this convention:

```bash
# From project root
chmod +x scripts/rename_migrations.sh
./scripts/rename_migrations.sh
```

## Creating New Migrations

When creating new migrations:

1. Use Supabase CLI: `supabase migration new descriptive_name`
2. The CLI will create: `YYYYMMDDHHMMSS_descriptive_name.sql`
3. Use clear, specific names that describe the migration's purpose

## Benefits

- **Easier Debugging**: When migrations fail, you know which one without checking
- **Better History**: Clear deployment history in production
- **Team Collaboration**: Team members understand database evolution
- **Maintenance**: Easier to identify and manage migrations

## Notes

- The timestamp prefix ensures execution order is maintained
- Migrations with UUID suffixes (e.g., `_90ecbd4c-f5eb-4291-8bf1-73875fef02ca.sql`) are typically auto-generated and can be left as-is
- Always test migrations locally before deploying to production
