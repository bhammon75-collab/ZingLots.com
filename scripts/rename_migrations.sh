#!/bin/bash
# ZingLots.com Migration Files Renamer Script
# This script renames migration files to have descriptive names
# Run this from the project root directory

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting migration file renaming...${NC}"
echo -e "${GREEN}📂 Working directory: $(pwd)${NC}"
echo ""

# Navigate to migrations directory
if [ -d "supabase/migrations" ]; then
    cd supabase/migrations
elif [ -d "migrations" ]; then
    cd migrations
else
    echo -e "${RED}❌ Error: Cannot find migrations directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "20250812181614-.sql" ] && [ ! -f "20250812181614_initial_schema.sql" ]; then
    echo -e "${YELLOW}⚠️  Some files may already be renamed or not found${NC}"
fi

# Counter for renamed files
count=0
skipped=0

# Function to rename a file
rename_file() {
    local old_name="$1"
    local new_name="$2"
    
    if [ -f "$old_name" ]; then
        if [ ! -f "$new_name" ]; then
            mv "$old_name" "$new_name"
            echo -e "${GREEN}✅ Renamed:${NC} $old_name → $new_name"
            ((count++))
        else
            echo -e "${YELLOW}⚠️  Skipped:${NC} $new_name already exists"
            ((skipped++))
        fi
    else
        if [ -f "$new_name" ]; then
            echo -e "${GREEN}✓  Already renamed:${NC} $new_name"
        else
            echo -e "${YELLOW}⚠️  Not found:${NC} $old_name"
        fi
        ((skipped++))
    fi
}

echo -e "${GREEN}📝 Renaming migration files...${NC}"
echo ""

# Perform all renames
rename_file "20250812181614-.sql" "20250812181614_initial_schema.sql"
rename_file "20250812181717-.sql" "20250812181717_enable_realtime.sql"
rename_file "20250812183435-.sql" "20250812183435_add_lot_photos.sql"
rename_file "20250812222928-.sql" "20250812222928_proxy_bidding_system.sql"
rename_file "20250812223042-.sql" "20250812223042_watchlist_feature.sql"
rename_file "20250812223148-.sql" "20250812223148_bid_management_functions.sql"
rename_file "20250812223328-.sql" "20250812223328_user_profiles_extended.sql"
rename_file "20250812223421-.sql" "20250812223421_payment_processing.sql"
rename_file "20250812223454-.sql" "20250812223454_shipping_integration.sql"
rename_file "20250812223522-.sql" "20250812223522_notifications_system.sql"
rename_file "20250812224921-.sql" "20250812224921_analytics_views.sql"
rename_file "20250812233135-.sql" "20250812233135_add_lot_sorting.sql"
rename_file "20250812234455-.sql" "20250812234455_auction_templates.sql"
rename_file "20250813013447-.sql" "20250813013447_seller_stats_view.sql"
rename_file "20250813024156-.sql" "20250813024156_realtime_triggers.sql"
rename_file "20250813024525-.sql" "20250813024525_lot_closing_functions.sql"
rename_file "20250813024630-.sql" "20250813024630_order_fulfillment.sql"
rename_file "20250813024702-.sql" "20250813024702_dispute_resolution.sql"
rename_file "20250813024725-.sql" "20250813024725_category_management.sql"
rename_file "20250813024742-.sql" "20250813024742_seller_verification.sql"
rename_file "20250813025048-.sql" "20250813025048_add_lot_metadata.sql"
rename_file "20250813031837-.sql" "20250813031837_search_indexes.sql"
rename_file "20250813035847-.sql" "20250813035847_analytics_tables.sql"
rename_file "20250813035934-.sql" "20250813035934_bid_history_export.sql"
rename_file "20250813040028-.sql" "20250813040028_auction_settings.sql"
rename_file "20250813040050-.sql" "20250813040050_fee_structure.sql"
rename_file "20250813040117-.sql" "20250813040117_add_show_metadata.sql"
rename_file "20250813043246-.sql" "20250813043246_messaging_system.sql"
rename_file "20250813045922-.sql" "20250813045922_add_reserve_price.sql"
rename_file "20250813062700-.sql" "20250813062700_rls_policies.sql"
rename_file "20250813062748-.sql" "20250813062748_admin_functions.sql"

echo ""
echo -e "${GREEN}✨ Migration renaming complete!${NC}"
echo -e "${GREEN}📊 Summary:${NC}"
echo -e "   • Renamed: $count files"
echo -e "   • Skipped: $skipped files"
echo ""
echo -e "${YELLOW}📝 Note: 4 files with UUID suffixes were left unchanged as they already have identifiers${NC}"

# Verify the changes
echo ""
echo -e "${GREEN}📋 Current migration files (last 10):${NC}"
ls -la *.sql 2>/dev/null | tail -10

echo ""
echo -e "${GREEN}🎉 Done! Your migration files now have descriptive names.${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "   1. Review changes: git status"
echo "   2. Stage changes: git add -A"
echo "   3. Commit: git commit -m 'fix: add descriptive names to migration files (closes #12)'"
echo "   4. Push: git push origin fix/migration-naming-hygiene"
