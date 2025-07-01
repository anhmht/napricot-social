<template>
  <div class="thread-login">
    <h2>Threads</h2>
    <div>
      <Button
        class="thread-add-button"
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
const appId = ref<string>('')
const isLoading = ref(false)

const emit = defineEmits<{
  'connection-added': []
}>()

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
      emit('connection-added')
    } else {
      throw new Error('No access token received from backend')
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
  } finally {
    isLoading.value = false
  }
}

const login = () => {
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
</script>

<style lang="postcss" scoped>
.thread-login {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}
.thread-add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
