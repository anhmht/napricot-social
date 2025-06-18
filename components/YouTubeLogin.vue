<template>
  <div class="youtube-login">
    <button
      @click="loginWithGoogle"
      :disabled="!isGoogleLoaded || isLoading"
      class="youtube-login-btn"
    >
      <svg
        v-if="!isLoading"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        />
      </svg>
      <div v-else class="loading-spinner"></div>
      {{ isLoading ? 'Logging in...' : 'Login with YouTube' }}
    </button>

    <div v-if="user" class="user-info">
      <img :src="user.picture" :alt="user.name" class="user-avatar" />
      <div>
        <p>Welcome, {{ user.name }}!</p>
        <p class="user-email">{{ user.email }}</p>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GoogleUser {
  id: string
  name: string
  email: string
  picture: string
  given_name?: string
  family_name?: string
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

const isGoogleLoaded = ref(false)
const isLoading = ref(false)
const user = ref<GoogleUser | null>(null)
const accessToken = ref<string | null>(null)
const tokenClient = ref<any>(null)

const {
  public: { googleClientId }
} = useRuntimeConfig()

onMounted(() => {
  initializeGoogleSDK()
})

const initializeGoogleSDK = () => {
  const checkGoogle = () => {
    if (typeof window !== 'undefined' && window.google) {
      // Initialize OAuth2 token client using new Google Identity Services
      tokenClient.value = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope:
          'profile email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
        callback: handleTokenResponse
      })

      isGoogleLoaded.value = true
      console.log('Google Identity Services initialized')
    } else {
      setTimeout(checkGoogle, 100)
    }
  }
  checkGoogle()
}

const loginWithGoogle = () => {
  if (!isGoogleLoaded.value || !tokenClient.value) return

  isLoading.value = true

  // Request access token using new GIS library
  tokenClient.value.requestAccessToken({
    prompt: 'consent'
  })
}

const handleTokenResponse = async (response: TokenResponse) => {
  if (response.access_token) {
    accessToken.value = response.access_token
    console.log('Access token received:', response.access_token)

    // Fetch user info using the access token
    await fetchUserInfo(response.access_token)
  } else {
    console.error('No access token received')
    isLoading.value = false
  }
}

const fetchUserInfo = async (token: string) => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.ok) {
      const userData = await response.json()
      user.value = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        given_name: userData.given_name,
        family_name: userData.family_name
      }

      console.log('YouTube login successful:', user.value)
      console.log('User has YouTube access with token:', token)
    } else {
      throw new Error('Failed to fetch user info')
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  if (accessToken.value) {
    // Revoke the access token using new GIS library
    window.google.accounts.oauth2.revoke(accessToken.value, () => {
      console.log('Access token revoked')
    })
  }

  user.value = null
  accessToken.value = null
  console.log('User signed out from YouTube.')
}

// Declare Google as global
declare global {
  interface Window {
    google: any
  }
}
</script>

<style lang="postcss" scoped>
.youtube-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.youtube-login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.youtube-login-btn:hover:not(:disabled) {
  background-color: #cc0000;
}

.youtube-login-btn:disabled {
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

.user-email {
  font-size: 0.875rem;
  color: #666;
  margin: 0.25rem 0 0.5rem 0;
}

.logout-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #5a6268;
}
</style>
