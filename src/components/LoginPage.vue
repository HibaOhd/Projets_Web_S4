<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <button type="submit">Se connecter</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      username: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await fetch(`http://localhost:3000/users?email=${this.email}&username=${this.username}`);
        const users = await res.json();

        if (users.length > 0) {
          const user = users[0];
          // Simuler une connexion : stocker dans localStorage
          localStorage.setItem('loggedUser', JSON.stringify(user));
          this.$router.push('/');
        } else {
          this.errorMessage = 'Email ou nom d’utilisateur incorrect.';
        }
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Erreur de connexion au serveur.';
      }
    }
  }
};
</script>
<style>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background: #f5f5f5;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.login-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>