<template>
  <div class="add-recipe">
    <h2>Ajouter une Recette</h2>

    <form @submit.prevent="submitRecipe">
      <input v-model="recipe.nom" type="text" placeholder="Nom de la recette" required />
      <textarea v-model="recipe.description" placeholder="Description" required></textarea>
      <input v-model.number="recipe.temps_preparation" type="number" placeholder="Temps de préparation (min)" required />
      <input v-model.number="recipe.temps_cuisson" type="number" placeholder="Temps de cuisson (min)" required />
      <input v-model.number="recipe.portions" type="number" placeholder="Nombre de portions" required />
      <input v-model="recipe.image" type="text" placeholder="URL de l'image" required />
      <select v-model="recipe.regime" required>
        <option disabled value="">Sélectionnez un régime</option>
        <option v-for="cat in categories" :key="cat.name" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>

      <div>
        <label>Ingrédients :</label>
        <div v-for="(ingredient, index) in recipe.ingredients" :key="index">
          <input v-model="ingredient.nom" placeholder="Nom" />
          <input v-model="ingredient.quantité" placeholder="Quantité" />
          <input v-model="ingredient.unité" placeholder="Unité" />
        </div>
        <button type="button" @click="addIngredient">Ajouter un ingrédient</button>
      </div>

      <div>
        <label>Instructions :</label>
        <div v-for="(instruction, index) in recipe.instructions" :key="index">
          <input v-model="recipe.instructions[index]" placeholder="Étape" />
        </div>
        <button type="button" @click="addInstruction">Ajouter une instruction</button>
      </div>

      <button type="submit">Publier</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUser: null,
      recipe: {
        nom: "",
        description: "",
        temps_preparation: 0,
        temps_cuisson: 0,
        portions: 1,
        regime: "",
        image: "",
        ingredients: [],
        instructions: [],
        tags: [],
        authorID: "",
        nbrComments: 0
      },
      categories: []
    };
  },
  created() {
    const userData = localStorage.getItem("loggedUser");
    if (!userData) {
      this.$router.push("/login");
    } else {
      this.currentUser = JSON.parse(userData);
      this.recipe.authorID = this.currentUser.id;
      this.fetchCategories();
    }
  },
  methods: {
    fetchCategories() {
      fetch("http://localhost:3000/categories")
        .then((res) => res.json())
        .then((data) => {
          this.categories = data;
        });
    },
    addIngredient() {
      this.recipe.ingredients.push({ nom: "", quantité: "", unité: "" });
    },
    addInstruction() {
      this.recipe.instructions.push("");
    },
    submitRecipe() {
      fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.recipe)
      })
        .then((res) => res.json())
        .then(() => {
          alert("Recette ajoutée !");
          this.$router.push("/recipes");
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de l'ajout.");
        });
    }
  }
};
</script>

<style scoped>
.add-recipe {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
input,
textarea,
select {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  padding: 6px;
}
button {
  margin-top: 10px;
}
</style>
