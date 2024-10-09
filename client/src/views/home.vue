<template>
  <div class="container-home">
    <div class="home-title"></div>
    <div class="aplicacoes">
      <router-link class="card-app" to="/register">
        <h4>Cadastro de Clientes</h4>
        <p>Gerencie o cadastro de seus clientes.</p>
        <img src="/img/aplications/register.png" alt="Cadastro de Clientes" />
      </router-link>

      <router-link to="/academy_clients">
        <div class="m-3 card-app">
          <h4>Ver Clientes</h4>
          <p>Acesse a lista de clientes cadastrados.</p>
          <img src="/img/aplications/clients.png" alt="Ver Clientes" />
        </div>
      </router-link>

      <!-- <router-link to="/loja">
        <div class="m-3 card-app">
          <h4>Loja</h4>
          <p>Explore nosso catálogo de produtos.</p>
          <img src="/img/aplications/store.png" alt="Loja" />
        </div>
      </router-link> -->
    </div>
  </div>
</template>

<style scoped>
.container-home {
  height: 100vh;
  background: linear-gradient(to right, #f7f7f7, #e6e6e6);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.aplicacoes {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 20px;
}

.card-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 10px;
}

.card-app:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

a {
  text-decoration: none;
  color: #2c3e50;
  text-align: center;
}

a img {
  width: 70px;
  margin-top: 10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 0.8rem;
}
</style>
