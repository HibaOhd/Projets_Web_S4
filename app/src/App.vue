<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fff;
  color: #333;
}

a {
  text-decoration: none;
  color: #007BFF;
}

a:hover {
  text-decoration: underline;
}
</style>
