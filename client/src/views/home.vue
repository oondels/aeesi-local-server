<template>
  <div class="container-home">
    <div class="home-title">
      <h1 class="text-center">Central de aplicações AEESI.</h1>
    </div>
    <div class="aplicacoes">
      <div class="m-3 card-app">
        <router-link to="/register">
          <h4>Cadastro de Clientes</h4>
          <img src="/img/aplications/register.png" alt="" />
        </router-link>
      </div>

      <div class="m-3 card-app">
        <router-link to="/academy_clients">
          <h4>Ver Clientes</h4>
          <img src="/img/aplications/clients.png" alt="" />
        </router-link>
      </div>

      <div class="m-3 card-app">
        <router-link to="/loja">
          <h4>Loja</h4>
          <img src="/img/aplications/store.png" alt="" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container-home {
  height: 100vh;
}

.aplicacoes {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-app {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 250px;
  height: 100px;
  background-color: rgb(255, 255, 255);
  padding: 8px;
  border-radius: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
}

.card-app:hover {
  box-shadow: none;
}

.card-app a {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
}

.card-app a img {
  width: 50px;
}
</style>
