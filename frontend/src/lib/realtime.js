import { supabase } from './supabase'

class RealtimeManager {
  constructor() {
    this.subscriptions = new Map()
    this.notificationCallbacks = new Map()
    this.isConnected = false
  }

  // Initialize real-time connection
  async initialize() {
    try {
      // Listen for transaction updates
      this.subscribeToTransactions()
      
      // Listen for wallet balance updates
      this.subscribeToWalletUpdates()
      
      // Listen for order status changes
      this.subscribeToOrderUpdates()
      
      this.isConnected = true
      console.log('Real-time connection established')
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error)
    }
  }

  // Subscribe to transaction updates
  subscribeToTransactions() {
    const subscription = supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          this.handleTransactionUpdate(payload)
        }
      )
      .subscribe()

    this.subscriptions.set('transactions', subscription)
  }

  // Subscribe to wallet balance updates
  subscribeToWalletUpdates() {
    const subscription = supabase
      .channel('wallet_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'wallet_balance=neq.0'
        },
        (payload) => {
          this.handleWalletUpdate(payload)
        }
      )
      .subscribe()

    this.subscriptions.set('wallet_updates', subscription)
  }

  // Subscribe to order status changes
  subscribeToOrderUpdates() {
    const subscription = supabase
      .channel('order_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transactions',
          filter: 'status=eq.completed'
        },
        (payload) => {
          this.handleOrderCompletion(payload)
        }
      )
      .subscribe()

    this.subscriptions.set('order_updates', subscription)
  }

  // Handle transaction updates
  handleTransactionUpdate(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload
    
    // Notify all registered callbacks
    this.notificationCallbacks.forEach((callback, key) => {
      if (key.startsWith('transaction_')) {
        callback({
          type: 'transaction_update',
          event: eventType,
          data: newRecord,
          oldData: oldRecord
        })
      }
    })

    // Show browser notification for important updates
    if (eventType === 'INSERT' && newRecord.type === 'purchase') {
      this.showBrowserNotification(
        'New Order Received',
        `Order #${newRecord.id.substring(0, 8)} for RM${newRecord.amount}`,
        '/admin-dashboard.html'
      )
    }
  }

  // Handle wallet balance updates
  handleWalletUpdate(payload) {
    const { new: newRecord, old: oldRecord } = payload
    
    // Notify wallet update callbacks
    this.notificationCallbacks.forEach((callback, key) => {
      if (key.startsWith('wallet_')) {
        callback({
          type: 'wallet_update',
          data: newRecord,
          oldBalance: oldRecord.wallet_balance,
          newBalance: newRecord.wallet_balance
        })
      }
    })

    // Show balance update notification
    const balanceChange = newRecord.wallet_balance - oldRecord.wallet_balance
    if (balanceChange !== 0) {
      this.showBrowserNotification(
        'Wallet Updated',
        `Balance ${balanceChange > 0 ? 'increased' : 'decreased'} by RM${Math.abs(balanceChange).toFixed(2)}`,
        '/wallet.html'
      )
    }
  }

  // Handle order completion
  handleOrderCompletion(payload) {
    const { new: newRecord } = payload
    
    // Notify order completion callbacks
    this.notificationCallbacks.forEach((callback, key) => {
      if (key.startsWith('order_')) {
        callback({
          type: 'order_completed',
          data: newRecord
        })
      }
    })

    // Show order completion notification
    this.showBrowserNotification(
      'Order Completed! 🎉',
      `Your ${newRecord.type} order has been completed and delivered`,
      '/account.html'
    )
  }

  // Register notification callback
  onNotification(type, callback) {
    const key = `${type}_${Date.now()}`
    this.notificationCallbacks.set(key, callback)
    return key
  }

  // Remove notification callback
  offNotification(key) {
    this.notificationCallbacks.delete(key)
  }

  // Show browser notification
  showBrowserNotification(title, body, url = null) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'mastermind-esports'
        })

        if (url) {
          notification.onclick = () => {
            window.focus()
            window.location.href = url
            notification.close()
          }
        }

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000)
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.showBrowserNotification(title, body, url)
          }
        })
      }
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Send real-time message to specific user
  async sendMessageToUser(userId, message) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          message,
          type: 'system',
          read: false
        })

      if (error) throw error
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Get user notifications
  async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Cleanup subscriptions
  cleanup() {
    this.subscriptions.forEach((subscription, key) => {
      supabase.removeChannel(subscription)
    })
    this.subscriptions.clear()
    this.notificationCallbacks.clear()
    this.isConnected = false
  }
}

// Create singleton instance
export const realtimeManager = new RealtimeManager()

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  realtimeManager.initialize()
}