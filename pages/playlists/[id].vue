<template>
  <div class="min-h-screen bg-black text-white p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ playlist?.name }}</h1>
      <button @click="goBack" class="mb-6 flex items-center text-gray-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back
      </button>
    </div>

    <p class="mb-6 text-gray-400">{{ playlist?.description || 'No description available.' }}</p>

    <!-- Add Track Section -->
    <div class="mb-8 bg-gray-800 p-4 rounded-lg" v-if="isOwner">
      <h2 class="text-xl font-semibold mb-2">Add a Track</h2>
      <div class="flex gap-2 items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by track name..."
          class="flex-1 p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button @click="searchTrack" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">Search</button>
      </div>
      <div v-if="searchResults.length" class="mt-4">
        <div
          v-for="track in searchResults"
          :key="track.id"
          class="flex justify-between items-center bg-gray-900 p-3 rounded mb-2"
        >
          <span>{{ track.name }} - {{ track.artists.map(a => a.name).join(', ') }}</span>
          <button @click="addTrack(track.uri)" class="text-sm bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Add</button>
        </div>
      </div>
    </div>

    <!-- Tracks Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TrackCard
        v-for="item in playlist?.tracks?.items"
        :key="item.track.id"
        :track="item.track"
        :isOwner="isOwner"
        @remove="removeTrack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TrackCard from '@/components/track_card.vue'

const route = useRoute()
const router = useRouter()

const playlist = ref(null)
const token = ref(null)
const searchQuery = ref('')
const searchResults = ref([])

const fetchPlaylist = async () => {
  if (!token.value) return
  const res = await fetch(`https://api.spotify.com/v1/playlists/${route.params.id}`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  if (res.ok) {
    playlist.value = await res.json()
  }
}
const userId = ref(null)

const fetchUserProfile = async () => {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  if (res.ok) {
    const data = await res.json()
    userId.value = data.id
  }
}
const isOwner = computed(() => {
  return playlist.value?.owner?.id === userId.value
})
const removeTrack = async (trackId) => {
  if (!token.value) return

  const res = await fetch(`https://api.spotify.com/v1/playlists/${route.params.id}/tracks`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tracks: [{ uri: `spotify:track:${trackId}` }]
    })
  })

  if (res.ok) {
    await fetchPlaylist()
  }
}
function goBack(){
    router.go(-1)
}
const searchTrack = async () => {
  if (!token.value || !searchQuery.value.trim()) return
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery.value)}&type=track&limit=5`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  const data = await res.json()
  searchResults.value = data.tracks?.items || []
}

const addTrack = async (trackUri) => {
  if (!token.value) return
  const res = await fetch(`https://api.spotify.com/v1/playlists/${route.params.id}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris: [trackUri] })
  })

  if (res.ok) {
    searchQuery.value = ''
    searchResults.value = []
    await fetchPlaylist()
  }
}

onMounted(() => {
  token.value = localStorage.getItem('spotify_access_token')
  fetchPlaylist()
  fetchUserProfile()
})
</script>
