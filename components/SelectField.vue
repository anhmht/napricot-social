<template>
  <div class="form-group">
    <label v-if="label" :for="selectId">{{ label }}</label>
    <div class="select-wrapper" ref="selectWrapper">
      <div
        :id="selectId"
        class="select-trigger"
        :class="{
          error: hasError,
          disabled: disabled,
          open: isOpen,
          'has-value': hasValue
        }"
        @click="toggleDropdown"
        @keydown="handleKeydown"
        tabindex="0"
        role="combobox"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
      >
        <span class="select-value">
          {{ displayValue || placeholder }}
        </span>
        <div class="select-arrow" :class="{ open: isOpen }">
          <img src="/icons/arrow.svg" alt="Select arrow" />
        </div>
      </div>

      <!-- Custom dropdown options -->
      <Teleport to="body">
        <div
          v-if="isOpen"
          class="select-dropdown"
          :style="dropdownStyle"
          ref="dropdown"
        >
          <div class="select-options">
            <div
              v-for="(option, index) in options"
              :key="getOptionValue(option)"
              class="select-option"
              :class="{
                selected: getOptionValue(option) === modelValue,
                disabled: getOptionDisabled(option),
                highlighted: highlightedIndex === index
              }"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
              role="option"
              :aria-selected="getOptionValue(option) === modelValue"
            >
              {{ getOptionLabel(option) }}
            </div>
          </div>
        </div>
      </Teleport>
    </div>
    <div v-if="errorMessage" class="field-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  options: (Option | string | number)[]
  required?: boolean
  disabled?: boolean
  errorMessage?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option...',
  required: false,
  disabled: false,
  errorMessage: '',
  id: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  change: [event: Event]
}>()

// Refs
const selectWrapper = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()

// State
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const dropdownStyle = ref({})

// Generate unique ID if not provided
const selectId = computed(() => {
  return props.id || `select-${Math.random().toString(36).substr(2, 9)}`
})

const hasError = computed(() => {
  return !!props.errorMessage
})

const hasValue = computed(() => {
  return (
    props.modelValue !== '' &&
    props.modelValue !== null &&
    props.modelValue !== undefined
  )
})

const displayValue = computed(() => {
  if (!hasValue.value) return ''

  const selectedOption = props.options.find(
    (option) => getOptionValue(option) === props.modelValue
  )

  return selectedOption
    ? getOptionLabel(selectedOption)
    : String(props.modelValue)
})

// Helper functions to handle different option formats
const getOptionValue = (option: Option | string | number): string | number => {
  if (typeof option === 'object' && option !== null) {
    return option.value
  }
  return option
}

const getOptionLabel = (option: Option | string | number): string => {
  if (typeof option === 'object' && option !== null) {
    return option.label
  }
  return String(option)
}

const getOptionDisabled = (option: Option | string | number): boolean => {
  if (typeof option === 'object' && option !== null) {
    return option.disabled || false
  }
  return false
}

// Dropdown positioning
const updateDropdownPosition = () => {
  if (!selectWrapper.value) return

  const rect = selectWrapper.value.getBoundingClientRect()
  const dropdownHeight = Math.min(props.options.length * 48 + 16, 240) // Max height with padding
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  const shouldOpenUpward =
    spaceBelow < dropdownHeight && spaceAbove > dropdownHeight

  dropdownStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: '1000',
    ...(shouldOpenUpward
      ? { bottom: `${window.innerHeight - rect.top}px` }
      : { top: `${rect.bottom}px` })
  }
}

// Dropdown interactions
const toggleDropdown = () => {
  if (props.disabled) return

  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const openDropdown = () => {
  isOpen.value = true
  highlightedIndex.value = props.options.findIndex(
    (option) => getOptionValue(option) === props.modelValue
  )
  nextTick(() => {
    updateDropdownPosition()
  })
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const selectOption = (option: Option | string | number) => {
  if (getOptionDisabled(option)) return

  const value = getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', new Event('change'))
  closeDropdown()
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value && highlightedIndex.value >= 0) {
        selectOption(props.options[highlightedIndex.value])
      } else {
        toggleDropdown()
      }
      break

    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        closeDropdown()
      }
      break

    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      } else {
        highlightedIndex.value = Math.min(
          highlightedIndex.value + 1,
          props.options.length - 1
        )
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      }
      break
  }
}

