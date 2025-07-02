<template>
  <div class="switch-container">
    <label :for="switchId" class="switch-label">
      <input
        :id="switchId"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        class="switch-input"
        @change="handleChange"
      />
      <span class="switch-toggle">
        <span class="switch-slider"></span>
      </span>
      <span v-if="label" class="switch-text">{{ label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  label: '',
  id: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean, event: Event]
}>()

// Generate unique ID if not provided
const switchId = computed(() => {
  return props.id || `switch-${Math.random().toString(36).substr(2, 9)}`
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.checked
  emit('update:modelValue', value)
  emit('change', value, event)
}
</script>

<style scoped>
.switch-container {
  display: inline-block;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  cursor: pointer;
  user-select: none;
}

.switch-label:has(.switch-input:disabled) {
  cursor: not-allowed;
  opacity: 0.7;
}

.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-toggle {
  position: relative;
  width: 4.4rem;
  height: 2.4rem;
  background: var(--color-grayscale-40);
  border-radius: 1.2rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.switch-slider {
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  width: 2rem;
  height: 2rem;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-text {
  color: var(--color-text);
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Checked state */
.switch-input:checked + .switch-toggle {
  background: var(--color-primary);
}

.switch-input:checked + .switch-toggle .switch-slider {
  transform: translateX(2rem);
}

/* Focus state */
.switch-input:focus + .switch-toggle {
  outline: 2px solid rgba(236, 88, 37, 0.2);
  outline-offset: 2px;
}

/* Hover state */
.switch-label:hover:not(:has(.switch-input:disabled)) .switch-toggle {
  opacity: 0.9;
}

.switch-label:hover:not(:has(.switch-input:disabled)) .switch-slider {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Active state */
.switch-input:active + .switch-toggle .switch-slider {
  transform: scale(0.95);
}

.switch-input:checked:active + .switch-toggle .switch-slider {
  transform: translateX(2rem) scale(0.95);
}

/* Disabled state */
.switch-input:disabled + .switch-toggle {
  background: var(--color-bg-disabled);
  cursor: not-allowed;
}

.switch-input:disabled + .switch-toggle .switch-slider {
  box-shadow: none;
}

.switch-input:checked:disabled + .switch-toggle {
  background: var(--color-grayscale-50);
}

/* Responsive */
@media (max-width: 768px) {
  .switch-toggle {
    width: 4rem;
    height: 2.2rem;
  }

  .switch-slider {
    width: 1.8rem;
    height: 1.8rem;
  }

  .switch-input:checked + .switch-toggle .switch-slider {
    transform: translateX(1.8rem);
  }

  .switch-input:checked:active + .switch-toggle .switch-slider {
    transform: translateX(1.8rem) scale(0.95);
  }

  .switch-text {
    font-size: 1.3rem;
  }
}
</style>
