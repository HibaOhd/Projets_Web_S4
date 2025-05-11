<template>
  <div class="card p-4 border rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
    <NuxtLink :to="`/artists/${artist.id}`">
      <img
        :src="artist.images[0]?.url || '/default-artist.png'"
        alt="artist"
        class="w-full h-48 object-cover rounded mb-3"
      />
      <p class="font-bold text-lg text-black truncate">{{ artist.name }}</p>
      <p class="text-sm text-gray-500">{{ artist.genres.join(', ') }}</p>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  artist: Object, // An object that holds artist details like id, name, images, genres
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
