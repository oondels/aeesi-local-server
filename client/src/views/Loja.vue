<template>
  <div
    class="header d-flex justify-content-center flex-column align-items-center"
  >
    <div class="title-search">
      <CadastroItems />
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
      <!-- <h3>Compre Rapidamente</h3> -->

      <CadastroItems />

      <!-- <v-text-field
        v-model="barCode"
        type="number"
        label="Bipar"
        @keyup="buyProduct"
      ></v-text-field> -->
    </div>

    <div v-if="loadingProducts" class="products-list">
      <CompraItems v-for="item in allProducts" :key="item.id" :product="item" />
    </div>

    <div v-else class="loading-data">
      <v-progress-circular
        indeterminate
        color="success"
        :size="150"
        width="18"
      ></v-progress-circular>
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

      loadingProducts: false,
    };
  },

  mounted() {
    this.getAllProducts();
    setTimeout(() => {
      this.loadingProducts = true;
    }, 1500);
  },

  methods: {
    getAllProducts() {
      axios
        .get(`${ip}/getAllProducts`)
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
          .post(`${ip}/payment/pix-payment-barcode`, {
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

<style scoped>
.main {
  background-color: #f9f9f9;
  width: 100%;
  padding: 40px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.products-list {
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
}

.header {
  background-color: #343a40;
  padding: 30px;
  width: 100%;
  text-align: center;
}

.header h1 {
  color: #fff;
  font-size: 36px;
  letter-spacing: 1px;
}

.search {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  margin-top: 20px;
  padding: 0 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search input {
  flex: 1;
  padding: 15px;
  border: none;
  font-size: 18px;
  color: #555;
  outline: none;
  background-color: transparent;
}

.search i {
  color: #fff;
  background-color: #61cf21;
  border-radius: 50%;
  padding: 12px;
  font-size: 24px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search i:hover {
  background-color: #4ba918;
}

.bipar-product h3 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
}

.v-text-field {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.products-list {
  margin-top: 30px;
}

@media (max-width: 768px) {
  .products-list {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .search {
    flex-direction: column;
    width: 100%;
  }

  .search input {
    margin-bottom: 10px;
  }
}
</style>
