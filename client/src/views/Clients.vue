<template>
  <div class="container-clients">
    <div class="container-table">
      <h4>Clientes da Academia</h4>
      <table class="content-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Curso</th>
            <th>Email</th>
            <th>Bolsista</th>
            <th>Telefone</th>
            <th>Idade</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(client, clientIndex) in clients" :key="clientIndex">
            <td>{{ client.name }}</td>
            <td>{{ client.course }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone }}</td>
            <td>{{ client.birth }}</td>
            <td>{{ client.bolsista }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ip from "../ip.js";

export default {
  name: "Clients",

  data() {
    return {
      clients: null,
    };
  },

  mounted() {
    this.getClients();
  },

  methods: {
    getClients() {
      axios
        .get(`http://${ip}:2399/get-academy_clients`)
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.log("Error ao consultar servidor:", error);
        });
    },
  },
};
</script>

<style scoped>
:root {
  --text-main-color: #;
}

.container-clients {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-table {
  height: 100%;
  max-height: 600px;
  width: fit-content;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.container-table h4 {
  text-align: center;
  padding-top: 20px;
  font-size: 18px;
}

.content-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  min-width: 400px;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}

.content-table thead tr {
  background-color: #009879;
  color: #fff;
  text-align: left;
  font-weight: bold;
}

.content-table tbody tr:hover {
  font-weight: bold;
  color: #009879;
  cursor: pointer;
}

.content-table th,
.content-table td {
  padding: 12px 15px;
}
/* .content-table tbody tr {
  border: 1px solid #ff0000;
} */

.content-table tbody tr:nth-of-type(even) {
  background-color: #ffffff;
}

.content-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
</style>
