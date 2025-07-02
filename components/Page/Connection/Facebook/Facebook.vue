<template>
  <FacebookHeader @connection-added="handleFacebookConnectionAdded" />
  <div class="connections-list">
    <FacebookConnection ref="facebookConnectionRef" />
  </div>
</template>

<script setup lang="ts">
import FacebookConnection from './FacebookConnection.vue'
import FacebookHeader from './FacebookHeader.vue'

const facebookConnectionRef = ref<InstanceType<typeof FacebookConnection>>()

const handleFacebookConnectionAdded = () => {
  facebookConnectionRef.value?.refreshConnections()
}
</script>
