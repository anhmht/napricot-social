<template>
  <div class="form-group">
    <label v-if="label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="{ error: hasError }"
      @input="handleInput"
      @blur="handleBlur"
    />
    <div v-if="errorMessage" class="field-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errorMessage?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  errorMessage: '',
  id: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  input: [event: Event]
}>()

// Generate unique ID if not provided
const inputId = computed(() => {
  return props.id || `input-${Math.random().toString(36).substr(2, 9)}`
})

const hasError = computed(() => {
  return !!props.errorMessage
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-group label {
  color: var(--color-text);
  font-weight: 500;
  font-size: 1.4rem;
}

.form-group input {
  padding: 1.2rem 1.6rem;
  border: 1px solid var(--color-grayscale-40);
  border-radius: 8px;
  font-size: 1.6rem;
  transition: all 0.2s ease;
  background: white;
  color: var(--color-text);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(236, 88, 37, 0.1);
}

.form-group input:disabled {
  background: var(--color-bg-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group input.error {
  border-color: var(--color-error);
}

.form-group input.error:focus {
  box-shadow: 0 0 0 3px rgba(244, 0, 59, 0.1);
}

.field-error {
  color: var(--color-error);
  font-size: 1.3rem;
  font-weight: 400;
}

/* Responsive */
@media (max-width: 768px) {
  .form-group input {
    padding: 1rem 1.4rem;
  }
}
</style>
