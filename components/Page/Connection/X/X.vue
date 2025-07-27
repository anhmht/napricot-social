<template>
  <XHeader v-model:loading="isLoading" @login="login" />
  <div class="connections-list">
    <XConnection
      :connections="connections"
      v-model:loading="isLoading"
      @refresh="fetchConnections"
    />
  </div>
</template>
<script lang="ts" setup>
import XConnection from './XConnection.vue'
import XHeader from './XHeader.vue'

const isLoading = ref(false)
const connections = ref<XConnection[]>([])

const login = async () => {
  try {
    isLoading.value = true
    const data = await $api('/api/x/auth-url', {
      method: 'GET',
      params: {
        redirect_uri: `${window.location.origin}`
      }
    })

    sessionStorage.setItem('x_oauth', data)

    window.location.href = data.authUrl
  } catch (error) {
    console.error('Error fetching auth URL:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAuthorizationCode = async (
  oauthToken: string,
  oauthVerifier: string
) => {
  try {
    isLoading.value = true
    const response = await $api('/api/x/exchange-token', {
      method: 'POST',
      body: {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier
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

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)

    sessionStorage.removeItem('x_oauth')
  }
}

const fetchConnections = async () => {
  isLoading.value = true
  try {
    const { data } = await $api('/api/x/connections', {
      method: 'GET'
    })
    connections.value = data
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchConnections()

  const urlParams = new URLSearchParams(window.location.search)
  const oauthToken = urlParams.get('oauth_token')
  const oauthVerifier = urlParams.get('oauth_verifier')

  if (oauthToken && oauthVerifier) {
    await handleAuthorizationCode(oauthToken, oauthVerifier)
  }
})
</script>
