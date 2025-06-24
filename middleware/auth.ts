export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  // If user is undefined (not authenticated), redirect to login
  if (user.value === undefined) {
    return navigateTo('/login')
  }
})
