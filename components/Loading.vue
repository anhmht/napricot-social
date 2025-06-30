<template>
  <div v-if="loading" class="loading-overlay">
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 4rem;
  height: 4rem;
  border: 3px solid var(--color-grayscale-40);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .spinner {
    width: 3rem;
    height: 3rem;
    border-width: 2px;
  }
}
</style>
