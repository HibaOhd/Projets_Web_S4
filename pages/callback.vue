
<template>
  <div class="flex items-center justify-center h-screen bg-gray-900 text-white">
    Connexion en cours...
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'
const router = useRouter()

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  const verifier = localStorage.getItem('spotify_code_verifier')
  const config = useRuntimeConfig()

  const clientId = config.public.spotifyClientId
  const redirectUri = config.public.spotifyRedirectUri

  if (!code || !verifier) {
    return router.push('/')
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id:clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      })
    })

    const data = await response.json()

    if (data.access_token) {
      localStorage.setItem('spotify_access_token', data.access_token)
      localStorage.setItem('spotify_token_expires', Date.now() + data.expires_in * 1000)
      router.push('/home') // vers la page d’accueil
    } else {
      router.push('/')
    }
  } catch (err) {
    console.error('Token fetch failed', err)
    router.push('/')
  }
})
</script>
