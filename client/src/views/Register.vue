<template>
  <div class="register">
    <div class="container-register-form">
      <div class="title">Cadastro de Cliente Novo</div>
      <div class="content">
        <form action="#">
          <div class="user-details">
            <div class="input-box">
              <span class="details">Nome</span>

              <input
                v-model="newClient.nome"
                type="text"
                placeholder="Nome"
                required
              />
            </div>

            <div class="input-box">
              <span class="details">Data de Nascimento</span>
              <input
                v-model="newClient.birth"
                type="date"
                placeholder="Enter your username"
                required
              />
            </div>

            <div class="input-box">
              <span class="details">Email</span>
              <input
                v-model="newClient.email"
                type="text"
                placeholder="Email"
                required
              />
            </div>

            <div class="input-box">
              <span class="details">Número de Telefone</span>
              <input
                v-model="newClient.phone"
                type="tel"
                placeholder="Celular"
                required
              />
            </div>

            <div class="input-box">
              <span class="details">Cpf</span>
              <input
                v-model="newClient.cpf"
                type="number"
                placeholder="CPF"
                required
              />
            </div>

            <div class="input-box">
              <span class="details">Horário de Treino</span>
              <v-select
                label="Horário"
                :items="['Manhã', 'Tarde', 'Noite']"
                id="selest-time"
                v-model="newClient.horario"
              >
              </v-select>
            </div>

            <div class="input-box">
              <v-select
                label="Gênero"
                :items="['Masculino', 'Feminino', 'Prefiro não dizer']"
                v-model="newClient.genero"
              ></v-select>
            </div>

            <div class="input-box">
              <v-combobox
                label="Curso"
                :items="['Jiu-Jitsu', 'Musculação', 'Box', 'Hit-Box']"
                clearable
                v-model="newClient.curso"
              ></v-combobox>
            </div>

            <div class="checkbox-container">
              <input
                v-model="newClient.bolsa"
                type="checkbox"
                name="bolsa"
                id="bolsa"
              />
              <label for="bolsa">Bolsista</label>
            </div>

            <div class="input-box">
              <v-text-field
                label="Endereço"
                v-model="newClient.address"
              ></v-text-field>
            </div>
          </div>

          <div class="button">
            <v-btn
              @click="
                register();
                resetForm();
              "
              >Cadastrar</v-btn
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ip from "../ip.js";

export default {
  name: "CadastroClientes",

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
        return alert("Todos os campos devem ser preenchidos");
      }

      axios
        .post(`${ip}:2399/register-client`, this.newClient)
        .then((response) => {
          alert(response.data);
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

.register {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f9;
  padding: 20px;
}

.container-register-form {
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
}

.container-register-form .title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
}

.container-register-form .title::after {
  content: "";
  width: 50px;
  height: 3px;
  background-color: #61cf21;
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.content form .user-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

form .input-box {
  position: relative;
}

form .input-box span.details {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.user-details .input-box input,
.user-details .input-box v-text-field {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border 0.3s ease;
}

.user-details .input-box input:focus {
  border-color: #61cf21;
}

.user-details .input-box input::placeholder {
  color: #aaa;
}

.checkbox-container {
  grid-column: span 2;
  display: flex;
  align-items: center;
}

.checkbox-container input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  margin-right: 10px;
}

.checkbox-container input[type="checkbox"]:checked {
  background-color: #61cf21;
  border-color: #61cf21;
}

.checkbox-container input[type="checkbox"]:checked::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 7px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container label {
  font-size: 16px;
  color: #333;
}

.button {
  grid-column: span 2;
  margin-top: 30px;
  text-align: center;
}

.button v-btn {
  background-color: #61cf21;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button v-btn:hover {
  background-color: #4ba918;
}

@media (max-width: 768px) {
  .content form .user-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .container-register-form {
    padding: 20px;
  }

  .container-register-form .title {
    font-size: 20px;
  }

  .button v-btn {
    font-size: 14px;
    padding: 10px 15px;
  }
}
</style>
