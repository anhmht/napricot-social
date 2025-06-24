<template>
  <div class="nav-group">
    <SidebarItem
      :icon="icon"
      :text="text"
      :has-arrow="true"
      :is-expanded="expanded"
      @click="toggle"
    />

    <!-- Sub Navigation -->
    <div class="sub-nav" :class="{ expanded: expanded }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  text: string
  defaultExpanded?: boolean
}>()

const expanded = ref(props.defaultExpanded || false)

const toggle = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.nav-group {
  width: 100%;
}

.sub-nav {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
}

.sub-nav.expanded {
  max-height: 200px;
}
</style>
