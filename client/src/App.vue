<template>
  <div>
    <h1>Aeesi</h1>
    <button @click="TesteNames">Click me</button>
    <div class="names" v-for="(name, nameIndex) in names" :key="nameIndex">
      {{ name }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ip from "../../ip";

export default {
  name: "App",
  components: {},

  data() {
    return {
      names: null,
    };
  },

  methods: {
    TesteNames() {
      axios
        .get(`${ip}/user`)
        .then((response) => {
          this.names = response.data.names;
        })
        .catch((error) => {
          console.error("Erro ao se comunicar com servidor: ", error);
        });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
