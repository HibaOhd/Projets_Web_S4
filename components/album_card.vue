<template>
  <div class="card p-4 border rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
    <NuxtLink :to="`/albums/${album.id}`">
    <img
      :src="album.images[0]?.url ||'/default-playlist.png' "
      alt="Album Cover"
      class="w-full h-48 object-cover rounded mb-3"
    />
    <h3 class="font-bold text-lg text-black truncate">{{ album.name }}</h3>
    <p class="text-sm text-gray-500">by {{ album.artists[0]?.name }}</p>
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  album: {
    type: Object,
    required: true,
  },
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

