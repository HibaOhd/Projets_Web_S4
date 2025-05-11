<template>
  <div class="bg-black text-white min-h-screen flex justify-center items-start py-16 px-4">
    <div class="max-w-3xl w-full bg-gray-900 rounded-2xl shadow-xl p-8">
      <h1 class="text-4xl font-bold mb-8 text-center text-green-400">User Profile</h1>

      <div v-if="profile" class="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <!-- Profile Image -->
        <img
          :src="profileImage"
          alt="Profile Image"
          class="w-32 h-32 rounded-full object-cover shadow-md ring-2 ring-green-500"
        />

        <!-- Profile Info -->
        <div class="space-y-3 text-center sm:text-left">
          <h2 class="text-2xl font-semibold">{{ profile.display_name }}</h2>
          <p class="text-base text-gray-400">📧 {{ profile.email }}</p>
          <p class="text-sm text-gray-500">👥 Followers: {{ profile.followers.total }}</p>
          <p class="text-sm text-gray-500">🌍 Country: {{ profile.country }}</p>
        </div>
      </div>

      <p v-else class="text-gray-400 text-center">Loading profile...</p>
      <!-- Back to Home Button -->
        <div class="mt-10 text-center">
        <NuxtLink
            to="/home"
            class="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
        >
            ← Back to Home
        </NuxtLink>
        </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profile = ref(null)

// Default profile image if the user doesn't have one
const defaultImage = '/default-artist.png'

// Computed property for the profile image, falling back to a default image if none is available
const profileImage = computed(() => {
  return profile.value?.images?.length ? profile.value.images[0].url : defaultImage
})

onMounted(async () => {
  const token = localStorage.getItem('spotify_access_token')

  if (!token) {
    router.push('/')
    return
  }

  try {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.status === 401) {
      // Token expired or invalid
      router.push('/')
      return
    }

    const data = await res.json()
    profile.value = data
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  }
})
</script>

