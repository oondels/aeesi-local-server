<template>
  <div>
    <nav>
      <i role="button" @click="menu = !menu" class="material-symbols-outlined">
        menu
      </i>
      <div :class="menu ? 'show' : 'hidden'" id="menu-links">
        <router-link class="apps" to="/" exact-active-class="active">
          Apps
        </router-link>
        <router-link to="/academy_clients" exact-active-class="active">
          Clientes
        </router-link>
        <router-link to="/register" exact-active-class="active">
          Cadastro
        </router-link>
        <router-link to="/loja" exact-active-class="active">Loja</router-link>
        <router-link to="/dashboard" exact-active-class="active">
          Dashboard
        </router-link>
      </div>
    </nav>
    <router-view />
    <footer class="footer">
      <p>
        © 2024 AEESI - Todos os direitos reservados. Desenvolvido por
        <a href="hendriusfelix.com">Hendrius Félix</a>
      </p>
    </footer>
  </div>
</template>

<script>
import "./assets/main.css";

export default {
  name: "App",

  data() {
    return {
      menu: false,
    };
  },

  methods: {},
};
</script>

<style>
nav {
  padding: 1rem;
  background-color: #232325;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #42b983;
}

nav i {
  color: #42b983 !important;
  font-size: 2rem;
  cursor: pointer;
  display: none !important;
}

nav a {
  margin-right: 1.5rem;
  text-decoration: none;
  color: #fff;
  background-color: transparent;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.active {
  position: relative;
}

.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #42b983;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

nav a:hover {
  background-color: #42b983;
  color: #232325;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

nav a:last-child {
  margin-right: 0;
}

nav i:hover {
  transform: scale(1.1);
  transition: 0.2s ease;
}

.footer {
  margin-top: auto;
  padding: 20px;
  width: 100%;
  text-align: center;
  color: #fff;
  background: #232325;
}

.footer a {
  text-decoration: none;
  color: #42b983;
}

@media screen and (max-width: 768px) {
  nav i {
    display: block !important;
  }

  #menu-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #232325;
    z-index: 2;
  }

  #menu-links.show {
    display: flex;
  }

  nav a {
    margin: 1rem 0;
    width: 100%;
    text-align: center;
  }
}
</style>
