<template>
  <div>
    <header class="header">
      <h1>YOURcipes</h1>
      <nav class="nav-links">
        <router-link to="/">Accueil</router-link>
        <router-link to="/recipes">Recettes</router-link>
        <router-link to="/add-recipe" v-if="user?.admin">Ajouter une Recette</router-link>
         <router-link v-if="!user" to="/login">Connexion</router-link>
        <router-link v-if="!user" to="/signup">Inscription</router-link>
        <router-link v-if="user" to="/profile">Profil ({{ user.username }})</router-link>
        <button v-if="user" @click="logout">Déconnexion</button>
      </nav>
    </header>

    <!--<section class="banner">
      <img src="https://source.unsplash.com/1600x400/?food,cooking" alt="Banner">
      <h2 class="banner-text">Trouvez et partagez des recettes adaptées à vos goûts</h2>
    </section>-->

    <section class="presentation">
      <h3>Bienvenue sur YOURcipes</h3>
      <p>Application dédiée à ceux qui cherchent des recettes adaptées à leur régime alimentaire.</p>
    </section>

    <section class="popular-recipes">
      <h3>Recettes populaires</h3>
      <div class="recipe-list">
        <div
          v-for="recipe in popularRecipes"
          :key="recipe.id"
          class="recipe-card"
        >
          <img :src="recipe.image" :alt="recipe.nom" />
          <h4>{{ recipe.nom }}</h4>
          <p>{{ recipe.description }}</p>
          <router-link :to="`/recipes/${recipe.id}`">Voir plus</router-link>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>© 2025 YOURcipes — Tous droits réservés</p>
      <p>Contact | Mentions légales | Réseaux sociaux</p>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'HomePage',
  data() {
    return {
      popularRecipes: [],
       user: null
    };
  },
  async created() {
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    try {
      const response = await fetch('http://localhost:3000/recipes?_sort=nbrComments&_order=desc&_limit=4');
      const data = await response.json();
      this.popularRecipes = data;
    } catch (error) {
      console.error('Erreur lors du chargement des recettes populaires :', error);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedUser');
      this.user = null;
      this.$router.push('/');
    }
  }
};
</script>
<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.banner {
  position: relative;
  text-align: center;
}

.banner img {
  width: 100%;
  height: auto;
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2rem;
}

.presentation {
  padding: 2rem;
  text-align: center;
}

.popular-recipes {
  padding: 2rem;
}

.recipe-list {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.recipe-card {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 1rem;
}

.recipe-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.footer {
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  background-color: #f5f5f5;
}

</style>