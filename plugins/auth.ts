export default defineNuxtPlugin(async () => {
  const token = useCookie('auth_token')
  if (token.value) {
    const { checkAuthStatus } = useAuth()
    await checkAuthStatus()
  }
})
