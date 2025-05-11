<template>
  <div class="card p-4 border rounded-lg hover:shadow-xl transition-transform transform hover:scale-105 relative">
    <!-- Playlist Image -->
    <NuxtLink :to="`/playlists/${playlist.id}`">
      <img
        :src="playlist.images[0]?.url || '/default-playlist.png'"
        alt="playlist"
        class="w-full h-48 object-cover rounded mb-3"
      />
      <p class="font-bold text-lg text-black truncate">{{ playlist.name }}</p>
      <p class="text-sm text-gray-500 truncate">{{ playlist.description || 'No description available' }}</p>
    </NuxtLink>

    <!-- Delete Button 
    <button
      @click="deletePlaylist"
      class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
      aria-label="Delete Playlist"
    >
      🗑️
    </button> -->
  </div>
</template>

<script setup>
defineProps({
  playlist: Object, // An object that holds playlist details like id, name, images, description
})

//const emit = defineEmits(['delete']) // Event to emit delete action to the parent

/*const deletePlaylist = () => {
  // Emit an event to the parent component to handle the deletion
  emit('delete', playlist.id);
}*/
</script>

<style scoped>
.card img {
  transition: transform 0.3s ease;
}
.card:hover img {
  transform: scale(1.05);
}
</style>
