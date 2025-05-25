<template>
  <div class="profile-container">
    <h2>Profil de l'Utilisateur</h2>

    <div v-if="user">
      <p><strong>Nom complet :</strong> {{ user.fullName }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Nom d'utilisateur :</strong> {{ user.username }}</p>
      <p><strong>Régime :</strong> {{ user.regime }}</p>
    </div>
    <div v-else>
      <p>Veuillez vous connecter pour voir votre profil.</p>
    </div>

    <!-- Recettes affichées seulement si l'utilisateur est admin -->
    <div v-if="user?.admin">
      <h3>Recettes ajoutées</h3>
      <div v-if="recipes.length">
        <ul>
          <li v-for="recipe in recipes" :key="recipe.id">
            <router-link :to="`/recipes/${recipe.id}`">{{ recipe.nom }}</router-link>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Aucune recette ajoutée.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      recipes: []
    };
  },
  created() {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      if (this.user.admin) {
        this.fetchUserRecipes();
      }
    }
  },
  methods: {
    async fetchUserRecipes() {
      try {
        const response = await fetch('http://localhost:3000/recipes');
        const data = await response.json();
        this.recipes = data.filter(r => r.authorID === this.user.id);
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes:', error);
      }
    }
  }
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
</style>
