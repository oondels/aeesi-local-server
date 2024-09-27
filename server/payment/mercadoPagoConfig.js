require("dotenv").config();

const { MercadoPagoConfig } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_KEY,
  options: { timeout: 5000, idempotencyKey: "abc" },
});

module.exports = client;
