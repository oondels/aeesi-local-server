const express = require("express");
const router = express.Router();
const client = require("./mercadoPagoConfig.js");
const pool = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const { Payment } = require("mercadopago");
require("dotenv").config();

const payment = new Payment(client);

// Teste de status de pagamento
async function verificarStatusPagamento(paymentId) {
  try {
    const pagamento = await payment.findById(paymentId);

    // Obtém o status do pagamento
    const status = pagamento.body.status;

    console.log(`Status do pagamento ${paymentId}: ${status}`);

    return status;
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    throw error;
  }
}

router.get("/checkPaymentStatus", async (req, res) => {
  const id = req.query.paymentId;
  const productId = req.query.productId;

  let status = "";
  let liberado = false;

  const query = `
      UPDATE loja.items_loja
      SET
        stock = stock - 1
      WHERE
        id = $1
    `;

  try {
    // Obtém o status do pagamento
    const response = await payment.get({ id: id });
    status = response.status;

    // Define liberado com base no status (ajuste conforme necessário)
    if (status) {
      liberado = true;
    } // Ajuste a condição conforme necessário

    // Atualiza o estoque se liberado for verdadeiro
    if (liberado) {
      await pool.query(query, [productId]);
    }

    // Envia a resposta ao cliente
    return res.status(200).json({ status });
  } catch (error) {
    console.log("Erro ao consultar status de pagamento: ", error);
    return res.status(500).send(error);
  }
});

router.post("/webhook", (req, res) => {
  const paymentData = req.body;

  // Verifica se a notificação é de um pagamento
  if (
    paymentData.type === "payment" &&
    paymentData.data &&
    paymentData.data.id
  ) {
    const paymentId = paymentData.data.id;

    // Aqui, você pode realizar ações adicionais, como armazenar o ID do pagamento,
    // enviar uma notificação ao usuário, etc.

    console.log(`Pagamento confirmado: ${paymentId}`);

    // (Opcional) Chame a API do Mercado Pago para obter detalhes adicionais do pagamento
    // Ver exemplo mais abaixo

    // Retorna uma resposta ao Mercado Pago para confirmar que a notificação foi recebida
    res.status(200).send("OK");
  } else {
    // Caso a notificação não seja de pagamento ou esteja incompleta
    res.status(400).send("Evento não reconhecido.");
  }
});

router.post("/pix-payment", async (req, res) => {
  try {
    const paymentDetails = req.body.data;

    // Lógica de valor aleatório
    const requestOptions = {
      idempotencyKey: uuidv4(),
    };

    const body = {
      transaction_amount: parseFloat(
        paymentDetails.paymentData.transaction_amount
      ),
      description: paymentDetails.paymentData.description,
      payment_method_id: paymentDetails.paymentData.payment_method_id,
      payer: {
        email: "hendriusfelix@gmail.com",
        identification: {
          type: paymentDetails.paymentData.identification,
          number: paymentDetails.paymentData.identificationValue,
        },
      },
    };

    payment
      .create({ body, requestOptions })
      .then((response) => {
        liberado = true;
        res.status(200).send(response);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  } catch (error) {
    console.error("Erro interno no servidor: ", error);
    res.status(500).send("Erro interno no servidor.");
  }
});

router.post("/pix-payment-barcode", async (req, res) => {
  try {
    const paymentDetails = req.body.data;

    const requestOptions = {
      idempotencyKey: uuidv4(),
    };

    const query = await pool.query(
      `
        SELECT selling_price, name FROM loja.items_loja
        WHERE
          barcode = $1
      `,
      [paymentDetails.paymentData.barCode]
    );

    const product = query.rows;

    if (product.length === 0) {
      return res.status(404).send("Produto não encontrado.");
    }

    body = {
      transaction_amount: parseFloat(product[0].selling_price),
      description: `Compra de ${product[0].name}`,
      payment_method_id: paymentDetails.paymentData.payment_method_id,
      payer: {
        email: process.env.DEFAULT_EMAIL,
        identification: {
          type: paymentDetails.paymentData.identification,
          number: paymentDetails.paymentData.identificationValue,
        },
      },
    };

    payment
      .create({ body, requestOptions })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  } catch (error) {
    console.error("Erro interno no servidor: ", error);
    res.status(500).send("Erro interno no servidor.");
  }
});

module.exports = router;
