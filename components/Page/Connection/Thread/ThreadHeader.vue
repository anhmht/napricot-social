<template>
  <div class="thread-login">
    <h2>Threads</h2>
    <div>
      <Button
        class="thread-add-button"
        variant="primary"
        @click="emit('login')"
        :loading="loading"
        :disabled="loading"
      >
        <i class="icon-add"></i> Add
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  login: []
}>()
</script>

<style lang="postcss" scoped>
.thread-login {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
.thread-add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
