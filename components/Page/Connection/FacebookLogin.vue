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
    <button
      @click="loginWithFacebook"
      :disabled="!isFbLoaded || isLoading"
      class="fb-login-btn"
    >
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
  </div>
</template>

<script setup lang="ts">
interface FacebookUser {
  id: string
  name: string
  email?: string
  picture?: {
    data: {
      url: string
    }
  }
}

interface FacebookLoginResponse {
  authResponse: {
    accessToken: string
    userID: string
  } | null
  status: string
}

const isFbLoaded = ref(false)
const isLoading = ref(false)
const user = ref<FacebookUser | null>(null)

const appId = ref<string>('')
const configId = ref<string>('')

onMounted(() => {
  const {
    public: { facebookAppId, facebookConfigId }
  } = useRuntimeConfig()
  appId.value = facebookAppId as string
  configId.value = facebookConfigId as string

  initializeFacebookSDK()
})

const initializeFacebookSDK = () => {
  // Wait for Facebook SDK to load
  const checkFB = () => {
    if (typeof window !== 'undefined' && window.FB) {
      window.FB.init({
        appId: appId.value,
        cookie: true,
        xfbml: true,
        version: 'v23.0'
      })

      isFbLoaded.value = true

      // Check if user is already logged in
      window.FB.getLoginStatus((response: FacebookLoginResponse) => {
        if (response.status === 'connected') {
          getUserInfo()
        }
      })
    } else {
      setTimeout(checkFB, 100)
    }
  }
  checkFB()
}

const loginWithFacebook = () => {
  if (!isFbLoaded.value) return

  isLoading.value = true

  window.FB.login(
    (response: FacebookLoginResponse) => {
      if (response.authResponse) {
        console.log('User logged in:', response)
        getUserInfo()
      } else {
        console.log('User cancelled login or did not fully authorize.')
        isLoading.value = false
      }
    },
    {
      scope: 'email,public_profile',
      config_id: configId.value
    }
  )
}

const getUserInfo = () => {
  window.FB.api(
    '/me',
    { fields: 'name,email,picture' },
    (response: FacebookUser) => {
      user.value = response
      isLoading.value = false
      console.log('User info:', response)
    }
  )
}

const logout = () => {
  window.FB.logout(() => {
    user.value = null
    console.log('User logged out.')
  })
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
