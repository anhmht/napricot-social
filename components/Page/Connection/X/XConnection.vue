<template>
  <ConnectionItem
    v-if="connections.length > 0"
    icon-src="/icons/x.svg"
    icon-alt="X"
    icon-class="x-connection"
    title="X Connect"
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
        :disabled="loading"
        label="Active"
        @change="toggleConnection(connection.userId, connection.isActive)"
      />
      <Button
        :disabled="loading || connection.isActive"
        @click="deleteConnection(connection.userId)"
      >
        <i class="icon-delete"></i>
      </Button>
    </div>
  </ConnectionItem>
  <div v-else class="no-connections">
    <p>No connections found</p>
  </div>
  <Loading :loading="loading" />
</template>

<script setup lang="ts">
import ConnectionItem from '../ConnectionItem.vue'
import UserInfo from '../UserInfo/index.vue'
import Loading from '~/components/Loading.vue'

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'update:loading', loading: boolean): void
}>()

defineProps<{
  connections: XConnection[]
  loading: boolean
}>()

const deleteConnection = async (userId: string) => {
  try {
    emit('update:loading', true)
    await $api(`/api/x/connections/${userId}`, {
      method: 'DELETE'
    })
    emit('refresh')
  } catch (error) {
    console.error(error)
  } finally {
    emit('update:loading', false)
  }
}

const toggleConnection = async (userId: string, isActive: boolean) => {
  try {
    emit('update:loading', true)
    await $api(`/api/x/connections/${userId}/active`, {
      method: 'POST',
      body: {
        active: isActive
      }
    })
    emit('refresh')
  } catch (error) {
    console.error(error)
  } finally {
    emit('update:loading', false)
  }
}
</script>

<style lang="postcss" scoped>
.x-connection {
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
