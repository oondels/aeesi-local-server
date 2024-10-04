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
          </tr>
        </thead>

        <tbody v-if="clientsFiltered">
          <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <tr
                v-for="(client, clientIndex) in clientsFiltered"
                :key="clientIndex"
                v-bind="activatorProps"
                @click="getClientPaymentHistory(client.id)"
              >
                <td>{{ client.name }}</td>
                <td>{{ client.course }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.phone }}</td>
                <td>
                  {{
                    convertAge(client.birth) ? convertAge(client.birth) : "--"
                  }}
                  anos
                </td>
                <td>{{ client.bolsista ? "Sim" : "Não" }}</td>
              </tr>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-text>
                  <div class="card mb-3">
                    <div class="card-header">
                      <h5 class="text-center">Histórico de Pagamentos</h5>
                    </div>
                    <div class="card-body">
                      <table class="table custom-table">
                        <thead>
                          <tr>
                            <th>Mês</th>
                            <th>Ano</th>
                            <th>Status de Pagamento</th>
                            <th>Ação</th>
                          </tr>
                        </thead>
                        <tbody v-if="clientHistory">
                          <tr
                            v-for="history in clientHistory"
                            :key="history.id"
                          >
                            <td>{{ history.mes_pagamento }}</td>
                            <td>{{ history.ano_pagamento }}</td>
                            <td>
                              <span
                                :class="{
                                  'badge bg-success': history.payment_status,
                                  'badge bg-danger': !history.payment_status,
                                }"
                              >
                                {{
                                  history.payment_status ? "Pago" : "Não Pago"
                                }}
                              </span>
                            </td>
                            <td>
                              <v-dialog max-width="500">
                                <template
                                  v-slot:activator="{ props: activatorProps }"
                                >
                                  <v-btn
                                    v-bind="activatorProps"
                                    color="success"
                                    text="Registrar Pagamento"
                                    variant="outlined"
                                  ></v-btn>
                                </template>

                                <template v-slot:default="{ isActive }">
                                  <v-card title="Dialog">
                                    <v-card-text>
                                      <p>
                                        Coloque o valor que deseja registrar
                                      </p>
                                      <v-text-field
                                        v-model="paymentValueRegister"
                                        label="Valor"
                                      />
                                    </v-card-text>

                                    <v-card-actions>
                                      <v-spacer></v-spacer>

                                      <v-btn
                                        text="Fechar"
                                        @click="isActive.value = false"
                                      ></v-btn>

                                      <v-btn
                                        v-if="!history.payment_status"
                                        @click="
                                          registerPayment(
                                            history.client_id,
                                            history.mes_pagamento,
                                            paymentValueRegister
                                          )
                                        "
                                        color="success"
                                        variant="outlined"
                                      >
                                        Pagar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </template>
                              </v-dialog>
                            </td>
                          </tr>
                        </tbody>

                        <div v-else class="loading-data">
                          <v-progress-circular
                            a
                            indeterminate
                            color="success"
                            :size="150"
                            width="18"
                          ></v-progress-circular>
                        </div>
                      </table>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text="Fechar" @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </tbody>

        <div v-else class="loading-data">
          <v-progress-circular
            a
            indeterminate
            color="success"
            :size="150"
            width="18"
          ></v-progress-circular>
        </div>
      </table>
    </div>
  </div>
  <alert ref="alert" />
</template>

<script>
import Alert from "@/components/Alert.vue";
import axios from "axios";
import ip from "../ip.js";

export default {
  name: "Clients",

  components: {
    Alert,
  },

  data() {
    return {
      clients: null,
      clientsFiltered: null,
      selectedClient: "",
      selectedCourse: "",

      paymentValueRegister: null,

      clientHistory: null,

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

    getClientPaymentHistory(id) {
      axios
        .get(`${ip}/get-client-payment-history/${id}`)
        .then((response) => {
          this.clientHistory = response.data;
          // console.log(this.clientHistory);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    registerPayment(clientId, month, value) {
      console.log(clientId, month, value);
      axios
        .post(`${ip}/payment/register-payment`, {
          clientId,
          month,
          value,
        })
        .then((response) => {
          this.$refs.alert.mostrarAlerta(
            "success",
            "done_outline",
            "Sucesso",
            response.data
          );

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          console.error(`Erro ao registrar pagamento: ${error}`);
          return this.$refs.alert.mostrarAlerta(
            "danger",
            "warning",
            "Sucesso",
            error.response.data
          );
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
        .then(() => {})
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

.loading-data {
  position: fixed;
  left: 50%;
  top: 50%;
}

/* Tabela */
.table-responsive {
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
  background-color: white;
  border-radius: 10px;
}

.custom-table thead th {
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  padding: 15px;
  text-align: center;
}

.custom-table tbody tr {
  transition: background-color 0.3s ease;
}

.custom-table tbody td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #494848;
  font-size: 16px;
}

.badge {
  font-size: 14px;
  padding: 8px 15px;
  border-radius: 50px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

.badge.bg-success {
  background-color: #28a745;
}

.badge.bg-danger {
  background-color: #dc3545;
}

@media (max-width: 768px) {
  .custom-table thead {
    display: none;
  }

  .custom-table tbody td {
    display: block;
    text-align: right;
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
    position: relative;
  }

  .custom-table tbody td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    top: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .custom-table tbody tr {
    display: block;
    margin-bottom: 10px;
    background-color: white;
  }

  .custom-table tbody tr:hover {
    background-color: transparent;
  }
}
</style>
