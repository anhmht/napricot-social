<template>
  <ThreadHeader @connection-added="handleThreadsConnectionAdded" />
  <div class="connections-list">
    <ThreadConnection ref="threadsConnectionRef" />
  </div>
</template>

<script setup lang="ts">
import ThreadHeader from './ThreadHeader.vue'
import ThreadConnection from './ThreadConnection.vue'

const threadsConnectionRef = ref<InstanceType<typeof ThreadConnection> | null>(
  null
)

const handleThreadsConnectionAdded = () => {
  threadsConnectionRef.value?.refreshConnections()
}
</script>
