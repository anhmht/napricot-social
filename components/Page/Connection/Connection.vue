<template>
  <div class="connections-container">
    <div class="connections-header">
      <h1>Connections</h1>
    </div>
    <FacebookHeader @connection-added="handleFacebookConnectionAdded" />
    <div class="connections-list">
      <FacebookConnection ref="facebookConnectionRef" />
    </div>
    <YoutubeHeader @connection-added="handleYoutubeConnectionAdded" />
    <div class="connections-list">
      <YoutubeConnection ref="youtubeConnectionRef" />
    </div>
    <ThreadHeader @connection-added="handleThreadsConnectionAdded" />
    <div class="connections-list">
      <ThreadConnection ref="threadsConnectionRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FacebookHeader from '~/components/Page/Connection/Facebook/FacebookHeader.vue'
import ThreadHeader from '~/components/Page/Connection/Thread/ThreadHeader.vue'
import FacebookConnection from '~/components/Page/Connection/Facebook/FacebookConnection.vue'
import YoutubeHeader from '~/components/Page/Connection/Youtube/YoutubeHeader.vue'
import YoutubeConnection from '~/components/Page/Connection/Youtube/YoutubeConnection.vue'
import ThreadConnection from '~/components/Page/Connection/Thread/ThreadConnection.vue'

// Template ref for FacebookConnection component
const facebookConnectionRef = ref<InstanceType<
  typeof FacebookConnection
> | null>(null)

const youtubeConnectionRef = ref<InstanceType<typeof YoutubeConnection> | null>(
  null
)

const threadsConnectionRef = ref<InstanceType<typeof ThreadConnection> | null>(
  null
)

// Handle connection added event from FacebookHeader
const handleFacebookConnectionAdded = () => {
  // Trigger refresh in FacebookConnection
  if (facebookConnectionRef.value) {
    facebookConnectionRef.value.refreshConnections()
  }
}

const handleYoutubeConnectionAdded = () => {
  if (youtubeConnectionRef.value) {
    youtubeConnectionRef.value.refreshConnections()
  }
}

const handleThreadsConnectionAdded = () => {
  if (threadsConnectionRef.value) {
    threadsConnectionRef.value.refreshConnections()
  }
}
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
