const { MercadoPagoConfig } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-8692541217874284-090814-23c2b36505c2ba519c5af9a0999f003c-167539753",
  options: { timeout: 5000, idempotencyKey: "abc" },
});

module.exports = client;
