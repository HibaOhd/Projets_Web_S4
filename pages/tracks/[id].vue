<template>
  <div class="p-6 bg-black text-white min-h-screen">
    <div v-if="loading" class="text-center py-8">
      <p>Loading track information...</p>
    </div>

    <div v-else-if="error" class="text-red-500 p-4">
      {{ error }}
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <button @click="goBack" class="mb-6 flex items-center text-gray-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back
      </button>

      <!-- Track Info -->
      <div class="flex flex-col md:flex-row gap-8 mb-8">
        <!-- Album Art -->
        <div class="w-full md:w-1/3 lg:w-1/4">
          <img 
            :src="track.album?.images?.[0]?.url || '/default-track.jpg'" 
            :alt="track.name"
            class="w-full rounded-lg shadow-xl"
          />
        </div>

        <!-- Track Details -->
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">{{ track.name }}</h1>
          <h2 class="text-2xl text-gray-400 mb-6">
            {{ track.artists?.map(artist => artist.name).join(', ') }}
          </h2>

          <!-- Album Info -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold">Album</h3>
            <p class="text-gray-400">{{ track.album?.name }}</p>
          </div>

          <!-- Track Metadata -->
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h3 class="text-lg font-semibold">Duration</h3>
              <p class="text-gray-400">{{ formatDuration(track.duration_ms) }}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold">Popularity</h3>
              <p class="text-gray-400">{{ track.popularity }}%</p>
            </div>
            <div v-if="track.explicit">
              <h3 class="text-lg font-semibold">Explicit</h3>
              <p class="text-gray-400">Yes</p>
            </div>
          </div>

          <!-- Audio Player (only shown if preview is available) -->
          <div v-if="track.preview_url" class="bg-gray-800 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <button 
                @click="togglePlayback"
                class="p-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <!-- Progress Bar -->
              <div class="flex-1 mx-4">
                <div class="h-1 bg-gray-600 rounded-full">
                  <div 
                    class="h-full bg-green-500 rounded-full" 
                    :style="{ width: progress + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatDuration(track.duration_ms) }}</span>
                </div>
              </div>

              <!-- Volume Control -->
              <div class="flex items-center">
                <button @click="toggleMute" class="mr-2 text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="!isMuted" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <input 
                  type="range" 
                  v-model="volume"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-24 accent-green-500"
                  @input="updateVolume"
                >
              </div>
            </div>
          </div>

          <!-- Preview Not Available Message -->
          <div v-else class="bg-gray-800 p-4 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-400 mb-2">Preview not available for this track</p>
            <a 
              v-if="track.external_urls?.spotify"
              :href="track.external_urls.spotify"
              target="_blank"
              class="text-green-500 hover:underline inline-flex items-center"
            >
              <span>Play on Spotify</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Related Tracks -->
      <div v-if="relatedTracks.length" class="mt-12">
        <h2 class="text-2xl font-bold mb-6">More like this</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TrackCard 
            v-for="track in relatedTracks"
            :key="track.id"
            :track="track"
            @click="playTrack(track)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TrackCard from '@/components/track_card.vue'

const route = useRoute()
const router = useRouter()
const track = ref({})
const relatedTracks = ref([])
const loading = ref(true)
const error = ref(null)

const audio = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const progress = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)

let token = null // declare token

const formatDuration = (ms) => {
  if (!ms) return '0:00'
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

async function fetchTrack() {
  try {
    loading.value = true
    error.value = null

    const res = await fetch(`https://api.spotify.com/v1/tracks/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch track: ${res.status}`)
    }

    track.value = await res.json()
    await fetchRelatedTracks()

    if (track.value.preview_url) {
      initAudioPlayer()
    }
  } catch (err) {
    console.error('Error fetching track:', err)
    error.value = 'Failed to load track. Please try again.'
  } finally {
    loading.value = false
  }
}

async function fetchRelatedTracks() {
  try {
    if (!track.value.artists?.[0]?.id) return

    const res = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_artists=${track.value.artists[0].id}&limit=12`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (res.ok) {
      const data = await res.json()
      relatedTracks.value = (data.tracks || []).filter(t => t.preview_url).slice(0, 6)
    }
  } catch (err) {
    console.error('Error fetching related tracks:', err)
  }
}

function initAudioPlayer() {
  if (!track.value.preview_url) return

  try {
    audio.value = new Audio(track.value.preview_url)
    audio.value.volume = volume.value

    audio.value.addEventListener('timeupdate', () => {
      currentTime.value = audio.value.currentTime
      progress.value = (audio.value.currentTime / audio.value.duration) * 100
    })

    audio.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
      progress.value = 0
    })
  } catch (err) {
    console.error('Error initializing audio player:', err)
  }
}

function togglePlayback() {
  if (!audio.value) return

  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function updateVolume() {
  if (!audio.value) return
  audio.value.volume = volume.value
  isMuted.value = volume.value === 0
}

function toggleMute() {
  if (!audio.value) return

  if (isMuted.value) {
    audio.value.volume = volume.value
  } else {
    audio.value.volume = 0
  }
  isMuted.value = !isMuted.value
}

function playTrack(newTrack) {
  if (audio.value) {
    audio.value.pause()
    isPlaying.value = false
  }

  router.push(`/track/${newTrack.id}`)
}

function goBack() {
  router.go(-1)
}

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value.src = ''
  }
})

onMounted(() => {
  // Access localStorage only on client
  token = localStorage.getItem('spotify_access_token')
  if (!token) {
    error.value = 'Access token not found. Please login again.'
    loading.value = false
    return
  }

  fetchTrack()
})
</script>
