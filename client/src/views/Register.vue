<template>
  <div
    class="register d-flex flex-row justify-content-center align-items-center"
  >
    <div class="container-register-form">
      <div class="title">
        <h3 class="text-center mt-4">Cadastro de Cliente Novo</h3>
      </div>

      <div class="content">
        <form>
          <div class="user-details">
            <div
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <v-text-field
                class="col-6 m-1"
                v-model="newClient.nome"
                type="text"
                placeholder="Nome"
                required
              />

              <div class="col-6 m-1">
                <span class="details">Data de Nascimento</span>
                <v-text-field v-model="newClient.birth" type="date" required />
              </div>
            </div>

            <div
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <v-text-field
                class="col-6 m-1"
                v-model="newClient.email"
                type="text"
                placeholder="Email"
                required
              />

              <v-text-field
                class="col-6 m-1"
                v-model="newClient.phone"
                type="tel"
                placeholder="Celular"
                required
              />
            </div>

            <div
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <v-text-field
                class="col-6 m-1"
                v-model="newClient.cpf"
                type="number"
                placeholder="CPF"
                required
              />

              <v-select
                class="col-6 m-1"
                label="Horário"
                :items="['Manhã', 'Tarde', 'Noite']"
                id="selest-time"
                v-model="newClient.horario"
              >
              </v-select>
            </div>

            <div
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <v-select
                class="col-6 m-1"
                label="Gênero"
                :items="['Masculino', 'Feminino', 'Prefiro não dizer']"
                v-model="newClient.genero"
              ></v-select>

              <v-combobox
                class="col-6 m-1"
                label="Curso"
                :items="['Jiu-Jitsu', 'Musculação', 'Box', 'Hit-Box']"
                clearable
                v-model="newClient.curso"
              ></v-combobox>
            </div>

            <div
              class="d-flex flex-row justify-content-center align-items-center"
            >
              <div class="col-6 bolsista">
                <input
                  v-model="newClient.bolsa"
                  type="checkbox"
                  name="bolsa"
                  id="bolsa"
                />
                <label for="bolsa">Bolsista</label>
              </div>

              <div class="col-6 m-1">
                <v-text-field
                  label="Endereço"
                  v-model="newClient.address"
                ></v-text-field>
              </div>
            </div>
          </div>

          <div class="button">
            <v-btn
              block
              variant="flat"
              color="success"
              @click="
                register();
                resetForm();
              "
            >
              Cadastrar
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
  <alert ref="alert" />
</template>

<script>
import Alert from "@/components/Alert.vue";
import axios from "axios";
import ip from "../ip.js";

export default {
  name: "CadastroClientes",

  components: { Alert },

  data() {
    return {
      newClient: {
        nome: "",
        email: "",
        cpf: null,
        birth: "",
        phone: null,
        horario: "",
        genero: "",
        bolsa: false,
        address: "",
        curso: "",
      },
    };
  },

  methods: {
    register() {
      if (
        !this.newClient.nome ||
        !this.newClient.email ||
        !this.newClient.cpf ||
        !this.newClient.birth ||
        !this.newClient.phone ||
        !this.newClient.horario ||
        !this.newClient.genero ||
        !this.newClient.address ||
        !this.newClient.curso
      ) {
        return this.$refs.alert.mostrarAlerta(
          "danger",
          "warning",
          "Sucesso",
          "Todos os campos devems er preenchidos"
        );
      }

      axios
        .post(`${ip}/register-client`, this.newClient)
        .then((response) => {
          return this.$refs.alert.mostrarAlerta(
            "success",
            "done_outline",
            "Sucesso",
            response.data
          );
        })
        .catch((error) => {
          console.error("Erro ao cadastrar cliente: ", error);
        });
    },

    resetForm() {
      this.newClient = {
        nome: "",
        email: "",
        cpf: null,
        birth: "",
        phone: null,
        horario: "",
        genero: "",
        bolsa: false,
        address: "",
        curso: "",
      };
    },
  },
};
</script>

<style scoped>
.container-register-form {
  width: 600px;
}

.container-register-form {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 30px 0;
}

.bolsista {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
