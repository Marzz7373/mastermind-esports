<template>
  <div class="order-tracking-page">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <h1 class="logo">📦 Order Tracking</h1>
          <div class="nav-buttons">
            <router-link to="/" class="btn-secondary">← Back to Home</router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="order-search">
        <h2>Track Your Order</h2>
        <div class="search-form">
          <input 
            v-model="orderId" 
            type="text" 
            placeholder="Enter Order ID"
            @keyup.enter="trackOrder"
          >
          <button @click="trackOrder" :disabled="!orderId || loading" class="btn-primary">
            {{ loading ? 'Tracking...' : 'Track Order' }}
          </button>
        </div>
      </div>

      <div v-if="currentOrder" class="order-details">
        <OrderStatusTracker :order-id="currentOrder.id" />
      </div>

      <div v-else-if="!loading && orderId" class="no-order">
        <h3>Order Not Found</h3>
        <p>We couldn't find an order with ID: {{ orderId }}</p>
        <p>Please check your order ID and try again.</p>
      </div>

      <div v-if="!currentOrder && !orderId" class="welcome-message">
        <h3>Welcome to Order Tracking</h3>
        <p>Enter your order ID above to track your order status in real-time.</p>
        <div class="features">
          <div class="feature">
            <span class="feature-icon">⚡</span>
            <h4>Real-time Updates</h4>
            <p>Get instant notifications when your order status changes</p>
          </div>
          <div class="feature">
            <span class="feature-icon">📱</span>
            <h4>Mobile Friendly</h4>
            <p>Track your orders on any device, anywhere</p>
          </div>
          <div class="feature">
            <span class="feature-icon">🔔</span>
            <h4>Smart Notifications</h4>
            <p>Receive browser notifications for important updates</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import OrderStatusTracker from '../components/OrderStatusTracker.vue'
import { supabase } from '../lib/supabase'

const route = useRoute()
const orderId = ref('')
const currentOrder = ref(null)
const loading = ref(false)

onMounted(() => {
  // Check if order ID is provided in URL parameters
  if (route.query.id) {
    orderId.value = route.query.id
    trackOrder()
  }
})

async function trackOrder() {
  if (!orderId.value) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        product:products(*)
      `)
      .eq('id', orderId.value)
      .single()

    if (error) throw error
    
    currentOrder.value = data
  } catch (error) {
    console.error('Error tracking order:', error)
    currentOrder.value = null
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.order-tracking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  color: #fff;
}

.navbar {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo {
  margin: 0;
  color: #00d9ff;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #333;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #555;
  transform: translateY(-2px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.order-search {
  text-align: center;
  margin-bottom: 3rem;
}

.order-search h2 {
  color: #00d9ff;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.search-form {
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.search-form input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #333;
  border-radius: 8px;
  background: #1a1a2e;
  color: #fff;
  font-size: 1rem;
}

.search-form input:focus {
  outline: none;
  border-color: #00d9ff;
}

.btn-primary {
  padding: 1rem 2rem;
  background: #00d9ff;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) {
  background: #00b8e6;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.no-order {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #ff6b6b;
  border-radius: 16px;
}

.no-order h3 {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.no-order p {
  color: #aaa;
  margin-bottom: 0.5rem;
}

.welcome-message {
  text-align: center;
  padding: 3rem 1rem;
}

.welcome-message h3 {
  color: #00d9ff;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-message p {
  color: #aaa;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #333;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature:hover {
  transform: translateY(-4px);
  border-color: #00d9ff;
  box-shadow: 0 8px 32px rgba(0, 217, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.feature h4 {
  color: #00d9ff;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.feature p {
  color: #aaa;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  
  .btn-primary {
    width: 100%;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>