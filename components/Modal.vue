<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="modelValue" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button
              class="modal-close"
              @click="closeModal"
              aria-label="Close modal"
            >
              <img src="/icons/close.svg" alt="Close" width="24" height="24" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="modal-content">
            <slot name="content"></slot>
            <slot></slot>
          </div>

          <!-- Modal Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const closeModal = () => {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false)
  }
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

// Add/remove event listeners
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }
)

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--color-line);
  background: var(--color-primary);
}

.modal-title {
  color: #fff;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin: -0.5rem -0.5rem -0.5rem 0;
  img {
    filter: brightness(0) invert(1);
  }
}

.modal-close:active {
  transform: scale(0.95);
}

.modal-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  color: var(--color-text);
  line-height: 1.6;
}

.modal-footer {
  padding: 1rem 2rem 2rem 2rem;
  border-top: 1px solid var(--color-line);
  background: var(--color-grayscale-25);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Transitions */
.modal-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: scale(0.98) translateY(-5px);
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-container {
    max-width: 100%;
    margin: 0;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .modal-title {
    font-size: 1.8rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    flex-direction: column-reverse;
  }

  .modal-footer > * {
    width: 100%;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
  }
}
</style>
