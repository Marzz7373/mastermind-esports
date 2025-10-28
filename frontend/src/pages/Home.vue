<template>
  <div class="home-page">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <h1 class="logo">⚡ Mastermind Esports</h1>
          <div class="nav-buttons">
            <button v-if="!user" @click="showAuthModal = true" class="btn-primary">Login</button>
            <div v-else class="user-menu">
              <span class="wallet-balance">💰 RM {{ walletBalance.toFixed(2) }}</span>
              <button @click="showWallet = true" class="btn-secondary">Wallet</button>
              <button v-if="isAdmin" @click="showAdmin = true" class="btn-admin">Admin</button>
              <button @click="handleLogout" class="btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <section class="hero">
      <div class="container">
        <h2 class="hero-title">Mastermind Esports</h2>
        <p class="hero-slogan">Fast • Trusted • Affordable</p>
        <p class="hero-subtitle">Your One-Stop Shop for Game Top-Ups & Vouchers</p>
      </div>
    </section>

    <section class="categories">
      <div class="container">
        <div class="category-grid">
          <div v-for="category in categories" :key="category.id" class="category-card" @click="selectedCategory = category">
            <div class="category-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <section v-if="selectedCategory" class="products-section">
      <div class="container">
        <h2 class="section-title">{{ selectedCategory.name }}</h2>
        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-footer">
              <span class="product-price">RM {{ product.price.toFixed(2) }}</span>
              <button @click="handleBuyNow(product)" class="btn-buy">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showPurchaseOptions" class="modal-overlay" @click="showPurchaseOptions = false">
      <div class="modal" @click.stop>
        <h2>Choose Payment Method</h2>
        <p class="product-details">{{ selectedProduct?.name }} - RM {{ selectedProduct?.price.toFixed(2) }}</p>

        <div class="payment-options">
          <button @click="handleWhatsApp" class="payment-btn whatsapp-btn">
            <span class="btn-icon">💬</span>
            Order via WhatsApp
          </button>

          <div class="divider">OR</div>

          <button v-if="!user" @click="showAuthModal = true; showPurchaseOptions = false" class="payment-btn login-btn">
            <span class="btn-icon">👤</span>
            Login & Use Wallet
          </button>

          <button v-else @click="handleWalletPurchase" class="payment-btn wallet-btn" :disabled="walletBalance < selectedProduct?.price">
            <span class="btn-icon">💰</span>
            Pay with Wallet (RM {{ walletBalance.toFixed(2) }})
          </button>

          <p v-if="user && walletBalance < selectedProduct?.price" class="insufficient-balance">
            Insufficient balance. Please top up your wallet first.
          </p>
        </div>

        <button @click="showPurchaseOptions = false" class="btn-close">Close</button>
      </div>
    </div>

    <div v-if="showAuthModal" class="modal-overlay" @click="showAuthModal = false">
      <div class="modal auth-modal" @click.stop>
        <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

        <form @submit.prevent="handleAuth">
          <div class="form-group">
            <label>Email</label>
            <input v-model="authForm.email" type="email" required placeholder="your@email.com">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input v-model="authForm.password" type="password" required placeholder="••••••••">
          </div>

          <div v-if="!isLogin" class="form-group">
            <label>Full Name</label>
            <input v-model="authForm.fullName" type="text" required placeholder="John Doe">
          </div>

          <div v-if="!isLogin" class="form-group">
            <label>Phone Number</label>
            <input v-model="authForm.phone" type="tel" required placeholder="0147433177">
          </div>

          <button type="submit" class="btn-primary btn-full">{{ isLogin ? 'Login' : 'Register' }}</button>
        </form>

        <p class="auth-switch">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <a href="#" @click.prevent="isLogin = !isLogin">{{ isLogin ? 'Register' : 'Login' }}</a>
        </p>

        <button @click="showAuthModal = false" class="btn-close">Close</button>
      </div>
    </div>

    <div v-if="showWallet" class="modal-overlay" @click="showWallet = false">
      <div class="modal wallet-modal" @click.stop>
        <h2>My Wallet</h2>

        <div class="wallet-balance-display">
          <p>Current Balance</p>
          <h3>RM {{ walletBalance.toFixed(2) }}</h3>
        </div>

        <div class="topup-section">
          <h3>Top Up Wallet</h3>
          <input v-model.number="topupAmount" type="number" min="10" step="1" placeholder="Enter amount (min RM10)">

          <div class="payment-methods">
            <button @click="handleTopup('FPX')" class="payment-method-btn">
              🏦 FPX Online Banking
            </button>
            <button @click="handleTopup('Touch n Go')" class="payment-method-btn">
              📱 Touch 'n Go
            </button>
            <button @click="handleTopup('Manual Transfer')" class="payment-method-btn">
              💳 Manual Transfer
            </button>
          </div>
        </div>

        <div class="transactions-section">
          <h3>Recent Transactions</h3>
          <div v-if="transactions.length === 0" class="no-transactions">No transactions yet</div>
          <div v-else class="transaction-list">
            <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
              <div>
                <p class="tx-type">{{ tx.type === 'topup' ? 'Wallet Top Up' : tx.product?.name || 'Purchase' }}</p>
                <p class="tx-date">{{ new Date(tx.created_at).toLocaleDateString() }}</p>
              </div>
              <div class="tx-right">
                <p class="tx-amount" :class="tx.type">{{ tx.type === 'topup' ? '+' : '-' }}RM {{ tx.amount.toFixed(2) }}</p>
                <span class="tx-status" :class="tx.status">{{ tx.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <button @click="showWallet = false" class="btn-close">Close</button>
      </div>
    </div>

    <div v-if="showAdmin && isAdmin" class="modal-overlay" @click="showAdmin = false">
      <div class="modal admin-modal" @click.stop>
        <h2>Admin Panel</h2>

        <div class="admin-tabs">
          <button @click="adminTab = 'products'" :class="{active: adminTab === 'products'}">Products</button>
          <button @click="adminTab = 'transactions'" :class="{active: adminTab === 'transactions'}">Transactions</button>
        </div>

        <div v-if="adminTab === 'products'" class="admin-content">
          <h3>Manage Products</h3>
          <div class="product-list">
            <div v-for="product in allProducts" :key="product.id" class="admin-product-item">
              <div class="product-info">
                <strong>{{ product.name }}</strong>
                <p>{{ product.description }}</p>
              </div>
              <div class="product-actions">
                <input v-model.number="product.price" type="number" step="0.01" @change="updateProduct(product)">
                <button @click="toggleProductStatus(product)" class="btn-toggle">
                  {{ product.is_active ? 'Disable' : 'Enable' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="adminTab === 'transactions'" class="admin-content">
          <h3>All Transactions</h3>
          <div class="transaction-list">
            <div v-for="tx in allTransactions" :key="tx.id" class="transaction-item admin">
              <div>
                <p><strong>{{ tx.profile?.email || 'User' }}</strong></p>
                <p>{{ tx.type === 'topup' ? 'Wallet Top Up' : tx.product?.name || 'Purchase' }}</p>
                <p class="tx-date">{{ new Date(tx.created_at).toLocaleString() }}</p>
                <p v-if="tx.game_id">Game ID: {{ tx.game_id }}</p>
              </div>
              <div class="tx-right">
                <p>RM {{ tx.amount.toFixed(2) }}</p>
                <p>{{ tx.payment_method }}</p>
                <select v-model="tx.status" @change="updateTransactionStatus(tx)">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button @click="showAdmin = false" class="btn-close">Close</button>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Mastermind Esports</h3>
            <p>Your trusted gaming top-up partner</p>
          </div>

          <div class="footer-section">
            <h4>Contact Us</h4>
            <p>📱 WhatsApp: 0147433177</p>
            <p>📷 Instagram: @MastermindEshop</p>
            <p>💬 Telegram: @MastermindEsports_bot</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>Copyright © 2025 Mastermind Esports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useToast } from '../composables/useToast'

const { success, error, warning, info } = useToast()

const user = ref(null)
const profile = ref(null)
const categories = ref([])
const products = ref([])
const allProducts = ref([])
const selectedCategory = ref(null)
const showPurchaseOptions = ref(false)
const selectedProduct = ref(null)
const showAuthModal = ref(false)
const isLogin = ref(true)
const showWallet = ref(false)
const showAdmin = ref(false)
const adminTab = ref('products')
const transactions = ref([])
const allTransactions = ref([])
const topupAmount = ref(10)

const authForm = ref({
  email: '',
  password: '',
  fullName: '',
  phone: ''
})

const walletBalance = computed(() => profile.value?.wallet_balance || 0)
const isAdmin = computed(() => profile.value?.is_admin || false)

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return []
  return products.value.filter(p => p.category_id === selectedCategory.value.id)
})

onMounted(async () => {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (authUser) {
    user.value = authUser
    await loadProfile()
    await loadTransactions()
  }

  await loadCategories()
  await loadProducts()

  supabase.auth.onAuthStateChange((_event, session) => {
    (async () => {
      if (session?.user) {
        user.value = session.user
        await loadProfile()
        await loadTransactions()
      } else {
        user.value = null
        profile.value = null
      }
    })()
  })
})

async function loadProfile() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .maybeSingle()

  profile.value = data
}

