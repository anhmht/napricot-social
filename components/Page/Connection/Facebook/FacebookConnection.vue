<template>
  <ConnectionItem
    v-if="connections.length > 0"
    icon-src="/icons/facebook.svg"
    icon-alt="Facebook"
    icon-class="facebook"
    title="Facebook Connect"
    v-for="connection in connections"
    :key="connection.facebookId"
  >
    <UserInfo
      :image="connection.avatar"
      :title="connection.facebookUsername"
      :id="connection.facebookId"
      :description="connection.facebookEmail"
    />
    <UserInfo
      :image="connection.pageAvatar"
      :title="connection.pageName"
      :id="connection.pageId"
      :description="connection.pageCategory"
    />
    <div class="connection-actions">
      <Switch
        v-model="connection.isActive"
        :disabled="isLoading"
        label="Active"
        @change="
          toggleConnection(
            connection.facebookId,
            connection.pageId,
            connection.isActive
          )
        "
      />
      <Button
        @click="deleteConnection(connection.facebookId, connection.pageId)"
        :disabled="isLoading || connection.isActive"
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

const connections = ref<FacebookConnection[]>([])
const isLoading = ref(false)

const fetchConnections = async () => {
  isLoading.value = true
  try {
    const { data } = await $api('/api/facebook/connections', {
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

const deleteConnection = async (facebookId: string, pageId: string) => {
  try {
    isLoading.value = true
    await $api(`/api/facebook/remove-connection/${facebookId}/${pageId}`, {
      method: 'DELETE'
    })
    await fetchConnections()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const toggleConnection = async (
  facebookId: string,
  pageId: string,
  isActive: boolean
) => {
  try {
    isLoading.value = true
    await $api(`/api/facebook/active-connection/${facebookId}/${pageId}`, {
      method: 'POST',
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

<style lang="postcss">
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
  background-color: #f8f9fa;
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
