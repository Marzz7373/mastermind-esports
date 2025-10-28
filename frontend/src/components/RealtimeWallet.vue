<template>
  <div class="realtime-wallet">
    <div class="wallet-header">
      <h3>💰 Wallet Balance</h3>
      <div class="balance-display">
        <span class="balance-amount" :class="{ 'updating': updating }">
          RM {{ walletBalance.toFixed(2) }}
        </span>
        <span v-if="lastUpdate" class="last-update">
          Updated {{ formatTime(lastUpdate) }}
        </span>
      </div>
    </div>

    <div class="wallet-actions">
      <button @click="showTopup = true" class="btn-topup">
        <span class="btn-icon">➕</span>
        Top Up
      </button>
      <button @click="showHistory = true" class="btn-history">
        <span class="btn-icon">📊</span>
        History
      </button>
    </div>

    <!-- Recent Transactions -->
    <div class="recent-transactions">
      <h4>Recent Activity</h4>
      <div v-if="recentTransactions.length === 0" class="no-transactions">
        No recent transactions
      </div>
      <div v-else class="transaction-list">
        <div 
          v-for="tx in recentTransactions.slice(0, 3)" 
          :key="tx.id"
          class="transaction-item"
          :class="tx.type"
        >
          <div class="tx-icon">
            <span v-if="tx.type === 'topup'">💰</span>
            <span v-else-if="tx.type === 'purchase'">🛒</span>
            <span v-else">📝</span>
          </div>
          <div class="tx-details">
            <p class="tx-description">{{ getTransactionDescription(tx) }}</p>
            <p class="tx-time">{{ formatTime(tx.created_at) }}</p>
          </div>
          <div class="tx-amount" :class="tx.type">
            {{ tx.type === 'topup' ? '+' : '-' }}RM {{ tx.amount.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Top-up Modal -->
    <div v-if="showTopup" class="modal-overlay" @click="showTopup = false">
      <div class="modal" @click.stop>
        <h3>Top Up Wallet</h3>
        
        <div class="topup-amount">
          <label>Amount (RM)</label>
          <input 
            v-model.number="topupAmount" 
            type="number" 
            min="10" 
            step="1" 
            placeholder="Enter amount"
          >
        </div>

        <div class="payment-methods">
          <h4>Payment Methods</h4>
          <button 
            v-for="method in paymentMethods" 
            :key="method.id"
            @click="initiateTopup(method)"
            class="payment-method"
            :disabled="topupAmount < 10"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <span class="method-name">{{ method.name }}</span>
          </button>
        </div>

        <button @click="showTopup = false" class="btn-close">Close</button>
      </div>
    </div>

    <!-- Transaction History Modal -->
    <div v-if="showHistory" class="modal-overlay" @click="showHistory = false">
      <div class="modal history-modal" @click.stop>
        <h3>Transaction History</h3>
        
        <div class="history-filters">
          <select v-model="historyFilter" @change="loadTransactionHistory">
            <option value="">All Transactions</option>
            <option value="topup">Top-ups</option>
            <option value="purchase">Purchases</option>
          </select>
        </div>

        <div class="history-list">
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="transactionHistory.length === 0" class="no-transactions">
            No transactions found
          </div>
          <div v-else>
            <div 
              v-for="tx in transactionHistory" 
              :key="tx.id"
              class="history-item"
              :class="tx.type"
            >
              <div class="tx-info">
                <p class="tx-description">{{ getTransactionDescription(tx) }}</p>
                <p class="tx-time">{{ formatTime(tx.created_at) }}</p>
                <p v-if="tx.status" class="tx-status" :class="tx.status">
                  {{ tx.status.toUpperCase() }}
                </p>
              </div>
              <div class="tx-amount" :class="tx.type">
                {{ tx.type === 'topup' ? '+' : '-' }}RM {{ tx.amount.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <button @click="showHistory = false" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { realtimeManager } from '../lib/realtime'
import { supabase } from '../lib/supabase'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const walletBalance = ref(0)
const lastUpdate = ref(null)
const updating = ref(false)
const recentTransactions = ref([])
const transactionHistory = ref([])
const showTopup = ref(false)
const showHistory = ref(false)
const topupAmount = ref(10)
const historyFilter = ref('')
const loading = ref(false)
const walletCallbackKey = ref(null)

const paymentMethods = [
  { id: 'fpx', name: 'FPX Online Banking', icon: '🏦' },
  { id: 'tng', name: "Touch 'n Go", icon: '📱' },
  { id: 'grab', name: 'GrabPay', icon: '🚗' },
  { id: 'duitnow', name: 'DuitNow QR', icon: '📱' },
  { id: 'manual', name: 'Manual Transfer', icon: '💳' }
]

onMounted(async () => {
  await loadWalletData()
  
  // Set up real-time wallet updates
  walletCallbackKey.value = realtimeManager.onNotification('wallet', handleWalletUpdate)
})

onUnmounted(() => {
  if (walletCallbackKey.value) {
    realtimeManager.offNotification(walletCallbackKey.value)
  }
})

async function loadWalletData() {
  try {
    // Load user profile with wallet balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_balance, updated_at')
      .eq('id', props.userId)
      .single()

    if (profileError) throw profileError

    walletBalance.value = profile.wallet_balance || 0
    lastUpdate.value = profile.updated_at

    // Load recent transactions
    await loadRecentTransactions()
  } catch (error) {
    console.error('Error loading wallet data:', error)
  }
}

async function loadRecentTransactions() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        product:products(name)
      `)
      .eq('user_id', props.userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    recentTransactions.value = data || []
  } catch (error) {
    console.error('Error loading recent transactions:', error)
  }
}

async function loadTransactionHistory() {
  loading.value = true
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        product:products(name)
      `)
      .eq('user_id', props.userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (historyFilter.value) {
      query = query.eq('type', historyFilter.value)
    }

    const { data, error } = await query

    if (error) throw error
    transactionHistory.value = data || []
  } catch (error) {
    console.error('Error loading transaction history:', error)
  } finally {
    loading.value = false
  }
}

function handleWalletUpdate(notification) {
  if (notification.type === 'wallet_update' && notification.data.id === props.userId) {
    updating.value = true
    
    // Animate balance change
    const oldBalance = notification.oldBalance
    const newBalance = notification.data.wallet_balance
    
    if (oldBalance !== newBalance) {
      // Show balance change animation
      setTimeout(() => {
        walletBalance.value = newBalance
        lastUpdate.value = new Date().toISOString()
        updating.value = false
      }, 500)
    }
  }
}

function getTransactionDescription(tx) {
  if (tx.type === 'topup') {
    return `Wallet Top-up via ${tx.payment_method}`
  } else if (tx.type === 'purchase') {
    return `Purchase: ${tx.product?.name || 'Game Credits'}`
  }
  return tx.description || 'Transaction'
}

function formatTime(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now - time) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return time.toLocaleDateString()
}

async function initiateTopup(method) {
  if (topupAmount.value < 10) {
    alert('Minimum top-up amount is RM10')
    return
  }

  try {
    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: props.userId,
        type: 'topup',
        amount: topupAmount.value,
        payment_method: method.name,
        status: 'pending'
      })

    if (error) throw error

    // Show WhatsApp link for manual payment
    const message = `Hi! I want to top up my wallet with RM${topupAmount.value} via ${method.name}. My user ID is ${props.userId}.`
    const whatsappUrl = `https://wa.me/60147433177?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
    showTopup.value = false
    topupAmount.value = 10
    
    // Refresh data
    await loadWalletData()
  } catch (error) {
    console.error('Error initiating top-up:', error)
    alert('Error creating top-up request. Please try again.')
  }
}
</script>

<style scoped>
.realtime-wallet {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00d9ff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
}

.wallet-header h3 {
  margin: 0;
  color: #00d9ff;
  font-size: 18px;
}

.balance-display {
  text-align: right;
}

.balance-amount {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
  transition: all 0.3s ease;
}

.balance-amount.updating {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.last-update {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.wallet-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-topup, .btn-history {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #00d9ff;
  border-radius: 8px;
  background: #2a2a4a;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-topup:hover, .btn-history:hover {
  background: #00d9ff;
  color: #000;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 16px;
}

.recent-transactions h4 {
  color: #00ffaa;
  margin-bottom: 12px;
  font-size: 14px;
}

.no-transactions {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid #333;
}

.tx-icon {
  font-size: 20px;
  margin-right: 12px;
}

.tx-details {
  flex: 1;
  min-width: 0;
}

.tx-description {
  margin: 0 0 4px 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.tx-time {
  margin: 0;
  color: #888;
  font-size: 12px;
}

.tx-amount {
  font-weight: bold;
  font-size: 16px;
}

.tx-amount.topup {
  color: #00ffaa;
}

.tx-amount.purchase {
  color: #ff6b6b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
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
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h3 {
  color: #00d9ff;
  margin-bottom: 20px;
  text-align: center;
}

.topup-amount {
  margin-bottom: 20px;
}

.topup-amount label {
  display: block;
  margin-bottom: 8px;
  color: #fff;
  font-weight: 500;
}

.topup-amount input {
  width: 100%;
  padding: 12px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #0a0a1a;
  color: #fff;
  font-size: 16px;
}

.topup-amount input:focus {
  outline: none;
  border-color: #00d9ff;
}

.payment-methods h4 {
  color: #00ffaa;
  margin-bottom: 12px;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.payment-method {
  padding: 16px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #2a2a4a;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-method:hover:not(:disabled) {
  border-color: #00d9ff;
  background: #00d9ff;
  color: #000;
}

.payment-method:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.method-icon {
  font-size: 20px;
}

.method-name {
  font-weight: 500;
}

.history-modal {
  max-width: 600px;
}

.history-filters {
  margin-bottom: 20px;
}

.history-filters select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #0a0a1a;
  color: #fff;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid #333;
}

.tx-info {
  flex: 1;
}

.tx-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
  margin-top: 4px;
  display: inline-block;
}

.tx-status.pending {
  background: #ffa500;
  color: #000;
}

.tx-status.completed {
  background: #00ffaa;
  color: #000;
}

.tx-status.failed {
  background: #ff6b6b;
  color: #fff;
}

.btn-close {
  width: 100%;
  padding: 12px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.btn-close:hover {
  background: #555;
}

.loading {
  text-align: center;
  color: #00d9ff;
  padding: 20px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .wallet-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .balance-display {
    text-align: left;
  }
  
  .wallet-actions {
    flex-direction: column;
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
  
  .modal {
    padding: 16px;
  }
}
</style>