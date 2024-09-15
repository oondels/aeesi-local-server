<template>
  <div
    class="header d-flex justify-content-center flex-column align-items-center"
  >
    <div>
      <h1 class="text-center">Loja AEESI</h1>
      <div class="search">
        <input placeholder="Pesquisar" />
        <i role="button" class="ml-3 material-symbols-outlined"> search </i>
      </div>
    </div>
  </div>
  <div
    class="main d-flex justify-content-center flex-column align-items-center"
  >
    <div class="bipar-product">
      <h3>Compre Rapidamente</h3>
      <v-text-field
        v-model="barCode"
        type="number"
        label="Bipar"
        @keyup="buyProduct"
      ></v-text-field>
    </div>

    <div class="products-list">
      <CompraItems
        :class="'product-' + item.id"
        v-for="item in allProducts"
        :key="item.id"
        :product="item"
      />
    </div>
    <div>
      <CadastroItems />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ip from "../ip.js";
import CadastroItems from "./Loja/CadastroItems.vue";
import CompraItems from "./Loja/CompraItems.vue";

export default {
  name: "Loja",

  components: {
    CompraItems,
    CadastroItems,
  },

  data() {
    return {
      allProducts: {},
      barCode: null,
    };
  },

  mounted() {
    this.getAllProducts();
  },

  methods: {
    getAllProducts() {
      axios
        .get(`http://${ip}:2399/getAllProducts`)
        .then((response) => {
          this.allProducts = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar produtos: ", error);
        });
    },

    buyProduct() {
      const paymentData = {
        payment_method_id: "pix",
        email: "email@gmail.com",
        identification: "cpf",
        identificationValue: "04894714558",
        barCode: this.barCode,
      };

      if (this.barCode) {
        axios
          .post(`http://${ip}:2399/payment/pix-payment-barcode`, {
            data: {
              paymentData: paymentData,
            },
          })
          .then((response) => {
            this.loading = false;

            console.log(response.data);
            this.paymentInfo = response.data.id;
            this.qrCode =
              response.data.point_of_interaction.transaction_data.ticket_url;

            setTimeout(() => {
              this.checkPayment = true;
            }, 500);
          })
          .catch((error) => {
            console.error("Erro interno no servidor: ", error);
          });
      }
    },
  },
};
</script>

<style>
.main {
  background-color: #fff;
  width: 100%;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(50, 50, 50, 0.3);
}

.products-list {
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.header {
  background-color: #4b4b4b;
  padding: 20px;
  width: 100%;
  position: relative;
}

.header img {
  width: 100px;
  position: absolute;
  left: 1%;
}

.header h1 {
  color: #fff;
}
.search {
  display: grid;
  grid-template-columns: 700px 200px;
  grid-template-rows: 60px;
  background-color: #fff;
  border-radius: 8px 0 0 8px;
  width: 900px;
}

.search input {
  grid-column: 1;
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  font-size: 16px;
  color: #333;
  outline: none;
}

.search i {
  grid-column: 2;
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(97, 207, 33);
  font-size: 34px;
  height: 100%;
}
</style>
