<template>
  <div class="nav-bar">
    <nav>
      <router-link to="/">Home</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
import "./assets/main.css";

export default {
  name: "App",
};
</script>

<style>
nav {
  padding: 1rem;
  background-color: #f5f5f5;
  text-align: center;
}
nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #42b983;
  transition: all 0.3s ease;
}

nav a:hover {
  color: black;
}
</style>
