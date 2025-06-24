<template>
  <Connection />
</template>

<script setup lang="ts">
import Connection from '~/components/Page/Connection/Connection.vue'
definePageMeta({
  middleware: 'auth'
})
</script>

<style lang="postcss">
.connections-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.connections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.connections-header h1 {
  font-weight: 600;
  color: #333;
  margin: 0;
}

.connections-list {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.connection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  min-height: 72px;
}

.connection-item:last-child {
  border-bottom: none;
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.connection-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.connection-icon.facebook {
  background-color: #1877f2;
}

.connection-icon.youtube {
  background-color: #ff0000;
}

.connection-icon.threads {
  background-color: #000000;
}

.connection-icon img {
  filter: brightness(0) invert(1);
}

.connection-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.connection-details h3 {
  font-size: 1.6rem;
  color: #333;
  font-weight: normal;
}

@media (max-width: 768px) {
  .connections-container {
    padding: 1rem;
  }

  .connections-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .search-input {
    width: 100%;
  }

  .connection-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .connection-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
