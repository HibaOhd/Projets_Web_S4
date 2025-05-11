<template>
  <div class="bg-black text-white min-h-screen px-6 py-8">
    <!-- Back Button -->
    <div class="mb-6">
      <NuxtLink
        to="/home"
        class="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
      >
        ← Back to Home
      </NuxtLink>
    </div>

    <!-- Search Input -->
    <div class="mb-10">
      <input
        v-model="query"
        type="text"
        placeholder="Search for tracks, artists, albums, or playlists"
        class="w-full p-4 rounded-xl bg-gray-800 text-white text-lg outline-none focus:ring-2 focus:ring-green-500 transition"
      />
    </div>
        <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-40">
    <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500"></div>
    </div>

    <!-- No Results Message -->
    <div v-if="!loading && hasSearched && !tracks.length && !artists.length && !albums.length && !playlists.length" class="text-center text-gray-400 text-lg mt-20">
    No results found for "{{ query }}"
    </div>
    <!-- Tracks -->
    <div v-if="tracks.length" class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Tracks</h2>
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <TrackCard
          v-for="track in tracks.filter(t => t && t.id)"
          :key="track.id"
          :track="track"
        />
      </div>
    </div>

    <!-- Artists -->
    <div v-if="artists.length" class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Artists</h2>
      <div class="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <ArtistCard
          v-for="artist in artists.filter(a => a && a.id)"
          :key="artist.id"
          :artist="artist"
        />
      </div>
    </div>

    <!-- Albums -->
    <div v-if="albums.length" class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Albums</h2>
      <div class="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <AlbumCard
          v-for="album in albums.filter(a => a && a.id)"
          :key="album.id"
          :album="album"
        />
      </div>
    </div>

    <!-- Playlists -->
    <div v-if="playlists.length">
      <h2 class="text-2xl font-bold mb-4">Playlists</h2>
      <div class="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <PlaylistCard
          v-for="playlist in playlists.filter(p => p && p.id)"
          :key="playlist.id"
          :playlist="playlist"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TrackCard from '@/components/track_card.vue'
import PlaylistCard from '@/components/playlist_card.vue'
import AlbumCard from '@/components/album_card.vue'
import ArtistCard from '@/components/artist_card.vue'

const router = useRouter()

const query = ref('')
const tracks = ref([])
const artists = ref([])
const albums = ref([])
const playlists = ref([])
const loading = ref(false)
const hasSearched = ref(false)

let debounceTimer = null

const search = async () => {
  const token = localStorage.getItem('spotify_access_token')
  if (!token || !query.value.trim()) return

  loading.value = true
  hasSearched.value = true

  try {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query.value)}&type=track,artist,album,playlist&limit=6`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    tracks.value = data.tracks?.items || []
    artists.value = data.artists?.items || []
    albums.value = data.albums?.items || []
    playlists.value = data.playlists?.items || []

  } catch (err) {
    console.error('Search failed:', err)
  } finally {
    loading.value = false
  }
}


// Live search: debounce 400ms
watch(query, (newVal) => {
  clearTimeout(debounceTimer)
  if (!newVal.trim()) {
    tracks.value = []
    artists.value = []
    albums.value = []
    playlists.value = []
    return
  }
  debounceTimer = setTimeout(() => search(), 400)
})
</script>
