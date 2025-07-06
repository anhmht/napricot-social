<template>
  <div class="x-login">
    <h2>X</h2>
    <div>
      <Button
        class="x-add-button"
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
.x-login {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
.x-add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
