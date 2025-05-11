<template>
  <div class="min-h-screen bg-black text-white p-6">
    <button @click="goBack" class="mb-6 flex items-center text-gray-400 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
      Back
    </button>

    <div v-if="album" class="flex flex-col md:flex-row items-center md:items-start mb-10">
      <img
        v-if="album.images?.length"
        :src="album.images[0].url"
        alt="Album Cover"
        class="w-48 h-48 rounded-lg object-cover shadow-lg mb-4 md:mb-0 md:mr-8"
      />
      <div>
        <h1 class="text-4xl font-bold mb-2">{{ album.name }}</h1>
        <p class="text-gray-400">Released: {{ album.release_date }}</p>
        <p class="text-gray-400">{{ album.total_tracks }} tracks</p>
      </div>
    </div>

    <!-- Tracks -->
    <section v-if="albumTracks.length">
      <h2 class="text-2xl font-semibold mb-6">Tracks</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrackCard
          v-for="track in albumTracks"
          :key="track.id"
          :track="track"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TrackCard from '@/components/track_card.vue'

const router = useRouter()
const route = useRoute()
const album = ref(null)
const albumTracks = ref([])

function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

onMounted(async () => {
  const token = localStorage.getItem('spotify_access_token')
  if (!token) return

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const resAlbum = await fetch(`https://api.spotify.com/v1/albums/${route.params.id}`, { headers })
    album.value = await resAlbum.json()

    const resTracks = await fetch(`https://api.spotify.com/v1/albums/${route.params.id}/tracks`, { headers })
    const trackData = await resTracks.json()

    // Attach album info to each track so TrackCard works properly
    albumTracks.value = trackData.items.map(track => ({
      ...track,
      album: album.value
    }))
  } catch (error) {
    console.error('Error fetching album data:', error)
  }
})
</script>
