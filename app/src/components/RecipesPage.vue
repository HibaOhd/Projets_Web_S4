<template>
  <div class="recipes-page">
    <h1>Toutes les Recettes</h1>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher une recette..."
      />

      <select v-model="selectedRegime">
        <option value="">-- Tous les régimes --</option>
        <option v-for="regime in regimes" :key="regime" :value="regime">
          {{ regime }}
        </option>
      </select>

      <select v-model="selectedTime">
        <option value="">-- Temps de préparation --</option>
        <option value="10">≤ 10 min</option>
        <option value="20">≤ 20 min</option>
        <option value="30">≤ 30 min</option>
        <option value="60">≤ 1 heure</option>
      </select>
    </div>

    <div class="recipes-grid">
      <div class="recipe-card" v-for="recipe in filteredRecipes" :key="recipe.id">
        <img :src="recipe.image" :alt="recipe.nom" />
        <h3>{{ recipe.nom }}</h3>
        <p>{{ recipe.description.slice(0, 100) }}...</p>
        <router-link :to="`/recipes/${recipe.id}`">Voir la recette</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipesPage',
  data() {
    return {
      recipes: [],
      searchQuery: '',
      selectedRegime: '',
      selectedTime: '',
      regimes: []
    };
  },
  computed: {
    filteredRecipes() {
      return this.recipes.filter(recipe => {
        const matchSearch =
          recipe.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchRegime = this.selectedRegime
          ? recipe.regime === this.selectedRegime
          : true;

        const matchTime = this.selectedTime
          ? recipe.temps_preparation <= parseInt(this.selectedTime)
          : true;

        return matchSearch && matchRegime && matchTime;
      });
    }
  },
  created() {
    this.setUserRegime();
    this.fetchRecipes();
  },
  methods: {
    setUserRegime() {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (user && user.regime) {
      this.selectedRegime = user.regime;
    }
  },
    async fetchRecipes() {
      try {
        const res = await fetch('http://localhost:3000/recipes');
        const data = await res.json();
        this.recipes = data;
        this.regimes = [...new Set(data.map(r => r.regime))];
      } catch (err) {
        console.error('Erreur de chargement des recettes:', err);
      }
    }
  }
};
</script>

<style scoped>
.recipes-page {
  padding: 20px;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.filters input,
.filters select {
  padding: 8px;
  font-size: 1rem;
}
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.recipe-card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 15px;
  background-color: #fafafa;
  text-align: center;
}
.recipe-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}
.recipe-card h3 {
  margin: 10px 0;
}
</style>
