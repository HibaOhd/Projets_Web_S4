<template>
  <div class="min-h-screen bg-black text-white p-6">
    <!-- Header and Actions -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">🎵 Your Playlists</h1>
      <NuxtLink to="/home" class="text-sm text-green-400 hover:underline">
        ← Back to Home
      </NuxtLink>
    </div>

    <!-- Create Playlist Toggle -->
    <button
      @click="showForm = !showForm"
      class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      {{ showForm ? 'Cancel' : '➕ Create Playlist' }}
    </button>

    <!-- Create Playlist Form -->
    <form
      v-if="showForm"
      @submit.prevent="createPlaylist"
      class="bg-gray-800 p-6 rounded shadow space-y-4 mb-8"
    >
      <input
        v-model="newPlaylist.name"
        type="text"
        placeholder="Playlist Name"
        class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        v-model="newPlaylist.description"
        type="text"
        placeholder="Description (optional)"
        class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded"
      >
        Create Playlist
      </button>
    </form>

    <!-- Loading and Error -->
    <div v-if="loading" class="text-center py-12 text-gray-400">
      <p>Loading playlists...</p>
    </div>

    <div v-else-if="error" class="text-red-400 text-center py-6">
      {{ error }}
    </div>

    <!-- Playlist Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.id"
        :playlist="playlist"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlaylistCard from '@/components/playlist_card.vue'

const playlists = ref([])
const showForm = ref(false)
const newPlaylist = ref({ name: '', description: '' })
const loading = ref(true)
const error = ref(null)
const token = ref(null)

async function fetchPlaylists() {
  if (!token.value) return

  try {
    loading.value = true
    error.value = null

    const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    if (!res.ok) throw new Error(`Failed to fetch playlists: ${res.status}`)

    const data = await res.json()
    playlists.value = data.items.map(playlist => ({
      ...playlist,
      images: playlist.images || [{ url: '/default-playlist.png' }]
    }))
  } catch (err) {
    console.error('Error fetching playlists:', err)
    error.value = 'Failed to load playlists. Please try again.'
  } finally {
    loading.value = false
  }
}

async function createPlaylist() {
  if (!token.value) return

  try {
    const res = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newPlaylist.value.name,
        description: newPlaylist.value.description,
        public: false
      })
    })

    if (!res.ok) throw new Error(`Failed to create playlist: ${res.status}`)

    const data = await res.json()
    playlists.value.unshift({
      ...data,
      images: data.images || [{ url: '/default-playlist.png' }]
    })
    showForm.value = false
    newPlaylist.value = { name: '', description: '' }
  } catch (err) {
    console.error('Error creating playlist:', err)
    error.value = 'Failed to create playlist. Please try again.'
  }
}

/*const deletePlaylist = async (playlistId) => {
  if (!token.value) return

  try {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (!res.ok) throw new Error(`Failed to delete playlist: ${res.status}`)

    // Remove playlist from local list
    playlists.value = playlists.value.filter(p => p.id !== playlistId)
  } catch (err) {
    console.error('Error deleting playlist:', err)
    error.value = 'Failed to delete playlist. Please try again.'
  }
}*/

onMounted(() => {
  token.value = localStorage.getItem('spotify_access_token')
  fetchPlaylists()
})
</script>
