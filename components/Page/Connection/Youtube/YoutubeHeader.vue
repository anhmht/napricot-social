<template>
  <div class="youtube-login">
    <h2>Youtube</h2>
    <div>
      <Button
        class="youtube-add-button"
        variant="primary"
        @click="login"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <i class="icon-add"></i> Add
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const clientId = ref<string>('')
const isLoading = ref(false)

const tokenClient = ref<any>(null)
const isGoogleLoaded = ref(false)

const emit = defineEmits<{
  'connection-added': []
}>()

onMounted(() => {
  const {
    public: { googleClientId }
  } = useRuntimeConfig()
  clientId.value = googleClientId as string

  initializeGoogleSDK()
})

const initializeGoogleSDK = () => {
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
    } catch (error) {
      isLoading.value = false
      console.error('Error initializing Google SDK:', error)
      isGoogleLoaded.value = false
    }
  }
}

const handleCodeResponse = async (response: any) => {
  if (response.code) {
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
    await $api('/api/youtube/exchange-token', {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: window.location.origin
      }
    })
    isLoading.value = false
    emit('connection-added')
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    isLoading.value = false
  }
}

const login = () => {
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
  justify-content: space-between;
}
.youtube-add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
