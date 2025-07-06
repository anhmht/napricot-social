<template>
  <div class="connection-item">
    <div class="connection-info">
      <div class="connection-icon" :class="iconClass">
        <img :src="iconSrc" :alt="iconAlt" width="24" height="24" />
      </div>
      <div class="connection-details">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  iconSrc: string
  iconAlt: string
  iconClass: string
  title: string
}

defineProps<Props>()
</script>

<style lang="postcss">
.connection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  min-height: 72px;
}

.connection-item:last-child {
  border-bottom: none;
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.connection-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.connection-icon.facebook {
  background-color: #1877f2;
}

.connection-icon.youtube {
  background-color: #ff0000;
}

.connection-icon.threads {
  background-color: #000000;
}

.connection-icon.x-connection {
  background-color: #000000;
}

.connection-icon img {
  filter: brightness(0) invert(1);
}

.connection-details {
  flex: 1;
  display: flex;
  align-items: center;
}

.connection-details h3 {
  font-size: 1.6rem;
  color: #333;
  font-weight: normal;
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

.connection-expired {
  text-decoration: line-through;
  opacity: 0.6;
  color: #9ca3af;
}

.connection-expired * {
  text-decoration: line-through;
}

@media (max-width: 768px) {
  .connection-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .connection-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