// Click outside to close
const handleClickOutside = (event: Event) => {
  if (
    !selectWrapper.value?.contains(event.target as Node) &&
    !dropdown.value?.contains(event.target as Node)
  ) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition)
})
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

.select-wrapper {
  position: relative;
}

.select-trigger {
  width: 100%;
  padding: 1.2rem 4rem 1.2rem 1.6rem;
  border: 1px solid var(--color-grayscale-40);
  border-radius: 8px;
  font-size: 1.6rem;
  transition: all 0.2s ease;
  background: white;
  color: var(--color-text);
  cursor: pointer;
  font-family: 'SVN-Circular', sans-serif;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2rem;
  box-sizing: border-box;
}

.select-trigger:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(236, 88, 37, 0.1);
}

.select-trigger:hover:not(.disabled) {
  border-color: var(--color-grayscale-50);
}

.select-trigger.disabled {
  background: var(--color-bg-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}

.select-trigger.error {
  border-color: var(--color-error);
}

.select-trigger.error:focus {
  box-shadow: 0 0 0 3px rgba(244, 0, 59, 0.1);
}

.select-trigger.open {
  border-color: var(--color-primary);
}

.select-value {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-trigger:not(.has-value) .select-value {
  color: var(--color-grayscale-60);
}

.select-arrow {
  position: absolute;
  right: 1.6rem;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  pointer-events: none;
  transition: transform 0.2s ease;
}

.select-arrow.open {
  transform: translateY(-50%) rotate(-90deg);
}

.select-arrow img {
  width: 12px;
  height: 12px;
  filter: brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%)
    hue-rotate(173deg) brightness(95%) contrast(89%);
}

.select-trigger:focus .select-arrow img,
.select-trigger.open .select-arrow img {
  filter: brightness(0) saturate(100%) invert(46%) sepia(54%) saturate(3028%)
    hue-rotate(16deg) brightness(95%) contrast(97%);
}

.select-trigger.disabled .select-arrow {
  opacity: 0.5;
}

/* Dropdown Styles */
.select-dropdown {
  background: white;
  border: 1px solid var(--color-grayscale-40);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: dropdown-enter 0.15s ease-out;
}

@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.select-options {
  max-height: 240px;
  overflow-y: auto;
  padding: 0.8rem 0;
}

.select-option {
  padding: 1.2rem 1.6rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--color-text);
  font-size: 1.6rem;
  font-family: 'SVN-Circular', sans-serif;
  font-weight: 400;
  display: flex;
  align-items: center;
  position: relative;
}

.select-option:hover,
.select-option.highlighted {
  background: var(--color-grayscale-25);
}

.select-option.selected {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
}

.select-option.selected::after {
  content: '✓';
  position: absolute;
  right: 1.6rem;
  font-weight: bold;
}

.select-option.disabled {
  color: var(--color-grayscale-60);
  cursor: not-allowed;
  opacity: 0.5;
}

.select-option.disabled:hover {
  background: transparent;
}

.field-error {
  color: var(--color-error);
  font-size: 1.3rem;
  font-weight: 400;
}

/* Custom scrollbar for dropdown */
.select-options::-webkit-scrollbar {
  width: 6px;
}

.select-options::-webkit-scrollbar-track {
  background: var(--color-grayscale-25);
  border-radius: 3px;
}

.select-options::-webkit-scrollbar-thumb {
  background: var(--color-grayscale-50);
  border-radius: 3px;
}

.select-options::-webkit-scrollbar-thumb:hover {
  background: var(--color-grayscale-60);
}

/* Responsive */
@media (max-width: 768px) {
  .select-trigger {
    padding: 1rem 3.5rem 1rem 1.4rem;
  }

  .select-arrow {
    right: 1.4rem;
  }

  .select-option {
    padding: 1rem 1.4rem;
  }
}
</style>
