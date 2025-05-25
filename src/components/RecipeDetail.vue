<template>
  <div class="recipe-details">
    <div v-if="recipe">
      <h1>{{ recipe.nom }}</h1>
      <img :src="recipe.image" alt="Recipe Image" class="recipe-img" />

      <p><strong>Description:</strong> {{ recipe.description }}</p>
      <p><strong>Temps de préparation:</strong> {{ recipe.temps_preparation }} min</p>
      <p><strong>Temps de cuisson:</strong> {{ recipe.temps_cuisson }} min</p>
      <p><strong>Portions:</strong> {{ recipe.portions }}</p>
      <p><strong>Régime:</strong> {{ recipe.regime }}</p>

      <h3>Ingrédients</h3>
      <ul>
        <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
          {{ ingredient.nom }} - {{ ingredient.quantité }} {{ ingredient.unité }}
        </li>
      </ul>

      <h3>Instructions</h3>
      <ol>
        <li v-for="(step, index) in recipe.instructions" :key="index">{{ step }}</li>
      </ol>

      <h3>Commentaires</h3>
      <ul v-if="comments.length">
        <li v-for="comment in comments" :key="comment.id">
          <strong>{{ getUserName(comment.userID) }}:</strong> {{ comment.comment }}
        </li>
      </ul>
      <p v-else>Aucun commentaire pour cette recette.</p>
      <div v-if="currentUser">
        <h3>Ajouter un commentaire</h3>
        <form @submit.prevent="submitComment">
            <textarea v-model="newComment" required placeholder="Votre commentaire..."></textarea>
            <button type="submit">Publier</button>
        </form>
        </div>
        <p v-else>
        <router-link to="/login">Connectez-vous</router-link> pour ajouter un commentaire.
        </p>
        <router-link
        v-if="currentUser && currentUser.id === recipe.authorID"
        :to="`/edit-recipe/${recipe.id}`">
        Modifier cette recette
        </router-link>
    </div>
    <div v-else>
      <p>Chargement de la recette...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeDetails',
  data() {
  return {
    recipe: null,
    comments: [],
    users: [],
    newComment: '',
    currentUser: null
  };
},
async created() {
  const id = this.$route.params.id;
  try {
    const [recipeRes, commentsRes, usersRes] = await Promise.all([
      fetch(`http://localhost:3000/recipes/${id}`),
      fetch(`http://localhost:3000/comments?recipeID=${id}`),
      fetch(`http://localhost:3000/users`)
    ]);

    this.recipe = await recipeRes.json();
    this.comments = await commentsRes.json();
    this.users = await usersRes.json();

    // Récupérer l'utilisateur connecté depuis localStorage
    const userData = localStorage.getItem("loggedUser");
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    else{
        console.log("errrror");
    }
  } catch (err) {
    console.error('Erreur de chargement des données :', err);
  }
},
methods: {
  getUserName(userID) {
    const user = this.users.find(u => u.id === userID);
    return user ? user.username : 'Utilisateur inconnu';
  },
  async submitComment() {
    if (!this.newComment.trim()) return;

    const newCommentObj = {
      id: Date.now().toString(),
      recipeID: this.recipe.id,
      userID: this.currentUser.id,
      comment: this.newComment,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(`http://localhost:3000/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommentObj)
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout du commentaire');

      this.comments.push(newCommentObj);
      this.newComment = '';
      this.recipe.nbrComments += 1;
        await fetch(`http://localhost:3000/recipes/${this.recipe.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nbrComments: this.recipe.nbrComments })});
    } catch (err) {
      console.error(err);
    }
  }
}
};
</script>

<style scoped>
.recipe-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.recipe-img {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}
textarea {
  width: 100%;
  height: 80px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  resize: none;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>
