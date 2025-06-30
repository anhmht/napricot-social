<template>
  <div class="facebook-login">
    <h2>Facebook</h2>
    <div>
      <Button
        class="facebook-add-button"
        variant="primary"
        @click="login"
        :disabled="isLoading"
      >
        <i class="icon-add"></i> Add
      </Button>
    </div>
    <FacebookConfigModal
      v-model="isModalOpen"
      :data="formData"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/Button.vue'
import FacebookConfigModal from './FacebookConfigModal.vue'

const isLoading = ref(false)
const isModalOpen = ref(false)

// Form data
const formData = reactive<FacebookFormData>({
  appId: '',
  configId: '',
  pages: [],
  selectedPageId: '',
  pageName: '',
  userId: '',
  username: '',
  userAccessToken: '',
  pageAccessToken: '',
  userPicture: ''
})

const isFbLoaded = ref(false)

onMounted(() => {
  const {
    public: { facebookAppId, facebookConfigId }
  } = useRuntimeConfig()
  formData.appId = facebookAppId
  formData.configId = facebookConfigId
  initializeFacebookSDK()
})

const initializeFacebookSDK = () => {
  // Wait for Facebook SDK to load
  if (typeof window !== 'undefined' && window.FB) {
    window.FB.init({
      appId: formData.appId,
      cookie: true,
      xfbml: true,
      version: 'v23.0'
    })
    isFbLoaded.value = true
  }
}

const login = () => {
  isLoading.value = true
  window.FB.login(
    (response: FacebookLoginResponse) => {
      if (response.authResponse) {
        getUserInfo(response)
      } else {
        console.log('User cancelled login or did not fully authorize.')
        isLoading.value = false
      }
    },
    {
      scope: 'email,public_profile',
      config_id: formData.configId
    }
  )
}

const getUserInfo = (authResponse: FacebookLoginResponse) => {
  window.FB.api(
    '/me',
    { fields: 'name,picture' },
    async (response: FacebookUser) => {
      isLoading.value = true
      const pages = await $api('/api/facebook/pages', {
        method: 'POST',
        body: {
          accessToken: authResponse.authResponse?.accessToken,
          userId: response.id
        }
      })
      formData.userId = response.id
      formData.pages = pages.data.map((page: any) => ({
        id: page.id,
        name: page.name,
        accessToken: page.access_token
      }))
      formData.username = response.name
      formData.userAccessToken = authResponse.authResponse?.accessToken || ''
      formData.userPicture = response.picture?.data?.url || ''

      isModalOpen.value = true
      isLoading.value = false
    }
  )
}

const logout = () => {
  window.FB.logout(() => {
    console.log('User logged out.')
  })
}

const emit = defineEmits<{
  'connection-added': [data: FacebookPage]
}>()

const handleSubmit = (data: FacebookPage) => {
  // Emit event to parent component
  emit('connection-added', data)
}

// Declare FB as a global
declare global {
  interface Window {
    FB: any
  }
}
</script>

<style lang="postcss" scoped>
.facebook-login {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
.facebook-add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
