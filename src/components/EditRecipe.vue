<template>
  <div class="edit-recipe">
    <h1>Modifier la recette</h1>
    <form v-if="recipe" @submit.prevent="updateRecipe">
      <label>Nom de la recette</label>
      <input v-model="recipe.nom" required />

      <label>Description</label>
      <textarea v-model="recipe.description" required></textarea>

      <label>Temps de préparation (en minutes)</label>
      <input type="number" v-model.number="recipe.temps_preparation" required />

      <label>Temps de cuisson (en minutes)</label>
      <input type="number" v-model.number="recipe.temps_cuisson" required />

      <label>Portions</label>
      <input type="number" v-model.number="recipe.portions" required />

      <label>Régime</label>
      <select v-model="recipe.regime">
        <option>Omnivore</option>
        <option>Végétarien</option>
        <option>Végétalien</option>
        <option>Pescétarien</option>
        <option>Flexitarien</option>
        <option>Fruitarien</option>
        <option>Crudivore</option>
        <option>Paleo</option>
        <option>Cétogène</option>
        <option>Sans gluten</option>
      </select>

      <label>Image (URL)</label>
      <input v-model="recipe.image" />

      <label>Ingrédients (nom, quantité, unité)</label>
      <div v-for="(ingredient, index) in recipe.ingredients" :key="index">
        <input v-model="ingredient.nom" placeholder="Nom" required />
        <input v-model="ingredient.quantité" placeholder="Quantité" required />
        <input v-model="ingredient.unité" placeholder="Unité" />
      </div>
      <button @click.prevent="addIngredient">+ Ajouter un ingrédient</button>

      <label>Instructions</label>
      <div v-for="(instruction, index) in recipe.instructions" :key="index">
        <textarea v-model="recipe.instructions[index]" required></textarea>
      </div>
      <button @click.prevent="addInstruction">+ Ajouter une instruction</button>

      <button type="submit">Mettre à jour la recette</button>
    </form>
    <p v-else>Chargement de la recette...</p>
  </div>
</template>

<script>
export default {
  name: 'EditRecipe',
  data() {
    return {
      recipe: null,
      currentUser: null
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await fetch(`http://localhost:3000/recipes/${id}`);
      const data = await res.json();
      this.recipe = data;
      const userData = localStorage.getItem("loggedUser");
      if (userData) this.currentUser = JSON.parse(userData);
    } catch (error) {
      console.error("Erreur de chargement de la recette :", error);
    }
  },
  methods: {
    async updateRecipe() {
      try {
        const res = await fetch(`http://localhost:3000/recipes/${this.recipe.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.recipe)
        });

        if (!res.ok) throw new Error('Erreur de mise à jour');

        this.$router.push(`/recipes/${this.recipe.id}`);
      } catch (err) {
        console.error(err);
      }
    },
    addIngredient() {
      this.recipe.ingredients.push({ nom: '', quantité: '', unité: '' });
    },
    addInstruction() {
      this.recipe.instructions.push('');
    }
  }
};
</script>

<style scoped>
.edit-recipe {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
label {
  display: block;
  margin-top: 15px;
}
input, textarea, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  margin-top: 10px;
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
