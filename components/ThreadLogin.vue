<template>
  <div class="threads-login">
    <button
      @click="loginWithThreads"
      :disabled="isLoading"
      class="threads-login-btn"
    >
      <img
        v-if="!isLoading"
        src="/icons/threads.svg"
        alt="Threads"
        width="20"
        height="20"
        class="login-icon"
      />
      <div v-else class="loading-spinner"></div>
      {{ isLoading ? 'Logging in...' : 'Login with Threads' }}
    </button>

    <div v-if="user" class="user-info">
      <img
        :src="user.threads_profile_picture_url"
        :alt="user.username"
        class="user-avatar"
      />
      <div>
        <p>Welcome, {{ user.username }}!</p>
        <p class="user-id">User ID: {{ user.id }}</p>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ThreadsUser {
  id: string
  username: string
  threads_profile_picture_url: string
}

interface ThreadsTokenResponse {
  access_token: string
  user_id: string
}

const isLoading = ref(false)
const user = ref<ThreadsUser | null>(null)
const accessToken = ref<string | null>(null)
const appId = ref<string>('')

onMounted(() => {
  const {
    public: { threadsAppId }
  } = useRuntimeConfig()
  appId.value = threadsAppId as string

  // Check if we're returning from authorization
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const error = urlParams.get('error')

  if (code) {
    handleAuthorizationCode(code)
  } else if (error) {
    console.error('Threads authorization error:', error)
  }
})

const loginWithThreads = () => {
  if (!appId.value) {
    console.error('Threads App ID not configured')
    return
  }

  isLoading.value = true

  // Construct the authorization URL
  const redirectUri = `${window.location.origin}${window.location.pathname}`
  const scope = 'threads_basic,threads_content_publish'
  const state = Math.random().toString(36).substring(2, 15) // Generate random state for CSRF protection

  const authUrl = new URL('https://threads.net/oauth/authorize')
  authUrl.searchParams.set('client_id', appId.value)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('state', state)

  // Store state for verification
  sessionStorage.setItem('threads_oauth_state', state)

  // Redirect to Threads authorization
  window.location.href = authUrl.toString()
}

const handleAuthorizationCode = async (code: string) => {
  try {
    // Verify state parameter (CSRF protection)
    const urlParams = new URLSearchParams(window.location.search)
    const returnedState = urlParams.get('state')
    const storedState = sessionStorage.getItem('threads_oauth_state')

    if (returnedState !== storedState) {
      throw new Error('Invalid state parameter')
    }

    // Exchange authorization code for access token via external API server
    await exchangeCodeForTokens(code)

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)

    // Clean up session storage
    sessionStorage.removeItem('threads_oauth_state')
  } catch (error) {
    console.error('Error handling authorization code:', error)
    isLoading.value = false
  }
}

const exchangeCodeForTokens = async (code: string) => {
  try {
    // Send authorization code to backend for token exchange
    const response = await $api('/api/threads/exchange-token', {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: `${window.location.origin}${window.location.pathname}`
      }
    })

    if (response && response.data) {
      accessToken.value = response.data.access_token

      console.log('Threads login successful, tokens received from backend')

      // Fetch user info using the access token and user info
      await fetchUserInfo(response.data.access_token, response.data.user_info)
    } else {
      throw new Error('No access token received from backend')
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    isLoading.value = false
  }
}

const fetchUserInfo = async (token: string, userInfo: any) => {
  try {
    // Use the user info from the API response
    user.value = {
      id: userInfo.id,
      username: userInfo.username,
      threads_profile_picture_url: userInfo.threads_profile_picture_url
    }

    console.log('Threads login successful:', user.value)
  } catch (error) {
    console.error('Error fetching user info:', error)
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  user.value = null
  accessToken.value = null
  console.log('Threads user logged out.')
}
</script>

<style lang="postcss" scoped>
.threads-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.threads-login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #000000;
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

.threads-login-btn:hover:not(:disabled) {
  background-color: #333333;
}

.threads-login-btn:disabled {
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

.user-id {
  font-size: 0.875rem;
  color: #666;
  margin: 0.25rem 0;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
