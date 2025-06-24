<template>
  <NuxtLink v-if="to" :to="to" class="nav-item nav-sub">
    <span class="nav-text">{{ text }}</span>
  </NuxtLink>

  <div v-else class="nav-item nav-sub" @click="$emit('click')">
    <span class="nav-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  to?: string
  text: string
}>()

defineEmits(['click'])

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

.nav-sub {
  padding-left: 3rem !important;
  font-size: 1.4rem !important;
  margin: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.nav-text {
  font-size: 1.4rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  text-decoration: none;
}

.sidebar:hover .nav-text {
  opacity: 1;
  transform: translateX(0);
}

.sidebar:hover .nav-sub {
  padding-left: 3rem !important;
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
}
</style>
