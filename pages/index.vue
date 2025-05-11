<template>
  <div class="flex items-center justify-center h-screen bg-black text-white">
    <button
      @click="login"
      class="bg-green-500 px-6 py-3 rounded-full font-bold hover:bg-green-600"
    >
      Se connecter avec Spotify
    </button>
  </div>
</template>

<script setup>
import { useSpotifyAuth } from '@/composables/useSpotifyAuth'
const { login } = useSpotifyAuth()
</script>
