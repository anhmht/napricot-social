<template>
  <YoutubeHeader v-model:loading="isLoading" @login="login" />
  <div class="connections-list">
    <YoutubeConnection
      :connections="connections"
      v-model:loading="isLoading"
      @refresh="fetchConnections"
      @refresh-token="refreshToken"
    />
  </div>
</template>

<script setup lang="ts">
import YoutubeHeader from './YoutubeHeader.vue'
import YoutubeConnection from './YoutubeConnection.vue'

const connections = ref<YoutubeConnection[]>([])
const clientId = ref<string>('')
const tokenClient = ref<any>(null)
const isGoogleLoaded = ref(false)
const isLoading = ref(false)
const refreshId = ref<string | null>(null)

const fetchConnections = async () => {
  isLoading.value = true
  try {
    const { data } = await $api('/api/youtube/connections', {
      method: 'GET'
    })
    connections.value = data
  } finally {
    isLoading.value = false
  }
}

const initializeGoogleSDK = (refresh = false) => {
  if (typeof window !== 'undefined' && window.google) {
    try {
      // Initialize OAuth2 code client using new Google Identity Services with ux_mode popup
      tokenClient.value = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId.value,
        scope:
          'profile email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
        ux_mode: 'popup',
        redirect_uri: window.location.origin,
        callback: (response: any) => handleCodeResponse(response, refresh),
        error_callback: (error: any) => {
          console.error('Google OAuth error:', error)
          // Clear any existing timeout
          if (tokenClient.value?._timeoutId) {
            clearTimeout(tokenClient.value._timeoutId)
            tokenClient.value._timeoutId = null
          }
          isLoading.value = false
        }
      })
      isGoogleLoaded.value = true
      if (refresh) {
        login()
      }
    } catch (error) {
      isLoading.value = false
      console.error('Error initializing Google SDK:', error)
      isGoogleLoaded.value = false
    }
  }
}

const handleCodeResponse = async (response: any, refresh = false) => {
  // Clear any existing timeout
  if (tokenClient.value?._timeoutId) {
    clearTimeout(tokenClient.value._timeoutId)
    tokenClient.value._timeoutId = null
  }

  if (response.code) {
    // Exchange authorization code for tokens
    if (refresh) {
      await refreshYoutubeConnection(response.code)
    } else {
      await exchangeCodeForTokens(response.code)
    }
  } else {
    console.error('No authorization code received')
    isLoading.value = false
  }
}

const exchangeCodeForTokens = async (code: string) => {
  try {
    // Send authorization code to backend for token exchange
    await $api('/api/youtube/exchange-token', {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: window.location.origin
      }
    })
    isLoading.value = false
    fetchConnections()
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    isLoading.value = false
  }
}

const login = () => {
  if (!isGoogleLoaded.value || !tokenClient.value) return

  isLoading.value = true

  try {
    // Set a timeout to reset loading state if no response within 60 seconds
    const timeoutId = setTimeout(() => {
      isLoading.value = false
      console.log('OAuth timeout - popup may have been closed')
    }, 300000) // 5 minutes

    // Store timeout ID for cleanup
    tokenClient.value._timeoutId = timeoutId

    // Add window focus detection to handle popup close
    const handleWindowFocus = () => {
      // Small delay to allow callback to potentially fire first
      setTimeout(() => {
        if (isLoading.value) {
          isLoading.value = false
          console.log('Popup appears to have been closed by user')
        }
        clearTimeout(timeoutId)
        window.removeEventListener('focus', handleWindowFocus)
      }, 500)
    }

    // Listen for window focus (indicates popup was closed)
    setTimeout(() => {
      window.addEventListener('focus', handleWindowFocus)
    }, 1000) // Delay to avoid immediate trigger

    // Request authorization code using new GIS library with error handling
    tokenClient.value.requestCode()
  } catch (error) {
    console.error('Error requesting authorization code:', error)
    isLoading.value = false
  }
}

const refreshToken = async (userId: string) => {
  refreshId.value = userId
  initializeGoogleSDK(true)
}

const refreshYoutubeConnection = async (code: string) => {
  isLoading.value = true
  try {
    await $api(`/api/youtube/connections/${refreshId.value}/refresh`, {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: window.location.origin
      }
    })
    refreshId.value = null
    fetchConnections()
  } catch (error) {
    console.error('Error refreshing token:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const {
    public: { googleClientId }
  } = useRuntimeConfig()
  clientId.value = googleClientId as string

  initializeGoogleSDK()
  fetchConnections()
})

// Declare Google as global
declare global {
  interface Window {
    google: any
  }
}
</script>
