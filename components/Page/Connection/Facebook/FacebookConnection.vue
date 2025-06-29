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
      <Button>
        <i class="icon-delete"></i>
      </Button>
    </div>
  </ConnectionItem>
  <div v-else class="no-connections">
    <p>No connections found</p>
  </div>
</template>

<script setup lang="ts">
import ConnectionItem from '../ConnectionItem.vue'
import UserInfo from '../UserInfo/index.vue'

const connections = ref<FacebookConnection[]>([])

onMounted(async () => {
  const { data } = await $api('/api/facebook/connections', {
    method: 'GET'
  })
  connections.value = data
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
}
</style>
