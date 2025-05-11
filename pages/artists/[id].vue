<template>
  <div class="p-6 bg-black min-h-screen text-white">
    <button @click="goBack" class="mb-6 flex items-center text-gray-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back
      </button>
    <!-- Artist Header -->
    <div
      v-if="artist"
      class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 mb-10"
    >
      <img
        :src="artist.images[0]?.url || '/default-artist.jpg'"
        alt="Artist Image"
        class="w-48 h-48 rounded-full object-cover shadow-lg border border-gray-700"
      />
      <div class="text-center md:text-left">
        <h1 class="text-4xl font-bold mb-2">{{ artist.name }}</h1>
        <p class="text-gray-400">Genres: <span class="italic">{{ artist.genres.join(', ') || 'N/A' }}</span></p>
        <p class="text-gray-400 mt-1">{{ artist.followers.total.toLocaleString() }} followers</p>
      </div>
    </div>

    <!-- Top Tracks -->
    <section v-if="topTracks.length" class="mb-12">
      <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Top Tracks</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrackCard
          v-for="track in topTracks"
          :key="track.id"
          :track="track"
        />
      </div>
    </section>

    <!-- Albums -->
    <section v-if="albums.length">
      <h2 class="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Albums & Singles</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlaylistCard
          v-for="album in albums"
          :key="album.id"
          :playlist="album"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import TrackCard from '@/components/track_card.vue'
import PlaylistCard from '@/components/playlist_card.vue'
const router = useRouter()
const route = useRoute()
const artist = ref(null)
const topTracks = ref([])
const albums = ref([])
function goBack() {
  router.go(-1)
}
onMounted(async () => {
  const token = localStorage.getItem('spotify_access_token')
  if (!token) return

  const headers = { Authorization: `Bearer ${token}` }

  // Fetch artist info
  const resArtist = await fetch(`https://api.spotify.com/v1/artists/${route.params.id}`, { headers })
  if (resArtist.ok) {
    artist.value = await resArtist.json()
  }

  // Fetch top tracks
  const resTop = await fetch(`https://api.spotify.com/v1/artists/${route.params.id}/top-tracks?market=US`, { headers })
  const topData = await resTop.json()
  topTracks.value = topData.tracks || []

  // Fetch albums
  const resAlbums = await fetch(`https://api.spotify.com/v1/artists/${route.params.id}/albums?include_groups=album,single&market=US&limit=30`, { headers })
  const albumsData = await resAlbums.json()

  // Filter out duplicates by album name
  const seen = new Set()
  albums.value = albumsData.items.filter(album => {
    if (seen.has(album.name)) return false
    seen.add(album.name)
    return true
  })
})
</script>
