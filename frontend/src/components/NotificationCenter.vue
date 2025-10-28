<template>
  <div class="notification-center">
    <!-- Notification Bell Icon -->
    <div class="notification-bell" @click="toggleNotifications" :class="{ 'has-unread': unreadCount > 0 }">
      <span class="bell-icon">🔔</span>
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
    </div>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown" @click.stop>
      <div class="notifications-header">
        <h3>Notifications</h3>
        <button @click="markAllAsRead" v-if="unreadCount > 0" class="mark-all-read">
          Mark all as read
        </button>
      </div>

      <div class="notifications-list">
        <div v-if="notifications.length === 0" class="no-notifications">
          No notifications yet
        </div>
        
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-icon">
            <span v-if="notification.type === 'order_completed'">✅</span>
            <span v-else-if="notification.type === 'wallet_update'">💰</span>
            <span v-else-if="notification.type === 'system'">📢</span>
            <span v-else>🔔</span>
          </div>
          
          <div class="notification-content">
            <p class="notification-message">{{ notification.message }}</p>
            <p class="notification-time">{{ formatTime(notification.created_at) }}</p>
          </div>
          
          <div v-if="!notification.read" class="unread-indicator"></div>
        </div>
      </div>

      <div class="notifications-footer">
        <button @click="loadMoreNotifications" :disabled="loading" class="load-more">
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Overlay to close notifications -->
    <div v-if="showNotifications" class="notifications-overlay" @click="showNotifications = false"></div>
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

const showNotifications = ref(false)
const notifications = ref([])
const loading = ref(false)
const notificationCallbackKey = ref(null)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

onMounted(async () => {
  await loadNotifications()
  
  // Set up real-time notifications
  notificationCallbackKey.value = realtimeManager.onNotification('user', handleRealtimeNotification)
  
  // Request notification permission
  await realtimeManager.requestNotificationPermission()
})

onUnmounted(() => {
  if (notificationCallbackKey.value) {
    realtimeManager.offNotification(notificationCallbackKey.value)
  }
})

async function loadNotifications() {
  loading.value = true
  try {
    const data = await realtimeManager.getUserNotifications(props.userId)
    notifications.value = data
  } catch (error) {
    console.error('Error loading notifications:', error)
  } finally {
    loading.value = false
  }
}

async function loadMoreNotifications() {
  // Implement pagination if needed
  await loadNotifications()
}

function handleRealtimeNotification(notification) {
  // Add new notification to the list
  notifications.value.unshift({
    id: `realtime_${Date.now()}`,
    user_id: props.userId,
    message: notification.data.message || 'New update available',
    type: notification.type,
    read: false,
    created_at: new Date().toISOString()
  })
  
  // Keep only the latest 50 notifications
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(0, 50)
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    loadNotifications()
  }
}

async function handleNotificationClick(notification) {
  if (!notification.read) {
    await markNotificationAsRead(notification.id)
  }
  
  // Handle navigation based on notification type
  if (notification.type === 'order_completed') {
    // Navigate to order history or account page
    window.location.href = '/account.html'
  } else if (notification.type === 'wallet_update') {
    // Navigate to wallet page
    window.location.href = '/wallet.html'
  }
}

async function markNotificationAsRead(notificationId) {
  try {
    await realtimeManager.markNotificationAsRead(notificationId)
    
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

async function markAllAsRead() {
  try {
    const unreadNotifications = notifications.value.filter(n => !n.read)
    
    for (const notification of unreadNotifications) {
      await realtimeManager.markNotificationAsRead(notification.id)
      notification.read = true
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
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
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return time.toLocaleDateString()
}
</script>

<style scoped>
.notification-center {
  position: relative;
  display: inline-block;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.notification-bell:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.notification-bell.has-unread {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.bell-icon {
  font-size: 18px;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid #1a1a2e;
}

.notifications-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 350px;
  max-height: 400px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00d9ff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #333;
  background: rgba(0, 217, 255, 0.1);
}

.notifications-header h3 {
  margin: 0;
  color: #00d9ff;
  font-size: 16px;
}

.mark-all-read {
  background: none;
  border: 1px solid #00d9ff;
  color: #00d9ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mark-all-read:hover {
  background: #00d9ff;
  color: #1a1a2e;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.notification-item:hover {
  background: rgba(0, 217, 255, 0.1);
}

.notification-item.unread {
  background: rgba(0, 255, 170, 0.05);
  border-left: 3px solid #00ffaa;
}

.notification-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  margin: 0 0 4px 0;
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
}

.notification-time {
  margin: 0;
  color: #888;
  font-size: 12px;
}

.unread-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 8px;
  height: 8px;
  background: #00ffaa;
  border-radius: 50%;
}

.notifications-footer {
  padding: 12px 16px;
  border-top: 1px solid #333;
  text-align: center;
}

.load-more {
  background: none;
  border: 1px solid #666;
  color: #666;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.load-more:hover:not(:disabled) {
  border-color: #00d9ff;
  color: #00d9ff;
}

.load-more:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .notifications-dropdown {
    width: 300px;
    right: -50px;
  }
  
  .notification-bell {
    width: 36px;
    height: 36px;
  }
  
  .bell-icon {
    font-size: 16px;
  }
}
</style>