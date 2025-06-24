<template>
  <NuxtLink v-if="to" :to="to" class="nav-item" :class="{ active: isActive }">
    <div class="nav-icon">
      <img :src="`/icons/${icon}.svg`" :alt="text" class="nav-icon-img" />
    </div>
    <span class="nav-text">{{ text }}</span>
  </NuxtLink>

  <div
    v-else
    class="nav-item nav-parent"
    :class="{ active: isActive, expanded: isExpanded }"
    @click="$emit('click')"
  >
    <div class="nav-icon">
      <img :src="`/icons/${icon}.svg`" :alt="text" class="nav-icon-img" />
    </div>
    <span class="nav-text">{{ text }}</span>
    <div v-if="hasArrow" class="nav-arrow">
      <img src="/icons/arrow.svg" alt="Arrow" class="arrow-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  to?: string
  icon: string
  text: string
  hasArrow?: boolean
  isExpanded?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const isActive = computed(() => {
  return props.to ? useRoute().path === props.to : false
})
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  text-decoration: none;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  flex-shrink: 0;
}

.nav-icon-img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.nav-text {
  font-size: 1.6rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  text-decoration: none;
}

.sidebar:hover .nav-text {
  opacity: 1;
  transform: translateX(0);
}

.nav-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  margin-left: auto;
}

.arrow-img {
  width: 12px;
  height: 12px;
  filter: brightness(0) invert(1);
}

.sidebar:hover .nav-arrow {
  opacity: 1;
  transform: translateX(0) rotate(0deg);
}

.nav-parent.expanded .nav-arrow {
  transform: translateX(0) rotate(90deg);
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .nav-text {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-item {
    padding: 1rem 1.5rem;
  }

  .nav-arrow {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
