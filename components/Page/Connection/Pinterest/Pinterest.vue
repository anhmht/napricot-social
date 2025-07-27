<template>
  <PinterestHeader v-model:loading="isLoading" @login="login" />
  <div class="connections-list">
    <PinterestConnection
      v-model:loading="isLoading"
      :connections="connections"
      @refresh="fetchConnections"
      @refresh-token="refreshToken"
    />
  </div>

  <PinterestConfigModal
    v-model="isModalOpen"
    :boards="boards"
    :credential="credential!"
    @submit="fetchConnections"
  />
</template>

<script setup lang="ts">
import PinterestConnection from './PinterestConnection.vue'
import PinterestConfigModal from './PinterestConfigModal.vue'
import PinterestHeader from './PinterestHeader.vue'

const appId = ref<string>('')
const isLoading = ref(false)
const connections = ref<PinterestConnection[]>([])
const isModalOpen = ref(false)
const boards = ref<PinterestBoard[]>([])
const credential = ref<PinterestCredential>()
const refreshId = ref<string>('')
const refreshBoardId = ref<string>('')

onMounted(async () => {
  const {
    public: { pinterestAppId }
  } = useRuntimeConfig()
  await fetchConnections()

  appId.value = pinterestAppId as string

  // Check if we're returning from authorization
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const error = urlParams.get('error')

  const storedState = sessionStorage.getItem('pinterest_oauth_state')
  if (code && storedState) {
    handleAuthorizationCode(code)
  } else if (error) {
    console.error('Pinterest authorization error:', error)
  }
})

const fetchConnections = async () => {
  isLoading.value = true
  try {
    const { data } = await $api('/api/pinterest/connections', {
      method: 'GET'
    })
    connections.value = data
  } finally {
    isLoading.value = false
  }
}

const handleAuthorizationCode = async (code: string) => {
  try {
    // Verify state parameter (CSRF protection)
    const urlParams = new URLSearchParams(window.location.search)

    const returnedState = urlParams.get('state')
    const storedState = sessionStorage.getItem('pinterest_oauth_state')
    const pinterestId = sessionStorage.getItem('pinterest_refresh_id')
    const boardId = sessionStorage.getItem('pinterest_board_id')

    if (returnedState !== storedState) {
      throw new Error('Invalid state parameter')
    }

    console.log(pinterestId, boardId, code)
    if (pinterestId && boardId) {
      await refreshPinterestConnection(code, pinterestId, boardId)
    } else {
      // Exchange authorization code for access token via external API server
      await exchangeCodeForTokens(code)
    }
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)

    // Clean up session storage
    sessionStorage.removeItem('pinterest_oauth_state')
    sessionStorage.removeItem('pinterest_refresh_id')
    sessionStorage.removeItem('pinterest_board_id')
  } catch (error) {
    console.error('Error handling authorization code:', error)
    isLoading.value = false
  }
}

const exchangeCodeForTokens = async (code: string) => {
  try {
    // Send authorization code to backend for token exchange
    const response = await $api('/api/pinterest/exchange-token', {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: `${window.location.origin}${window.location.pathname}`
      }
    })

    if (response) {
      boards.value = response.boards
      credential.value = response.credential
      isModalOpen.value = true
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
  } finally {
    isLoading.value = false
  }
}

const login = (refreshToken: boolean = false) => {
  if (!appId.value) {
    console.error('Pinterest App ID not configured')
    return
  }

  isLoading.value = true

  // Construct the authorization URL
  const redirectUri = `${window.location.origin}${window.location.pathname}`
  const scope =
    'boards:read,pins:read,boards:write,pins:write,user_accounts:read'
  const state = Math.random().toString(36).substring(2, 15) // Generate random state for CSRF protection

  const authUrl = new URL('https://www.pinterest.com/oauth/')
  authUrl.searchParams.set('client_id', appId.value)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('state', state)

  // Store state for verification
  sessionStorage.setItem('pinterest_oauth_state', state)

  if (refreshToken) {
    sessionStorage.setItem('pinterest_refresh_id', refreshId.value as string)
    sessionStorage.setItem('pinterest_board_id', refreshBoardId.value as string)
  }

  // Redirect to Pinterest authorization
  window.location.href = authUrl.toString()
}

const refreshToken = (pinterestId: string, boardId: string) => {
  refreshId.value = pinterestId
  refreshBoardId.value = boardId
  login(true)
}

const refreshPinterestConnection = async (
  code: string,
  pinterestId: string,
  boardId: string
) => {
  try {
    isLoading.value = true
    await $api(`/api/pinterest/connections/${pinterestId}/${boardId}/refresh`, {
      method: 'POST',
      body: {
        code: code,
        redirect_uri: `${window.location.origin}${window.location.pathname}`,
        expired_date: connections.value.find(
          (connection) => connection.pinterestId === pinterestId
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
