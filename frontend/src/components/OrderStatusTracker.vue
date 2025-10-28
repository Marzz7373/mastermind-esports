<template>
  <div class="order-status-tracker">
    <div v-if="currentOrder" class="order-card">
      <div class="order-header">
        <h3>Order #{{ orderId }}</h3>
        <span class="order-amount">RM {{ currentOrder.amount.toFixed(2) }}</span>
      </div>
      
      <div class="order-details">
        <p><strong>Product:</strong> {{ currentOrder.product?.name || 'Game Credits' }}</p>
        <p><strong>Game ID:</strong> {{ currentOrder.game_id || 'N/A' }}</p>
        <p><strong>Ordered:</strong> {{ formatTime(currentOrder.created_at) }}</p>
      </div>

      <div class="status-timeline">
        <div 
          v-for="(status, index) in statusSteps" 
          :key="status.key"
          class="status-step"
          :class="getStatusClass(status.key, index)"
        >
          <div class="status-icon">
            <span v-if="getStatusIcon(status.key)">{{ getStatusIcon(status.key) }}</span>
          </div>
          <div class="status-content">
            <p class="status-title">{{ status.title }}</p>
            <p class="status-description">{{ status.description }}</p>
            <p v-if="getStatusTime(status.key)" class="status-time">
              {{ getStatusTime(status.key) }}
            </p>
          </div>
        </div>
      </div>

      <div class="order-actions">
        <button @click="refreshOrder" :disabled="loading" class="btn-refresh">
          {{ loading ? 'Refreshing...' : 'Refresh Status' }}
        </button>
        <button @click="contactSupport" class="btn-support">
          Contact Support
        </button>
      </div>
    </div>

    <div v-else class="no-order">
      <h3>No Active Order</h3>
      <p>You don't have any active orders to track.</p>
      <button @click="$emit('browse-products')" class="btn-browse">
        Browse Products
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { realtimeManager } from '../lib/realtime'
import { supabase } from '../lib/supabase'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['browse-products'])

const currentOrder = ref(null)
const loading = ref(false)
const orderUpdates = ref([])
const notificationCallbackKey = ref(null)

const statusSteps = [
  {
    key: 'pending',
    title: 'Order Received',
    description: 'Your order has been received and is being processed'
  },
  {
    key: 'processing',
    title: 'Processing Payment',
    description: 'Payment is being verified and processed'
  },
  {
    key: 'preparing',
    title: 'Preparing Order',
    description: 'Your game credits are being prepared for delivery'
  },
  {
    key: 'delivering',
    title: 'Delivering',
    description: 'Credits are being sent to your game account'
  },
  {
    key: 'completed',
    title: 'Delivered',
    description: 'Your order has been successfully delivered!'
  }
]

onMounted(async () => {
  await loadOrder()
  
  // Set up real-time order updates
  notificationCallbackKey.value = realtimeManager.onNotification('order', handleOrderUpdate)
})

onUnmounted(() => {
  if (notificationCallbackKey.value) {
    realtimeManager.offNotification(notificationCallbackKey.value)
  }
})

async function loadOrder() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        product:products(*)
      `)
      .eq('id', props.orderId)
      .single()

    if (error) throw error
    
    currentOrder.value = data
    
    // Load order update history
    await loadOrderUpdates()
  } catch (error) {
    console.error('Error loading order:', error)
  } finally {
    loading.value = false
  }
}

async function loadOrderUpdates() {
  try {
    const { data, error } = await supabase
      .from('order_updates')
      .select('*')
      .eq('transaction_id', props.orderId)
      .order('created_at', { ascending: true })

    if (error) throw error
    orderUpdates.value = data || []
  } catch (error) {
    console.error('Error loading order updates:', error)
  }
}

function handleOrderUpdate(notification) {
  if (notification.type === 'order_update' && notification.data.id === props.orderId) {
    currentOrder.value = notification.data
    loadOrderUpdates()
  }
}

function getStatusClass(statusKey, index) {
  if (!currentOrder.value) return 'inactive'
  
  const currentStatus = currentOrder.value.status
  const statusOrder = ['pending', 'processing', 'preparing', 'delivering', 'completed']
  
  const currentIndex = statusOrder.indexOf(currentStatus)
  const stepIndex = statusOrder.indexOf(statusKey)
  
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'active'
  return 'inactive'
}

function getStatusIcon(statusKey) {
  const icons = {
    pending: '📝',
    processing: '💳',
    preparing: '⚙️',
    delivering: '🚀',
    completed: '✅'
  }
  return icons[statusKey] || '⏳'
}

function getStatusTime(statusKey) {
  const update = orderUpdates.value.find(u => u.status === statusKey)
  return update ? formatTime(update.created_at) : null
}

function formatTime(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now - time) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  return time.toLocaleDateString()
}

async function refreshOrder() {
  await loadOrder()
}

function contactSupport() {
  const message = `Hi! I need help with my order #${props.orderId}. Current status: ${currentOrder.value?.status || 'Unknown'}`
  const whatsappUrl = `https://wa.me/60147433177?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}
</script>

<style scoped>
.order-status-tracker {
  max-width: 600px;
  margin: 0 auto;
}

.order-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00d9ff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
}

.order-header h3 {
  margin: 0;
  color: #00d9ff;
  font-size: 20px;
}

.order-amount {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
}

.order-details {
  margin-bottom: 24px;
}

.order-details p {
  margin: 8px 0;
  color: #aaa;
  font-size: 14px;
}

.status-timeline {
  margin-bottom: 24px;
}

.status-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
}

.status-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background: #333;
}

.status-step.completed:not(:last-child)::after {
  background: #00ffaa;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  font-size: 18px;
  background: #333;
  border: 2px solid #333;
}

.status-step.completed .status-icon {
  background: #00ffaa;
  border-color: #00ffaa;
  color: #000;
}

.status-step.active .status-icon {
  background: #00d9ff;
  border-color: #00d9ff;
  color: #000;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.status-content {
  flex: 1;
  min-width: 0;
}

.status-title {
  margin: 0 0 4px 0;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.status-step.inactive .status-title {
  color: #666;
}

.status-description {
  margin: 0 0 4px 0;
  color: #aaa;
  font-size: 14px;
  line-height: 1.4;
}

.status-step.inactive .status-description {
  color: #555;
}

.status-time {
  margin: 0;
  color: #888;
  font-size: 12px;
  font-style: italic;
}

.order-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-refresh, .btn-support, .btn-browse {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-refresh {
  background: #00d9ff;
  color: #000;
}

.btn-refresh:hover:not(:disabled) {
  background: #00b8e6;
  transform: translateY(-2px);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-support {
  background: #ff6b6b;
  color: #fff;
}

.btn-support:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.btn-browse {
  background: #00ffaa;
  color: #000;
}

.btn-browse:hover {
  background: #00e699;
  transform: translateY(-2px);
}

.no-order {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #333;
  border-radius: 16px;
}

.no-order h3 {
  color: #00d9ff;
  margin-bottom: 12px;
}

.no-order p {
  color: #aaa;
  margin-bottom: 20px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .order-card {
    padding: 16px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .btn-refresh, .btn-support, .btn-browse {
    width: 100%;
  }
}
</style>