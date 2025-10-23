// Supabase Configuration for Mastermind Esports
// Replace with your actual Supabase project details

const SUPABASE_CONFIG = {
    url: 'https://jboyorkrdwzgusctfhco.supabase.co', // Your project URL
    anon_key: 'YOUR_SUPABASE_ANON_KEY_HERE', // Replace with your anon key
    service_role_key: 'YOUR_SERVICE_ROLE_KEY_HERE' // For admin operations (keep secure)
};

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anon_key);

// Database helper functions
class MastermindDB {
    
    // ===== PRODUCTS =====
    
    static async getProducts(categorySlug = null) {
        try {
            let query = supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        name,
                        slug,
                        icon
                    )
                `)
                .eq('is_active', true)
                .order('display_order');
            
            if (categorySlug) {
                query = query.eq('categories.slug', categorySlug);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
    
    static async getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('display_order');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
    
    // ===== USER MANAGEMENT =====
    
    static async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }
    
    static async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    }
    
    static async updateWalletBalance(userId, amount, type = 'topup') {
        try {
            // Get current balance
            const profile = await this.getUserProfile(userId);
            if (!profile) throw new Error('User profile not found');
            
            const newBalance = parseFloat(profile.wallet_balance) + parseFloat(amount);
            
            if (newBalance < 0) {
                throw new Error('Insufficient wallet balance');
            }
            
            // Update balance
            const { data, error } = await supabase
                .from('profiles')
                .update({ 
                    wallet_balance: newBalance,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();
            
            if (error) throw error;
            
            // Record transaction
            await this.createTransaction({
                user_id: userId,
                type: type,
                amount: Math.abs(amount),
                payment_method: 'Wallet',
                status: 'completed'
            });
            
            return data;
        } catch (error) {
            console.error('Error updating wallet:', error);
            throw error;
        }
    }
    
    // ===== TRANSACTIONS =====
    
    static async createTransaction(transactionData) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert([transactionData])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }
    
    static async getUserTransactions(userId, limit = 50) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    products (
                        name,
                        description
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }
    
    static async updateTransactionStatus(transactionId, status, notes = null) {
        try {
            const updateData = { 
                status,
                updated_at: new Date().toISOString()
            };
            
            if (status === 'completed') {
                updateData.completed_at = new Date().toISOString();
            }
            
            if (notes) {
                updateData.notes = notes;
            }
            
            const { data, error } = await supabase
                .from('transactions')
                .update(updateData)
                .eq('id', transactionId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }
    
    // ===== AUTHENTICATION =====
    
    static async signInWithPhone(phone) {
        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                phone: phone,
                options: {
                    channel: 'sms'
                }
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }
    
    static async verifyOTP(phone, token) {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phone,
                token: token,
                type: 'sms'
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    }
    
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    static async getAllTransactions(status = null, limit = 100) {
        try {
            let query = supabase
                .from('transactions')
                .select(`
                    *,
                    profiles (
                        full_name,
                        phone,
                        email
                    ),
                    products (
                        name,
                        description
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (status) {
                query = query.eq('status', status);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching all transactions:', error);
            return [];
        }
    }
    
    static async getAllUsers(limit = 100) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
}

// Export for use in other files
window.MastermindDB = MastermindDB;
window.supabaseClient = supabase;
