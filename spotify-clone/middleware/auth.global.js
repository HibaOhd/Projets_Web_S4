export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  // Ne pas appliquer le middleware sur ces routes
  if (['/', '/callback'].includes(to.path)) return

  const token = localStorage.getItem('spotify_access_token')
  const expiry = localStorage.getItem('spotify_token_expires')

  if (!token || Date.now() > Number(expiry)){
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_expires_at')
    return navigateTo('/')
  }
})