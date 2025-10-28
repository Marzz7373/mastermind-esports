<template>
  <div class="loading-spinner" :class="{ 'fullscreen': fullscreen }">
    <div class="spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-logo">⚡</div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  fullscreen: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.loading-spinner.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 20, 0.95);
  backdrop-filter: blur(5px);
  z-index: 9999;
}

.spinner {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #00d9ff;
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  border-top-color: #00ffaa;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  border-top-color: #ffd700;
  animation-delay: -0.15s;
}

.spinner-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  animation: pulse 2s ease-in-out infinite;
}

.loading-message {
  color: #00d9ff;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  animation: fadeInOut 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
