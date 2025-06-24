export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (import.meta.server) return

  const route = useRoute()

  // Don't call getMe if we're already on the login page or if already initialized
  if (route.path === '/login') return

  try {
    const { getMe } = useAuth()
    await getMe()
  } catch (error) {
    // Only redirect if we're not already on login page
    if (route.path !== '/login') {
      await navigateTo('/login')
    }
  }
})
