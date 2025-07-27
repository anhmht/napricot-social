export const useAuth = () => {
  // Get the user state
  const user = useState<User | undefined>('auth.user', () => undefined)

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
      user.value = response.user as User
      return response.user as User
    } catch (error) {
      console.log('Failed to refresh user data:', error)
      user.value = undefined
      throw error
    }
  }

  // Method to check auth status with loading state for layouts
  const checkAuthStatus = async () => {
    // If user is already loaded, return immediately
    if (user.value !== undefined) {
      return user.value
    }

    // Try to get user info
    try {
      await getMe()
      return user.value
    } catch (error) {
      // User is not authenticated
      console.log(error)
      return undefined
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
    setUser(response.user)
  }

  return {
    user: readonly(user),
    isLoggedIn,
    setUser,
    clearUser,
    getMe,
    checkAuthStatus,
    signOut,
    signIn
  }
}
