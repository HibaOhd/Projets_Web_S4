<template>
  <div class="bg-black text-white min-h-screen">
    <!-- Navbar -->
    <nav class="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div class="flex items-center gap-6">
        <!-- User Profile with Image -->
        <NuxtLink to="/profile" class="hover:opacity-80 transition">
          <img
            v-if="profile"
            :src="profileImage"
            alt="Profile Image"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-green-500"
          />
        </NuxtLink>
        <!-- Navigation Buttons -->
        <NuxtLink to="/playlists" class="hover:text-green-400 transition">Playlists</NuxtLink>
        <NuxtLink to="/search" class="hover:text-green-400 transition">Search</NuxtLink>
      </div>

      <!-- Logout Button -->
      <button @click="logout" class="hover:text-red-400 transition">Logout</button>
    </nav>

<!-- New Releases Section -->
<section class="px-8 py-10">
  <h2 class="text-3xl font-bold mb-6">🔥 New Releases</h2>

  <!-- Loading Spinner -->
  <div v-if="isLoading" class="text-center text-gray-300 py-20">
    <svg class="animate-spin h-8 w-8 mx-auto text-green-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    <p>Loading new releases...</p>
  </div>

  <!-- New Releases Grid -->
  <div v-else-if="newReleases.length" class="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <AlbumCard
    v-for="album in newReleases"
    :key="album.id"
    :album="album"
    />
  </div>

  <!-- No Releases Fallback -->
  <div v-else class="text-gray-400 text-center mt-12">
    No new releases available.
  </div>
</section>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AlbumCard from '@/components/album_card.vue' 
const router = useRouter()
const profile = ref(null)
const newReleases = ref([])
const error = ref(null)
const isLoading = ref(true)

const defaultImage = '/default-artist.png'
const profileImage = computed(() => profile.value?.images?.length ? profile.value.images[0].url : defaultImage)

onMounted(async () => {
  const token = localStorage.getItem('spotify_access_token')
  if (!token) {
    router.push('/')
    return
  }

  try {
    // Fetch user profile
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (profileRes.status === 401) {
      router.push('/')
      return
    }

    profile.value = await profileRes.json()

    // Fetch new releases
    const newReleasesRes = await fetch(
      'https://api.spotify.com/v1/browse/new-releases?limit=8&country=MA',
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (newReleasesRes.ok) {
      const data = await newReleasesRes.json()
      newReleases.value = data.albums.items || []
    } else {
      error.value = 'Could not load new releases'
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
    error.value = 'Failed to load new releases'
  } finally {
    isLoading.value = false
  }
})

const logout = () => {
  localStorage.removeItem('spotify_access_token')
  localStorage.removeItem('spotify_refresh_token')
  localStorage.removeItem('spotify_code_verifier')
  router.push('/')
}
</script>
