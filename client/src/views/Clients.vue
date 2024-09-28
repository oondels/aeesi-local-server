<template>
  <div class="container-clients">
    <div class="container-table">
      <h4>Clientes da Academia</h4>
      <table class="content-table">
        <thead>
          <tr class="title-table">
            <th>
              <v-combobox
                v-model="selectedClient"
                :items="clientsNames[0]"
                label="Nome"
                @update:model-value="filterClients()"
                clearable
              ></v-combobox>
            </th>
            <th>
              <v-combobox
                v-model="selectedCourse"
                :items="courses"
                label="Curso"
                @update:model-value="filterClients()"
              ></v-combobox>
            </th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Idade</th>
            <th>Bolsista</th>
            <th>Pagamento</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(client, clientIndex) in clientsFiltered"
            :key="clientIndex"
          >
            <td>{{ client.name }}</td>
            <td>{{ client.course }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone }}</td>
            <td>
              {{ convertAge(client.birth) ? convertAge(client.birth) : "--" }}
              anos
            </td>
            <td>{{ client.bolsista ? "Sim" : "Não" }}</td>
            <td>
              {{
                (client.monthly_payment_status = "pendind"
                  ? "Não realizado"
                  : "Realizado")
              }}
            </td>
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
      clientsFiltered: null,
      selectedClient: "",
      selectedCourse: "",

      courses: [],
      clientsNames: [],
    };
  },

  mounted() {
    this.getClients();
    this.filterClients();
    this.checkDate();
  },

  methods: {
    getClients() {
      axios
        .get(`${ip}/get-academy-clients`)
        .then((response) => {
          this.clients = response.data;
          this.filterClients();

          this.courses = [
            ...new Set(response.data.map((course) => course.course)),
          ];

          this.clientsNames = [response.data.map((course) => course.name)];
        })
        .catch((error) => {
          console.log("Error ao consultar servidor:", error);
        });
    },

    convertAge(birth) {
      const [day, month, year] = birth.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      const date = new Date(formattedDate);
      const currenteDate = new Date();

      return currenteDate.getFullYear() - date.getFullYear();
    },

    filterClients() {
      this.selectedCourse = "";
      if (this.selectedClient) {
        return (this.clientsFiltered = this.clients.filter((client) => {
          return (
            client.name === this.selectedClient &&
            (this.courses = [client.course])
          );
        }));
      }

      if (this.selectedCourse) {
        return (this.clientsFiltered = this.clients.filter((client) => {
          return client.course === this.selectedCourse;
        }));
      }

      return (this.clientsFiltered = this.clients);
    },

    checkDate() {
      axios
        .put(`${ip}/reset-payment-status`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.container-clients {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  height: 100vh;
}

.container-table {
  height: 100%;
  max-height: 600px;
  width: fit-content;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.filter-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
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

.content-table thead .title-table {
  background-color: #009879;
  color: #fff;
  text-align: left;
  font-weight: bold;
}

.content-table tbody tr:hover {
  color: #009879;
  cursor: pointer;
}

.content-table th,
.content-table td {
  padding: 12px 15px;
}

.content-table tbody tr:nth-of-type(even) {
  background-color: #ffffff;
}

.content-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
</style>
