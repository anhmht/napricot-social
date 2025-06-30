<template>
  <Modal v-model="isVisible" title="Facebook Configuration">
    <template #content>
      <form @submit.prevent="handleSubmit" class="config-form">
        <SelectField
          v-if="props.data.pages.length > 0"
          v-model="formData.pageId"
          label="Select Facebook Page"
          placeholder="Choose a Facebook page..."
          :options="pageOptions"
          :disabled="isLoading"
          :error-message="validationErrors.pageId"
          @blur="validateSelectedPageField"
          @change="validationErrors.pageId && validateSelectedPageField()"
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
  data: {
    type: Object as PropType<FacebookFormData>,
    required: true
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: FacebookPage]
  cancel: []
}>()

// Form data
const formData = reactive({
  pageId: ''
})

// Loading and error states
const isLoading = ref(false)
const errorMessage = ref('')

// Validation errors
const validationErrors = reactive({
  pageId: ''
})

// Computed
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isSaveButtonDisabled = computed(() => {
  return !formData.pageId.trim()
})

const pageOptions = computed(() => {
  return props.data.pages.map((page) => ({
    label: page.name,
    value: page.id
  }))
})

const validateForm = () => {
  return !validationErrors.pageId
}

const validateSelectedPageField = () => {
  validationErrors.pageId =
    props.data.pages.length > 0 && !formData.pageId
      ? 'Please select a Facebook page'
      : ''
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  const data = props.data.pages.find(
    (page) => page.id === formData.pageId
  ) as FacebookPage

  try {
    const { response } = await $api('/api/facebook/config', {
      method: 'POST',
      body: {
        pageId: formData.pageId,
        pageName: data.name,
        pageAccessToken: data.accessToken,
        accessToken: props.data.userAccessToken,
        userId: props.data.userId,
        username: props.data.username
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
      formData.pageId = ''
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
