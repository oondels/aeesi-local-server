require("dotenv").config();

const { MercadoPagoConfig } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.MERC_PAGO_ACCES_KEY,
  options: { timeout: 5000, idempotencyKey: "abc" },
});

module.exports = client;
