<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'btn',
      `btn--${variant}`,
      {
        'btn--loading': loading,
        'btn--full-width': fullWidth
      }
    ]"
    @click="handleClick"
  >
    <span v-if="loading">{{ loadingText }}</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'default'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  type: 'button',
  disabled: false,
  loading: false,
  loadingText: 'Loading...',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  padding: 1.2rem 2.4rem;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'SVN-Circular', sans-serif;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  outline: none;
}

.btn:focus {
  outline: 2px solid rgba(236, 88, 37, 0.2);
  outline-offset: 2px;
}

.btn--loading {
  cursor: not-allowed;
}

.btn--full-width {
  width: 100%;
}

/* Default variant */
.btn--default {
  color: var(--color-text);
  border: 1px solid var(--color-grayscale-40);
  background: white;
}

.btn--default:hover:not(:disabled):not(.btn--loading) {
  opacity: 0.6;
}

.btn--default:disabled,
.btn--default.btn--loading {
  cursor: not-allowed;
  background: var(--color-grayscale-40);
  color: var(--color-text);
  opacity: 0.7;
}

/* Primary variant */
.btn--primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.btn--primary:hover:not(:disabled):not(.btn--loading) {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(236, 88, 37, 0.3);
}

.btn--primary:active:not(:disabled):not(.btn--loading) {
  transform: translateY(0);
}

.btn--primary:disabled,
.btn--primary.btn--loading {
  background: var(--color-grayscale-40);
  color: #fff;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 768px) {
  .btn {
    padding: 1rem 2rem;
    font-size: 1.4rem;
  }
}
</style>
