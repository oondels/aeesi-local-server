<template>
  <div class="container">
    <v-card class="product-info mx-auto" max-width="344">
      <v-img
        height="200px"
        :src="require(`@/assets/img/loja/${product.image}.jpg`)"
        cover
      ></v-img>

      <v-card-title> {{ product.name }} </v-card-title>

      <v-card-subtitle> {{ product.description }} </v-card-subtitle>

      <v-card-actions>
        <v-dialog max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              color="success"
              text="Comprar"
              @click="
                (loading = true),
                  buyProduct(product.id, product.name, product.selling_price)
              "
            ></v-btn>
            <v-btn v-if="loading || qrCode" v-bind="activatorProps"
              >Mostrar Qr-COde
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card :title="product.name">
              <v-card-text class="d-flex flex-column">
                <div
                  v-if="checkPayment"
                  class="d-flex flex-row justify-content-center align-items-center check-payment"
                >
                  <v-btn @click="checkPaymentStatus(product.id)">
                    Verificar pagamento
                  </v-btn>
                  <h4 :class="paymentStatus === 'paid' ? 'pago' : 'pendente'">
                    <i
                      :class="
                        paymentStatus === 'paid'
                          ? 'material-symbols-outlined'
                          : 'material-symbols-outlined'
                      "
                    >
                      {{ paymentStatus === "paid" ? "paid" : "pending" }}
                    </i>
                    {{ paymentStatus === "paid" ? "Pago!" : "Pendente" }}
                  </h4>
                </div>

                <span v-if="!loading && qrCode">
                  Leia o código ou clique
                  <a :href="qrCode" target="_blank">aqui</a>
                </span>

                <div id="pix-container">
                  <img v-if="loading" src="@/assets/img/loading.svg" alt="" />

                  <iframe
                    v-if="!loading && qrCode"
                    :src="qrCode"
                    width="100%"
                    height="400px"
                  >
                  </iframe>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Fechar" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import ip from "../../ip";

export default {
  name: "CompraItems",

  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      checkPayment: false,
      show: false,
      qrCode: null,
      paymentStatus: "",
      paymentInfo: {},
    };
  },

  methods: {
    buyProduct(id, name, amount) {
      console.log(id, name, amount);
      const paymentData = {
        transaction_amount: amount,
        description: `Compra de ${name}`,
        payment_method_id: "pix",
        email: "email@gmail.com",
        identification: "cpf",
        identificationValue: "04894714558",
        productId: id,
        productName: name,
      };
      console.log(ip);
      console.log(paymentData);
      axios
        .post(`http://${ip}:2399/payment/pix-payment`, {
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
    },

    checkPaymentStatus(id) {
      axios
        .get(`http://${ip}:2399/payment/checkPaymentStatus`, {
          params: {
            paymentId: this.paymentInfo,
            productId: id,
          },
        })
        .then((response) => {
          this.paymentStatus = response.data;
        })
        .catch((error) => {
          console.error("Erro ao consultar status de pagamento: ", error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.product-info {
  cursor: pointer;
  min-width: 250px;
  transition: all ease 0.3s;
  box-shadow: 0 4px 6px rgba(50, 50, 50, 0.3);
}

.product-info:hover {
  transform: scale(1.02);
}

#pix-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.check-payment h4 {
  margin-left: 20px;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  padding: 10px 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* Estilo para "Pendente" */
.check-payment h4.pendente {
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
  background-color: #ffe6e6;
}

/* Estilo para "Pago" */
.check-payment h4.pago {
  color: #4caf50;
  border: 1px solid #4caf50;
  background-color: #e8f5e9;
}

/* Estilo dos ícones para ambas as situações */
.check-payment h4 i {
  margin-right: 10px;
  font-size: 1.8rem;
}

.paid-icon {
  color: #4caf50; /* Verde para "Pago" */
}

.pending-icon {
  color: #ff4d4d; /* Vermelho para "Pendente" */
}
</style>
