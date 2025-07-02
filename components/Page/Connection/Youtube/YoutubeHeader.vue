<template>
  <div class="youtube-login">
    <h2>Youtube</h2>
    <div>
      <Button
        class="youtube-add-button"
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
  'update:loading': [Boolean]
}>()
</script>

<style lang="postcss" scoped>
.youtube-login {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
.youtube-add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
