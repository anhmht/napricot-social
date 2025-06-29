<template>
  <div class="user-info-card">
    <div class="user-avatar">
      <img v-if="image" :src="image" :alt="title" />
    </div>
    <div class="user-details">
      <h3 class="user-name">{{ title }}</h3>
      <p class="user-id">ID: {{ id }}</p>
      <p v-if="description" class="user-owner">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image?: string
  title: string
  id: string
  description?: string
}

defineProps<Props>()
</script>

<style scoped>
.user-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  max-width: 400px;
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.user-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.platform-icon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1877f2;
}

.platform-icon img {
  width: 16px;
  height: 16px;
  border: none;
  color: white;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.user-id {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 2px 0;
  font-family: monospace;
}

.user-owner {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
</style>
