export const useAuth = () => {
  // Get the user state
  const user = useState('auth.user', () => undefined)

  // Computed property to check if user is logged in
  const isLoggedIn = computed(() => !!user.value)

  // Method to set user data (useful for login)
  const setUser = (userData: any) => {
    user.value = userData
  }

  // Method to clear user data (useful for logout)
  const clearUser = () => {
    user.value = undefined
  }

  // Method to refresh user data
  const getMe = async () => {
    try {
      const response = await $api('/api/auth/me')
      user.value = response
      return response
    } catch (error) {
      console.log('Failed to refresh user data:', error)
      user.value = undefined
      throw error
    }
  }

  const signOut = async () => {
    await $api('/api/auth/logout', {
      method: 'POST'
    })
    clearUser()
  }

  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    const response = await $api('/api/auth/login', {
      method: 'POST',
      body: { email, password, rememberMe }
    })
    setUser(response)
  }

  return {
    user: readonly(user),
    isLoggedIn,
    setUser,
    clearUser,
    getMe,
    signOut,
    signIn
  }
}
