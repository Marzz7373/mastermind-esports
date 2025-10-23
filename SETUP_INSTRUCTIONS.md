# Mastermind Esports - Setup Instructions

## Database Setup Required

Before using the website, you need to set up the database in Supabase.

### Steps to Set Up Database:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Log in to your account

2. **Select Your Project**
   - Click on your project: `jboyorkrdwzgusctfhco`

3. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New query"

4. **Execute the Database Setup**
   - Open the file `database_setup.sql` in this project folder
   - Copy ALL the contents
   - Paste into the Supabase SQL Editor
   - Click "Run" or press `Ctrl/Cmd + Enter`

5. **Verify Setup**
   - After running, you should see success messages
   - Check the "Table Editor" in the sidebar
   - You should see 4 tables: profiles, categories, products, transactions

### What Gets Created:

- **profiles** - User accounts with wallet system
- **categories** - Game Topup and Voucher Store categories
- **products** - Pre-loaded with:
  - PUBG Mobile UC (60, 325, 660)
  - Mobile Legends Diamonds (86, 172, 344)
  - Steam Wallet (RM10, RM30)
  - Google Play (RM10, RM50)
- **transactions** - Track all purchases and top-ups

### Creating an Admin Account:

After setting up the database and registering your first account:

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user account
3. Go to Supabase Dashboard → Table Editor → profiles
4. Find your profile row
5. Edit the `is_admin` column and set it to `true`
6. Save the changes
7. Refresh your website and you'll see the Admin button

### Features Available:

**For All Users:**
- Browse game top-ups and vouchers
- Order via WhatsApp directly
- Register/Login with email
- Wallet system with balance tracking
- Multiple payment options (FPX, Touch n Go, Manual Transfer)
- Purchase history

**For Admins:**
- Update product prices
- Enable/disable products
- View all transactions
- Update transaction status (pending → completed)
- When you mark a top-up transaction as "completed", the wallet balance automatically updates

### Contact Information:

All footer links are already configured:
- WhatsApp: 0147433177
- Instagram: @MastermindEshop
- Telegram: @MastermindEsports_bot

### Important Notes:

- All prices are in Malaysian Ringgit (RM)
- The website is fully responsive for mobile and desktop
- Gaming-themed design with cyan (#00d9ff) and green (#00ffaa) accents
- Dark theme optimized for gaming audience

## Troubleshooting

If products don't appear:
1. Make sure you ran the `database_setup.sql` file completely
2. Check browser console for any errors
3. Verify your `.env` file has the correct Supabase credentials

If authentication doesn't work:
1. Check that email confirmation is disabled in Supabase (Settings → Authentication → Email Auth)
2. Verify the Supabase URL and anon key in `.env`
