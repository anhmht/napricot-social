<template>
  <Modal v-model="isVisible" title="Pinterest Configuration">
    <template #content>
      <form @submit.prevent="handleSubmit" class="config-form">
        <SelectField
          v-if="props.boards.length > 0"
          v-model="formData.boardId"
          label="Select Pinterest Board"
          placeholder="Choose a Pinterest board..."
          :options="boardOptions"
          :disabled="isLoading"
          :error-message="validationErrors.boardId"
          @blur="validateSelectedBoardField"
          @change="validationErrors.boardId && validateSelectedBoardField()"
        />

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        variant="default"
        type="button"
        :disabled="isLoading"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        type="submit"
        :disabled="isLoading || isSaveButtonDisabled"
        :loading="isLoading"
        loading-text="Saving..."
        @click="handleSubmit"
      >
        Save
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  boards: {
    type: Object as PropType<PinterestBoard[]>,
    required: true
  },
  credential: {
    type: Object as PropType<PinterestCredential>,
    default: () => undefined
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: PinterestBoard]
  cancel: []
}>()

// Form data
const formData = reactive({
  boardId: ''
})

// Loading and error states
const isLoading = ref(false)
const errorMessage = ref('')

// Validation errors
const validationErrors = reactive({
  boardId: ''
})

// Computed
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isSaveButtonDisabled = computed(() => {
  return !formData.boardId.trim()
})

const boardOptions = computed(() => {
  return props.boards.map((board) => ({
    label: board.name,
    value: board.id
  }))
})

const validateForm = () => {
  return !validationErrors.boardId
}

const validateSelectedBoardField = () => {
  validationErrors.boardId =
    props.boards.length > 0 && !formData.boardId
      ? 'Please select a Pinterest board'
      : ''
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  const data = props.boards.find(
    (board) => board.id === formData.boardId
  ) as PinterestBoard

  try {
    const { response } = await $api('/api/pinterest/config', {
      method: 'POST',
      body: {
        accessToken: props.credential?.accessToken,
        refreshToken: props.credential?.refreshToken,
        expiredDate: props.credential?.expiredDate,
        boardId: formData.boardId,
        boardName: data.name,
        boardAvatar: data.image,
        boardDescription: data.description
      }
    })
    emit('submit', response)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to save configuration'
  } finally {
    isLoading.value = false
    isVisible.value = false
  }
}

// Handle cancel
const handleCancel = () => {
  emit('cancel')
  isVisible.value = false
}

// Reset form when modal closes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // Reset form to initial values when opening
      formData.boardId = ''
      errorMessage.value = ''
      isLoading.value = false
    }
  }
)
</script>

<style scoped>
.config-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.error-message {
  background: rgba(244, 0, 59, 0.1);
  color: var(--color-error);
  padding: 1.2rem 1.6rem;
  border-radius: 8px;
  font-size: 1.4rem;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .config-form {
    gap: 1.5rem;
  }
}
</style>
