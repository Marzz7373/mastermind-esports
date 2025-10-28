<template>
  <div class="realtime-admin-dashboard">
    <!-- Real-time Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>Total Users</p>
          <span class="stat-change" :class="stats.userChange >= 0 ? 'positive' : 'negative'">
            {{ stats.userChange >= 0 ? '+' : '' }}{{ stats.userChange }} today
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>RM {{ stats.todayRevenue.toFixed(2) }}</h3>
          <p>Today's Revenue</p>
          <span class="stat-change" :class="stats.revenueChange >= 0 ? 'positive' : 'negative'">
            {{ stats.revenueChange >= 0 ? '+' : '' }}{{ stats.revenueChange }}% vs yesterday
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>{{ stats.pendingOrders }}</h3>
          <p>Pending Orders</p>
          <span class="stat-change" :class="stats.orderChange >= 0 ? 'positive' : 'negative'">
            {{ stats.orderChange >= 0 ? '+' : '' }}{{ stats.orderChange }} in last hour
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <h3>{{ stats.avgProcessingTime }}m</h3>
          <p>Avg Processing Time</p>
          <span class="stat-change" :class="stats.timeChange <= 0 ? 'positive' : 'negative'">
            {{ stats.timeChange <= 0 ? '' : '+' }}{{ stats.timeChange }}m vs yesterday
          </span>
        </div>
      </div>
    </div>

    <!-- Real-time Activity Feed -->
    <div class="activity-feed">
      <h3>Real-time Activity</h3>
      <div class="activity-list">
        <div v-if="activities.length === 0" class="no-activity">
          No recent activity
        </div>
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          class="activity-item"
          :class="activity.type"
        >
          <div class="activity-icon">
            <span v-if="activity.type === 'order'">🛒</span>
            <span v-else-if="activity.type === 'payment'">💳</span>
            <span v-else-if="activity.type === 'user'">👤</span>
            <span v-else">📢</span>
          </div>
          <div class="activity-content">
            <p class="activity-message">{{ activity.message }}</p>
            <p class="activity-time">{{ formatTime(activity.created_at) }}</p>
          </div>
          <div class="activity-amount" v-if="activity.amount">
            RM {{ activity.amount.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Live Order Queue -->
    <div class="order-queue">
      <h3>Live Order Queue</h3>
      <div class="queue-filters">
        <button 
          v-for="filter in queueFilters" 
          :key="filter.key"
          @click="activeFilter = filter.key"
          :class="{ active: activeFilter === filter.key }"
          class="filter-btn"
        >
          {{ filter.label }} ({{ getFilterCount(filter.key) }})
        </button>
      </div>
      
      <div class="queue-list">
        <div v-if="filteredOrders.length === 0" class="no-orders">
          No orders in this category
        </div>
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="queue-item"
          :class="order.status"
        >
          <div class="order-info">
            <h4>Order #{{ order.id.substring(0, 8) }}</h4>
            <p>{{ order.product?.name || 'Game Credits' }} - RM {{ order.amount.toFixed(2) }}</p>
            <p>Customer: {{ order.profiles?.full_name || order.profiles?.email || 'Unknown' }}</p>
            <p>Game ID: {{ order.game_id || 'N/A' }}</p>
          </div>
          <div class="order-actions">
            <button 
              @click="updateOrderStatus(order.id, 'processing')"
              v-if="order.status === 'pending'"
              class="btn-process"
            >
              Process
            </button>
            <button 
              @click="updateOrderStatus(order.id, 'completed')"
              v-if="order.status === 'processing'"
              class="btn-complete"
            >
              Complete
            </button>
            <button 
              @click="updateOrderStatus(order.id, 'failed')"
              class="btn-fail"
            >
              Mark Failed
            </button>
          </div>
          <div class="order-time">
            {{ formatTime(order.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Notifications -->
    <div class="admin-notifications">
      <h3>System Notifications</h3>
      <div class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="notification.priority"
        >
          <div class="notification-icon">
            <span v-if="notification.priority === 'high'">🚨</span>
            <span v-else-if="notification.priority === 'medium'">⚠️</span>
            <span v-else">ℹ️</span>
          </div>
          <div class="notification-content">
            <p class="notification-message">{{ notification.message }}</p>
            <p class="notification-time">{{ formatTime(notification.created_at) }}</p>
          </div>
          <button @click="dismissNotification(notification.id)" class="btn-dismiss">
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { realtimeManager } from '../lib/realtime'
import { supabase } from '../lib/supabase'

const stats = ref({
  totalUsers: 0,
  userChange: 0,
  todayRevenue: 0,
  revenueChange: 0,
  pendingOrders: 0,
  orderChange: 0,
  avgProcessingTime: 0,
  timeChange: 0
})

const activities = ref([])
const orders = ref([])
const notifications = ref([])
const activeFilter = ref('all')

const queueFilters = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' }
]

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeFilter.value)
})

const notificationCallbackKey = ref(null)

onMounted(async () => {
  await loadDashboardData()
  
  // Set up real-time updates
  notificationCallbackKey.value = realtimeManager.onNotification('admin', handleRealtimeUpdate)
  
  // Load data every 30 seconds
  setInterval(loadDashboardData, 30000)
})

onUnmounted(() => {
  if (notificationCallbackKey.value) {
    realtimeManager.offNotification(notificationCallbackKey.value)
  }
})

async function loadDashboardData() {
  try {
    await Promise.all([
      loadStats(),
      loadActivities(),
      loadOrders(),
      loadNotifications()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

async function loadStats() {
  try {
    const [usersResult, transactionsResult] = await Promise.all([
      supabase.from('profiles').select('id, created_at'),
      supabase.from('transactions').select('amount, created_at, status')
    ])

    const users = usersResult.data || []
    const transactions = transactionsResult.data || []

    // Calculate stats
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    const todayUsers = users.filter(u => new Date(u.created_at).toDateString() === today).length
    const yesterdayUsers = users.filter(u => new Date(u.created_at).toDateString() === yesterday).length

    const todayRevenue = transactions
      .filter(t => new Date(t.created_at).toDateString() === today && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const yesterdayRevenue = transactions
      .filter(t => new Date(t.created_at).toDateString() === yesterday && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const pendingOrders = transactions.filter(t => t.status === 'pending').length

    stats.value = {
      totalUsers: users.length,
      userChange: todayUsers - yesterdayUsers,
      todayRevenue,
      revenueChange: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0,
      pendingOrders,
      orderChange: 0, // This would need more complex calculation
      avgProcessingTime: 15, // This would need actual calculation
      timeChange: 0 // This would need actual calculation
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

async function loadActivities() {
  try {
    const { data, error } = await supabase
      .from('admin_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    activities.value = data || []
  } catch (error) {
    console.error('Error loading activities:', error)
  }
}

async function loadOrders() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        product:products(*),
        profiles(*)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    orders.value = data || []
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

async function loadNotifications() {
  try {
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    notifications.value = data || []
  } catch (error) {
    console.error('Error loading notifications:', error)
  }
}

function handleRealtimeUpdate(notification) {
  if (notification.type === 'admin_update') {
    loadDashboardData()
  }
}

function getFilterCount(filterKey) {
  if (filterKey === 'all') return orders.value.length
  return orders.value.filter(order => order.status === filterKey).length
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    // Update local state
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
    }

    // Add activity
    await addActivity(`Order ${orderId.substring(0, 8)} status updated to ${newStatus}`)
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Error updating order status')
  }
}

async function addActivity(message) {
  try {
    const { error } = await supabase
      .from('admin_activities')
      .insert({
        type: 'order_update',
        message,
        created_at: new Date().toISOString()
      })

    if (error) throw error
    await loadActivities()
  } catch (error) {
    console.error('Error adding activity:', error)
  }
}

async function dismissNotification(notificationId) {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ dismissed: true })
      .eq('id', notificationId)

    if (error) throw error

    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  } catch (error) {
    console.error('Error dismissing notification:', error)
  }
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
</script>

<style scoped>
.realtime-admin-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00d9ff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 217, 255, 0.2);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 217, 255, 0.1);
  border-radius: 50%;
}

.stat-content h3 {
  margin: 0 0 4px 0;
  color: #00d9ff;
  font-size: 24px;
  font-weight: bold;
}

.stat-content p {
  margin: 0 0 8px 0;
  color: #aaa;
  font-size: 14px;
}

.stat-change {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
}

.stat-change.positive {
  background: rgba(0, 255, 170, 0.2);
  color: #00ffaa;
}

.stat-change.negative {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.activity-feed, .order-queue, .admin-notifications {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #333;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
}

.activity-feed h3, .order-queue h3, .admin-notifications h3 {
  color: #00d9ff;
  margin-bottom: 16px;
  font-size: 18px;
}

.activity-list, .queue-list, .notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-activity, .no-orders {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.activity-item, .queue-item, .notification-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.activity-item:hover, .queue-item:hover, .notification-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.activity-icon, .notification-icon {
  font-size: 20px;
  margin-right: 12px;
  width: 32px;
  text-align: center;
}

.activity-content, .notification-content {
  flex: 1;
  min-width: 0;
}

.activity-message, .notification-message {
  margin: 0 0 4px 0;
  color: #fff;
  font-size: 14px;
}

.activity-time, .notification-time {
  margin: 0;
  color: #888;
  font-size: 12px;
}

.activity-amount {
  color: #00ffaa;
  font-weight: bold;
  font-size: 16px;
}

.queue-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 12px;
  border: 2px solid #333;
  background: #2a2a4a;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.filter-btn:hover, .filter-btn.active {
  border-color: #00d9ff;
  background: #00d9ff;
  color: #000;
}

.order-info h4 {
  margin: 0 0 4px 0;
  color: #00d9ff;
  font-size: 16px;
}

.order-info p {
  margin: 2px 0;
  color: #aaa;
  font-size: 12px;
}

.order-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.btn-process, .btn-complete, .btn-fail, .btn-dismiss {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-process {
  background: #00d9ff;
  color: #000;
}

.btn-complete {
  background: #00ffaa;
  color: #000;
}

.btn-fail {
  background: #ff6b6b;
  color: #fff;
}

.btn-dismiss {
  background: #666;
  color: #fff;
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-time {
  color: #888;
  font-size: 12px;
  margin-left: 16px;
}

.notification-item.high {
  border-left: 4px solid #ff6b6b;
}

.notification-item.medium {
  border-left: 4px solid #ffa500;
}

.notification-item.low {
  border-left: 4px solid #00d9ff;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .queue-filters {
    flex-direction: column;
  }
  
  .filter-btn {
    width: 100%;
  }
  
  .queue-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-actions {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    justify-content: space-between;
  }
}
</style>