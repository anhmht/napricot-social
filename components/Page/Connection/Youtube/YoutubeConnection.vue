<template>
  <ConnectionItem
    v-if="connections.length > 0"
    icon-src="/icons/youtube.svg"
    icon-alt="Youtube"
    icon-class="youtube"
    title="Youtube Connect"
    v-for="connection in connections"
    :key="connection.userId"
    :class="{
      'connection-expired': isConnectionExpired(connection.expiredDate)
    }"
  >
    <UserInfo
      :image="connection.avatar"
      :title="connection.username"
      :id="connection.userId"
      :description="connection.email"
    />

    <div class="connection-info">
      <span class="connection-info-label">Expired Date:</span>
      {{ formatDate(connection.expiredDate) }}
    </div>

    <div class="connection-actions">
      <Switch
        v-model="connection.isActive"
        :disabled="loading || isConnectionExpired(connection.expiredDate)"
        label="Active"
        @change="toggleConnection(connection.userId, connection.isActive)"
      />
      <Button
        :disabled="loading"
        @click="emit('refresh-token', connection.userId)"
      >
        <i class="icon-refresh"></i>
      </Button>
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
  (e: 'refresh-token', userId: string): void
  (e: 'update:loading', loading: boolean): void
}>()

defineProps<{
  connections: YoutubeConnection[]
  loading: boolean
}>()

const deleteConnection = async (userId: string) => {
  try {
    emit('update:loading', true)
    await $api(`/api/youtube/connections/${userId}`, {
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
    await $api(`/api/youtube/connections/${userId}`, {
      method: 'PUT',
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

const isConnectionExpired = (expiredDate: string | Date): boolean => {
  const now = new Date()
  const expiration = new Date(expiredDate)
  return now >= expiration
}
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

.connection-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: #6b7280;
  font-size: 14px;
  font-weight: normal;
  font-family: monospace;
  &-label {
    color: var(--color-text);
  }
}

.connection-info-label {
  font-weight: 600;
}

.connection-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.connection-expired {
  text-decoration: line-through;
  opacity: 0.6;
  color: #9ca3af;
}

.connection-expired * {
  text-decoration: line-through;
}
</style>
