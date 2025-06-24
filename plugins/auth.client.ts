export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (import.meta.server) return

  const { getMe } = useAuth()

  try {
    await getMe()
  } catch (error) {
    await navigateTo('/login')
  }
})
