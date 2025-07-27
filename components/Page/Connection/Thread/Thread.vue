<template>
  <ThreadHeader v-model:loading="isLoading" @login="login" />
  <div class="connections-list">
    <ThreadConnection
      :connections="connections"
      v-model:loading="isLoading"
      @refresh="fetchConnections"
      @refresh-token="refreshToken"
    />
  </div>
</template>

<script setup lang="ts">
import ThreadHeader from './ThreadHeader.vue'
import ThreadConnection from './ThreadConnection.vue'

const appId = ref<string>('')
const isLoading = ref(false)
const connections = ref<ThreadsConnection[]>([])
const refreshId = ref<string | null>(null)

onMounted(async () => {
  const {
    public: { threadsAppId }
  } = useRuntimeConfig()
  await fetchConnections()

  appId.value = threadsAppId as string

  // Check if we're returning from authorization
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const error = urlParams.get('error')

  const storedState = sessionStorage.getItem('threads_oauth_state')
  if (code && storedState) {
    handleAuthorizationCode(code)
  } else if (error) {
    console.error('Threads authorization error:', error)
  }
})

const fetchConnections = async () => {
  isLoading.value = true
  try {
    const { data } = await $api('/api/threads/connections', {
      method: 'GET'
    })
    connections.value = data

    for (const connection of connections.value) {
      const response = await fetch(
        `https://graph.threads.net/v1.0/${connection.threadId}?access_token=${connection.accessToken}&fields=threads_profile_picture_url`,
        {
          method: 'GET'
        }
      )
      const info = await response.json()
      connection.avatar = info.threads_profile_picture_url
    }
  } catch (error) {
    console.error('Error fetching threads connections:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAuthorizationCode = async (code: string) => {
  try {
    // Verify state parameter (CSRF protection)
    const urlParams = new URLSearchParams(window.location.search)

    const returnedState = urlParams.get('state')
    const storedState = sessionStorage.getItem('threads_oauth_state')
    const threadId = sessionStorage.getItem('threads_refresh_id')

    if (returnedState !== storedState) {
      throw new Error('Invalid state parameter')
    }

    if (threadId) {
      await refreshThreadsConnection(threadId, code)
    } else {
      // Exchange authorization code for access token via external API server
      await exchangeCodeForTokens(code)
    }

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)

    // Clean up session storage
    sessionStorage.removeItem('threads_oauth_state')
    sessionStorage.removeItem('threads_refresh_id')
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
      fetchConnections()
    } else {
      throw new Error('No access token received from backend')
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
  } finally {
    isLoading.value = false
  }
}

const login = (refreshToken: boolean = false) => {
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

  if (refreshToken) {
    sessionStorage.setItem('threads_refresh_id', refreshId.value as string)
  }

  // Redirect to Threads authorization
  window.location.href = authUrl.toString()
}

const refreshToken = (threadId: string) => {
  refreshId.value = threadId
  login(true)
}

const refreshThreadsConnection = async (threadId: string, code: string) => {
  try {
    isLoading.value = true
    await $api(`/api/threads/connections/${threadId}/refresh`, {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: `${window.location.origin}${window.location.pathname}`,
        expired_date: connections.value.find(
          (connection) => connection.threadId === threadId
        )?.expiredDate
      }
    })

    fetchConnections()
  } catch (error) {
    console.error('Error refreshing token:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
