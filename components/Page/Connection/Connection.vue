<template>
  <div class="connections-container">
    <div class="connections-header">
      <h1>Connections</h1>
    </div>
    <FacebookHeader />
    <div class="connections-list">
      <FacebookConnection />
    </div>
    <h2>YouTube</h2>
    <div class="connections-list">
      <ConnectionItem
        icon-src="/icons/youtube.svg"
        icon-alt="YouTube"
        icon-class="youtube"
        title="YouTube Connect"
      >
        <YouTubeLogin />
      </ConnectionItem>
    </div>
    <h2>Threads</h2>
    <div class="connections-list">
      <ConnectionItem
        icon-src="/icons/threads.svg"
        icon-alt="Threads"
        icon-class="threads"
        title="Threads Connect"
      >
        <ThreadLogin />
      </ConnectionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import ConnectionItem from '~/components/Page/Connection/ConnectionItem.vue'
import FacebookHeader from '~/components/Page/Connection/Facebook/FacebookHeader.vue'
import YouTubeLogin from '~/components/Page/Connection/YouTubeLogin.vue'
import ThreadLogin from '~/components/Page/Connection/ThreadLogin.vue'
import FacebookConnection from '~/components/Page/Connection/Facebook/FacebookConnection.vue'
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
