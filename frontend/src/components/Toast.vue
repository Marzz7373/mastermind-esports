<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`, { 'toast-visible': toast.visible }]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else-if="toast.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(26, 26, 46, 0.98);
  backdrop-filter: blur(10px);
  border: 2px solid;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  pointer-events: all;
  transform: translateX(400px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-visible {
  transform: translateX(0);
  opacity: 1;
}

.toast-success {
  border-color: #00ffaa;
}

.toast-error {
  border-color: #ff6b6b;
}

.toast-warning {
  border-color: #ffa500;
}

.toast-info {
  border-color: #00d9ff;
}

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: #00ffaa;
  color: #000;
}

.toast-error .toast-icon {
  background: #ff6b6b;
  color: #fff;
}

.toast-warning .toast-icon {
  background: #ffa500;
  color: #000;
}

.toast-info .toast-icon {
  background: #00d9ff;
  color: #000;
}

.toast-message {
  flex: 1;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #fff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>