async function loadCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  categories.value = data || []
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0]
  }
}

async function loadProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  products.value = data || []

  if (isAdmin.value) {
    const { data: allData } = await supabase
      .from('products')
      .select('*')
      .order('display_order')
    allProducts.value = allData || []
  }
}

async function loadTransactions() {
  const { data } = await supabase
    .from('transactions')
    .select('*, product:products(*)')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
    .limit(10)

  transactions.value = data || []

  if (isAdmin.value) {
    const { data: allData } = await supabase
      .from('transactions')
      .select('*, product:products(*), profile:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(50)
    allTransactions.value = allData || []
  }
}

function handleBuyNow(product) {
  selectedProduct.value = product
  showPurchaseOptions.value = true
}

function handleWhatsApp() {
  const message = `Hi, I want to order ${selectedProduct.value.name} for RM ${selectedProduct.value.price.toFixed(2)}`
  const whatsappUrl = `https://wa.me/60147433177?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  showPurchaseOptions.value = false
  info('Opening WhatsApp... Your order details are ready!')
}

async function handleWalletPurchase() {
  if (walletBalance.value < selectedProduct.value.price) {
    warning('Insufficient balance. Please top up your wallet.')
    return
  }

  const gameId = prompt('Please enter your Game ID / Player ID:')
  if (!gameId) return

  const newBalance = walletBalance.value - selectedProduct.value.price

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', user.value.id)

  if (updateError) {
    error('Error processing payment. Please try again.')
    return
  }

  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.value.id,
      type: 'purchase',
      amount: selectedProduct.value.price,
      payment_method: 'Wallet',
      status: 'pending',
      product_id: selectedProduct.value.id,
      game_id: gameId
    })

  if (!txError) {
    success(`✅ Purchase successful! ${selectedProduct.value.name} is being processed.`)
    await loadProfile()
    await loadTransactions()
    showPurchaseOptions.value = false
  } else {
    error('Failed to create transaction. Please contact support.')
  }
}

async function handleAuth() {
  if (isLogin.value) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authForm.value.email,
      password: authForm.value.password
    })

    if (error) {
      error(error.message)
    } else {
      user.value = data.user
      await loadProfile()
      showAuthModal.value = false
      success('Welcome back! Successfully logged in.')
    }
  } else {
    const { data, error } = await supabase.auth.signUp({
      email: authForm.value.email,
      password: authForm.value.password
    })

    if (error) {
      error(error.message)
    } else {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: authForm.value.email,
          full_name: authForm.value.fullName,
          phone: authForm.value.phone
        })

      if (!profileError) {
        user.value = data.user
        await loadProfile()
        showAuthModal.value = false
        success('Registration successful! Welcome to Mastermind Esports.')
      } else {
        error('Failed to create profile. Please try again.')
      }
    }
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  user.value = null
  profile.value = null
}

async function handleTopup(method) {
  if (topupAmount.value < 10) {
    warning('Minimum top-up amount is RM10')
    return
  }

  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.value.id,
      type: 'topup',
      amount: topupAmount.value,
      payment_method: method,
      status: 'pending'
    })

  if (!txError) {
    success(`Top-up request submitted via ${method}. Please contact us on WhatsApp (0147433177) to complete payment.`)
    await loadTransactions()
    topupAmount.value = 10
  } else {
    error('Failed to submit top-up request. Please try again.')
  }
}

async function updateProduct(product) {
  const { error: updateError } = await supabase
    .from('products')
    .update({ price: product.price })
    .eq('id', product.id)

  if (!updateError) {
    success('Product updated successfully')
    await loadProducts()
  } else {
    error('Failed to update product')
  }
}

async function toggleProductStatus(product) {
  const { error: updateError } = await supabase
    .from('products')
    .update({ is_active: !product.is_active })
    .eq('id', product.id)

  if (!updateError) {
    success('Product status updated')
    await loadProducts()
  } else {
    error('Failed to update product status')
  }
}

async function updateTransactionStatus(tx) {
  const updates = { status: tx.status }

  if (tx.status === 'completed') {
    updates.completed_at = new Date().toISOString()

    if (tx.type === 'topup') {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', tx.user_id)
        .single()

      if (profileData) {
        await supabase
          .from('profiles')
          .update({ wallet_balance: profileData.wallet_balance + tx.amount })
          .eq('id', tx.user_id)
      }
    }
  }

  const { error: updateError } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', tx.id)

  if (!updateError) {
    success('Transaction updated successfully')
    await loadTransactions()
  } else {
    error('Failed to update transaction')
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  background: rgba(15, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid #00d9ff;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #00d9ff;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
}

.nav-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.user-menu {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.wallet-balance {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 3px solid #00d9ff;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00d9ff 0%, #00ffaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-slogan {
  font-size: 24px;
  color: #00ffaa;
  margin-bottom: 8px;
  font-weight: 600;
}

.hero-subtitle {
  font-size: 18px;
  color: #aaa;
}

.categories {
  padding: 48px 20px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.category-card {
  background: linear-gradient(135deg, #1f1f3a 0%, #2a2a4a 100%);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: #00d9ff;
  box-shadow: 0 8px 32px rgba(0, 217, 255, 0.3);
}

.category-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.products-section {
  padding: 48px 20px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 32px;
  color: #00d9ff;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: linear-gradient(135deg, #1f1f3a 0%, #2a2a4a 100%);
  padding: 24px;
  border-radius: 12px;
  border: 2px solid #333;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: #00ffaa;
  box-shadow: 0 8px 24px rgba(0, 255, 170, 0.2);
}

.product-name {
  font-size: 20px;
  margin-bottom: 8px;
  color: #fff;
}

.product-description {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 16px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
}

.btn-buy {
  background: linear-gradient(135deg, #00d9ff 0%, #00ffaa 100%);
  color: #000;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-buy:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 217, 255, 0.4);
}

.btn-primary, .btn-secondary, .btn-admin {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #00d9ff 0%, #00ffaa 100%);
  color: #000;
}

.btn-secondary {
  background: #2a2a4a;
  color: #fff;
  border: 2px solid #00d9ff;
}

.btn-admin {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: #fff;
}

.btn-primary:hover, .btn-secondary:hover, .btn-admin:hover {
  transform: scale(1.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00d9ff;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  color: #00d9ff;
  margin-bottom: 24px;
  text-align: center;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-btn {
  padding: 16px;
  border: 2px solid #00d9ff;
  border-radius: 12px;
  background: #2a2a4a;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.payment-btn:hover:not(:disabled) {
  background: #00d9ff;
  color: #000;
  transform: scale(1.02);
}

.payment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.whatsapp-btn {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  border-color: #25D366;
}

.btn-icon {
  font-size: 24px;
}

.divider {
  text-align: center;
  color: #666;
  margin: 8px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #00d9ff;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a2e;
  color: #fff;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #00d9ff;
}

.btn-full {
  width: 100%;
  margin-top: 8px;
}

.auth-switch {
  text-align: center;
  margin-top: 16px;
  color: #aaa;
}

.auth-switch a {
  color: #00d9ff;
  text-decoration: none;
  font-weight: bold;
}

.btn-close {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.wallet-balance-display {
  text-align: center;
  background: linear-gradient(135deg, #2a2a4a 0%, #3a3a5a 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.wallet-balance-display h3 {
  font-size: 36px;
  color: #ffd700;
  margin-top: 8px;
}

.topup-section {
  margin-bottom: 24px;
}

.topup-section h3 {
  color: #00ffaa;
  margin-bottom: 16px;
}

.topup-section input {
  width: 100%;
  padding: 12px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a2e;
  color: #fff;
  margin-bottom: 16px;
  font-size: 16px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method-btn {
  padding: 14px;
  border: 2px solid #00d9ff;
  border-radius: 8px;
  background: #2a2a4a;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.payment-method-btn:hover {
  background: #00d9ff;
  color: #000;
}

.transactions-section h3 {
  color: #00ffaa;
  margin-bottom: 16px;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  background: #2a2a4a;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #333;
}

.tx-type {
  font-weight: bold;
  color: #fff;
}

.tx-date {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.tx-right {
  text-align: right;
}

.tx-amount {
  font-weight: bold;
  font-size: 18px;
}

.tx-amount.topup {
  color: #00ffaa;
}

.tx-amount.purchase {
  color: #ff6b6b;
}

.tx-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 4px;
}

.tx-status.pending {
  background: #ffa500;
  color: #000;
}

.tx-status.completed {
  background: #00ffaa;
  color: #000;
}

.tx-status.failed, .tx-status.cancelled {
  background: #ff6b6b;
  color: #fff;
}

.admin-modal {
  max-width: 800px;
}

.admin-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.admin-tabs button {
  flex: 1;
  padding: 12px;
  border: 2px solid #333;
  background: #2a2a4a;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.admin-tabs button.active {
  border-color: #00d9ff;
  background: #00d9ff;
  color: #000;
}

.admin-content h3 {
  color: #00ffaa;
  margin-bottom: 16px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-product-item {
  background: #2a2a4a;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.product-info {
  flex: 1;
}

.product-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.product-actions input {
  width: 100px;
  padding: 8px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a2e;
  color: #fff;
}

.btn-toggle {
  padding: 8px 16px;
  border: 2px solid #00d9ff;
  background: #2a2a4a;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.transaction-item.admin {
  flex-direction: column;
  align-items: flex-start;
}

.transaction-item.admin .tx-right {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.transaction-item.admin select {
  padding: 6px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a2e;
  color: #fff;
}

.footer {
  background: #0f0f1e;
  padding: 40px 20px 20px;
  margin-top: 60px;
  border-top: 2px solid #00d9ff;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 24px;
}

.footer-section h3 {
  color: #00d9ff;
  margin-bottom: 16px;
}

.footer-section h4 {
  color: #00ffaa;
  margin-bottom: 12px;
}

.footer-section p {
  color: #aaa;
  margin-bottom: 8px;
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #333;
  color: #666;
}

.insufficient-balance {
  color: #ff6b6b;
  text-align: center;
  font-size: 14px;
}

.no-transactions {
  text-align: center;
  color: #666;
  padding: 24px;
}

.product-details {
  text-align: center;
  color: #aaa;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-slogan {
    font-size: 18px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .nav-content {
    justify-content: center;
  }

  .user-menu {
    justify-content: center;
  }

  .modal {
    padding: 20px;
  }
}
</style>
