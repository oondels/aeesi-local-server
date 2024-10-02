<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <i
        role="button"
        v-bind="activatorProps"
        class="register-item material-symbols-outlined"
      >
        add_shopping_cart
      </i>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Cadastro">
        <v-card-text>
          <div class="row col-12">
            <div class="col-6">
              <v-text-field v-model="newItem.name" label="Nome"></v-text-field>
              <v-combobox
                v-model="newItem.category"
                :items="['Comida', 'Bebida', 'Água']"
                label="Categoria"
              ></v-combobox>

              <v-text-field
                v-model="newItem.description"
                label="Descrição"
              ></v-text-field>

              <v-text-field
                type="number"
                v-model="newItem.costPrice"
                label="Preço de Compra"
              ></v-text-field>
            </div>

            <div class="col-6">
              <v-text-field
                type="number"
                v-model="newItem.sellingPrice"
                label="Preço de Venda"
              ></v-text-field>

              <v-text-field
                type="number"
                v-model="newItem.minStock"
                label="Estoque Mínimo"
              ></v-text-field>

              <v-text-field
                type="date"
                v-model="newItem.validity"
                label="Validade"
              ></v-text-field>

              <v-text-field
                v-model="newItem.supplier"
                label="Fornecedor"
              ></v-text-field>
            </div>

            <v-btn @click="registerItem" color="success">Salvar</v-btn>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Fechar" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from "axios";
import ip from "../../ip.js";

export default {
  name: "CadastroItems",

  data() {
    return {
      allProducts: {},

      newItem: {
        name: "",
        category: "",
        description: "",
        costPrice: null,
        sellingPrice: null,
        minStock: null,
        validity: "",
        supplier: "",
      },
    };
  },

  mounted() {},

  methods: {
    registerItem() {
      if (
        !this.newItem.name ||
        !this.newItem.category ||
        !this.newItem.description ||
        !this.newItem.costPrice ||
        !this.newItem.sellingPrice ||
        !this.newItem.minStock ||
        !this.newItem.validity ||
        !this.newItem.supplier
      ) {
        return console.log("Cadastre todos os dados!");
      }

      axios
        .post(`${ip}/registerItem`, this.newItem)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Erro ao cadastrar item: ", error);
        });

      this.newItem = {
        name: "",
        category: "",
        description: "",
        costPrice: null,
        sellingPrice: null,
        minStock: null,
        validity: "",
        supplier: "",
      };
    },
  },
};
</script>

<style scoped>
.register-item {
  background-color: #61cf21;
  padding: 10px;
  border-radius: 50%;
  color: #fff;
  font-size: 25px;
  transition: all ease-in-out 0.2s;
}

.register-item:hover {
  background-color: rgb(90, 194, 30);
  transform: scale(1.03);
}
</style>
