<template>
  <div class="youtube-login">
    <div v-if="user" class="user-info">
      <img :src="user.picture" :alt="user.name" class="user-avatar" />
      <div>
        <p>Welcome, {{ user.name }}!</p>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    <button
      @click="loginWithGoogle"
      :disabled="!isGoogleLoaded || isLoading"
      class="youtube-login-btn"
    >
      <img
        v-if="!isLoading"
        src="/icons/youtube.svg"
        alt="YouTube"
        width="20"
        height="20"
        class="login-icon"
      />
      <div v-else class="loading-spinner"></div>
      {{ isLoading ? 'Logging in...' : 'Login with YouTube' }}
    </button>
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
const refreshToken = ref<string | null>(null)
const tokenClient = ref<any>(null)
const clientId = ref<string>('')

onMounted(() => {
  const {
    public: { googleClientId }
  } = useRuntimeConfig()
  clientId.value = googleClientId as string

  initializeGoogleSDK()
})

const initializeGoogleSDK = () => {
  const checkGoogle = () => {
    if (typeof window !== 'undefined' && window.google) {
      try {
        // Initialize OAuth2 code client using new Google Identity Services with ux_mode popup
        tokenClient.value = window.google.accounts.oauth2.initCodeClient({
          client_id: clientId.value,
          scope:
            'profile email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
          ux_mode: 'popup',
          redirect_uri: window.location.origin,
          callback: handleCodeResponse,
          error_callback: (error: any) => {
            console.error('Google OAuth error:', error)
            isLoading.value = false
          }
        })

        isGoogleLoaded.value = true
        console.log('Google Identity Services initialized with code flow')
      } catch (error) {
        console.error('Error initializing Google SDK:', error)
        setTimeout(checkGoogle, 1000)
      }
    } else {
      setTimeout(checkGoogle, 100)
    }
  }
  checkGoogle()
}

const loginWithGoogle = () => {
  if (!isGoogleLoaded.value || !tokenClient.value) return

  isLoading.value = true

  try {
    // Request authorization code using new GIS library with error handling
    tokenClient.value.requestCode()
  } catch (error) {
    console.error('Error requesting authorization code:', error)
    isLoading.value = false
  }
}

const handleCodeResponse = async (response: any) => {
  if (response.code) {
    console.log('Authorization code received:', response.code)

    // Exchange authorization code for tokens
    await exchangeCodeForTokens(response.code)
  } else {
    console.error('No authorization code received')
    isLoading.value = false
  }
}

const exchangeCodeForTokens = async (code: string) => {
  try {
    // Send authorization code to backend for token exchange
    const response = await $api('/api/youtube/exchange-token', {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: window.location.origin
      }
    })

    if (response && response.data) {
      accessToken.value = response.data.access_token

      // Store refresh token if provided by backend
      if (response.data.refresh_token) {
        refreshToken.value = response.data.refresh_token
        console.log('Refresh token received from backend')
      }

      console.log('YouTube login successful, tokens received from backend')

      // Fetch user info using the access token
      await fetchUserInfo(response.data.access_token)
    } else {
      throw new Error('No access token received from backend')
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
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
  refreshToken.value = null
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
  width: 155px;
}

.youtube-login-btn:hover:not(:disabled) {
  background-color: #cc0000;
}

.youtube-login-btn:disabled {
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
