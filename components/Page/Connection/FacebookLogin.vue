<template>
  <div class="facebook-login">
    <div v-if="user" class="user-info">
      <img
        :src="user.picture?.data?.url"
        :alt="user.name"
        class="user-avatar"
      />
      <div>
        <p>Welcome, {{ user.name }}!</p>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    <button @click="login" :disabled="isLoading" class="fb-login-btn">
      <img
        v-if="!isLoading"
        src="/icons/facebook.svg"
        alt="Facebook"
        width="20"
        height="20"
        class="login-icon"
      />
      <div v-else class="loading-spinner"></div>
      {{ isLoading ? 'Logging in...' : 'Login with Facebook' }}
    </button>
    <FacebookConfigModal
      v-model="isModalOpen"
      :data="formData"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import FacebookConfigModal from './FacebookConfigModal.vue'

const isLoading = ref(false)
const isModalOpen = ref(false)
const user = ref<FacebookUser | null>(null)

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

const handleSubmit = (data: FacebookPage) => {}

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
}

.fb-login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 155px;
}

.fb-login-btn:hover:not(:disabled) {
  background-color: #166fe5;
}

.fb-login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-icon {
  filter: brightness(0) invert(1); /* Makes the icon white */
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.logout-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #5a6268;
}
</style>
