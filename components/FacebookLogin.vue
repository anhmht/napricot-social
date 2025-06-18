<template>
  <div class="facebook-login">
    <button
      @click="loginWithFacebook"
      :disabled="!isFbLoaded || isLoading"
      class="fb-login-btn"
    >
      <svg
        v-if="!isLoading"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
      <div v-else class="loading-spinner"></div>
      {{ isLoading ? 'Logging in...' : 'Login with Facebook' }}
    </button>

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

const {
  app: { facebookAppId, facebookConfigId }
} = useRuntimeConfig()

onMounted(() => {
  initializeFacebookSDK()
  console.log(useRuntimeConfig())
  console.log('facebookAppId', facebookAppId)
  console.log('facebookConfigId', facebookConfigId)
})

const initializeFacebookSDK = () => {
  // Wait for Facebook SDK to load
  const checkFB = () => {
    if (typeof window !== 'undefined' && window.FB) {
      window.FB.init({
        appId: facebookAppId,
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
      config_id: facebookConfigId
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
  flex-direction: column;
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
}

.fb-login-btn:hover:not(:disabled) {
  background-color: #166fe5;
}

.fb-login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
