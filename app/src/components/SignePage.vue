<template>
  <div class="signup-container">
    <h2>Créer un compte</h2>
    <form @submit.prevent="handleSignup">
      <input v-model="fullName" type="text" placeholder="Nom complet" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="photoURL" type="text" placeholder="URL de la photo de profil" />
      
      <select v-model="regime" required>
        <option disabled value="">Choisissez un régime</option>
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

      <button type="submit">S'inscrire</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      email: '',
      username: '',
      photoURL: '',
      regime: '',
      successMessage: ''
    };
  },
  methods: {
    async handleSignup() {
      const newUser = {
        fullName: this.fullName,
        email: this.email,
        username: this.username,
        photoURL: this.photoURL,
        regime: this.regime,
        id: `userID_${Date.now()}` // simple ID unique
      };

      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        if (response.ok) {
          this.successMessage = 'Inscription réussie !';
          localStorage.setItem('loggedUser', JSON.stringify(newUser));
          this.$router.push('/');
          this.fullName = this.email = this.username = this.photoURL = this.regime = '';
        } else {
          alert("Erreur lors de l'inscription");
        }
      } catch (error) {
        alert('Erreur de connexion au serveur.');
        console.error(error);
      }
    }
  }
};
</script>
<style>
.signup-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background: #f7f7f7;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.signup-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.signup-container input,
.signup-container select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.signup-container button {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}
</style>
