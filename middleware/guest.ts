export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  // If user is authenticated (not undefined), redirect to home
  if (user.value) {
    return navigateTo('/')
  }
})
