<template>
  <div class="connections-container">
    <div class="connections-header">
      <h1>Connections</h1>
    </div>
    <Facebook />
    <Youtube />
    <Thread />
  </div>
</template>

<script setup lang="ts">
import Facebook from './Facebook/Facebook.vue'
import Youtube from './Youtube/Youtube.vue'
import Thread from './Thread/Thread.vue'
</script>

<style lang="postcss">
.connections-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
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
  position: relative;
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
}
</style>
