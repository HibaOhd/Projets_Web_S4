<template>
  <div class="card p-4 border rounded-lg hover:shadow-xl transition-transform transform hover:scale-105 relative">
    <NuxtLink :to="`/tracks/${track.id}`">
      <img
        :src="track.album.images[0]?.url || '/default-track.png'"
        alt="track"
        class="w-full h-48 object-cover rounded mb-3"
      />
      <p class="font-bold text-lg text-black truncate">{{ track.name }}</p>
      <p class="text-sm text-gray-500">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
      <p class="text-sm text-gray-500">{{ track.album.name }}</p>
    </NuxtLink>

    <button
         v-if="isOwner"
      @click="$emit('remove', track.id)"
      class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
    >
      🗑️
    </button>
  </div>
</template>

<script setup>
defineProps({ track: Object ,
    isOwner: Boolean
})
</script>

<style scoped>
.card img {
  transition: transform 0.3s ease;
}
.card:hover img {
  transform: scale(1.05);
}
</style>
