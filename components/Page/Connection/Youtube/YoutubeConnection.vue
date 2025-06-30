<template>
  <ConnectionItem
    v-if="connections.length > 0"
    icon-src="/icons/youtube.svg"
    icon-alt="Youtube"
    icon-class="youtube"
    title="Youtube Connect"
    v-for="connection in connections"
    :key="connection.userId"
  >
    <UserInfo
      :image="connection.avatar"
      :title="connection.username"
      :id="connection.userId"
      :description="connection.email"
    />

    <div class="connection-actions">
      <Switch
        v-model="connection.isActive"
        :disabled="isLoading"
        label="Active"
        @change="toggleConnection(connection.userId, connection.isActive)"
      />
      <Button
        :disabled="isLoading || connection.isActive"
        @click="deleteConnection(connection.userId)"
      >
        <i class="icon-delete"></i>
      </Button>
    </div>
  </ConnectionItem>
  <div v-else class="no-connections">
    <p>No connections found</p>
  </div>
  <Loading :loading="isLoading" />
</template>

<script setup lang="ts">
import ConnectionItem from '../ConnectionItem.vue'
import UserInfo from '../UserInfo/index.vue'
import Loading from '~/components/Loading.vue'

const connections = ref<YoutubeConnection[]>([])
const isLoading = ref(false)

const fetchConnections = async () => {
  isLoading.value = true
  try {
    const { data } = await $api('/api/youtube/connections', {
      method: 'GET'
    })
    connections.value = data
  } finally {
    isLoading.value = false
  }
}

const refreshConnections = () => {
  fetchConnections()
}

const deleteConnection = async (userId: string) => {
  try {
    isLoading.value = true
    await $api(`/api/youtube/connections/${userId}`, {
      method: 'DELETE'
    })
    await fetchConnections()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const toggleConnection = async (userId: string, isActive: boolean) => {
  try {
    isLoading.value = true
    await $api(`/api/youtube/connections/${userId}`, {
      method: 'PUT',
      body: {
        active: isActive
      }
    })
    await fetchConnections()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Expose the refresh method to parent component
defineExpose({
  refreshConnections
})

onMounted(() => {
  fetchConnections()
})
</script>

<style lang="postcss" scoped>
.facebook-connection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-connections {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  font-weight: 600;
  color: #6c757d;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.connection-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
