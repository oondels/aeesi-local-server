<template>
  <div class="container-home">
    <div class="home-title">
      <h1>Central de aplicações AEESI.</h1>
    </div>
    <div class="aplicacoes">
      <div class="card-app">
        <router-link to="/register">
          <h4>Cadasatro de Clientes</h4>
          <img src="/img/aplications/register.png" alt="" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.aplicacoes {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-app {
  width: 200px;
  background-color: rgb(255, 255, 255);
  padding: 8px;
  border-radius: 1.2rem;
  cursor: pointer;
  transition: all 1s ease;
}

.card-app a {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
}

.card-app a img {
  width: 90px;
}
</style>
