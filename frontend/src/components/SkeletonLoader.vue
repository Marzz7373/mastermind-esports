<template>
  <div class="skeleton-loader" :class="type">
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'card', // card, text, circle, button
    validator: (value) => ['card', 'text', 'circle', 'button', 'title'].includes(value)
  }
})
</script>

<style scoped>
.skeleton-loader {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #2a2a4a 0%, #3a3a5a 50%, #2a2a4a 100%);
  border-radius: 8px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

.skeleton-loader.card {
  width: 100%;
  height: 200px;
  border-radius: 12px;
}

.skeleton-loader.text {
  width: 100%;
  height: 16px;
  border-radius: 4px;
}

.skeleton-loader.title {
  width: 60%;
  height: 24px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.skeleton-loader.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.skeleton-loader.button {
  width: 120px;
  height: 40px;
  border-radius: 8px;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
