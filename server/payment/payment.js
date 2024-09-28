const express = require("express");
const router = express.Router();
const pool = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");

const WebSocket = require("ws");

const client = require("./mercadoPagoConfig.js");
const { Payment } = require("mercadopago");
require("dotenv").config();

const payment = new Payment(client);

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`Novo cliente conectado ${socket.id}`);

    socket.on("disconnect", () => {
      // console.log(`Cliente ${socket.id} desconectado`);
    });
  });

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

    // const query = `
    //   UPDATE loja.items_loja
    //   SET
    //     stock = stock - 1
    //   WHERE
    //     id = $1
    // `;

    try {
      // Obtém o status do pagamento
      const response = await payment.get({ id: id });
      status = response.status;

      // Define liberado com base no status (ajuste conforme necessário)
      if (status) {
        liberado = true;
      } // Ajuste a condição conforme necessário

      // Atualiza o estoque se liberado for verdadeiro
      // if (liberado) {
      //   await pool.query(query, [productId]);
      // }
      console.log(status);
      // Envia a resposta ao cliente
      return res.status(200).json({ status });
    } catch (error) {
      console.log("Erro ao consultar status de pagamento: ", error);
      return res.status(500).send(error);
    }
  });

  router.post("/web-hooks", async (req, res) => {
    try {
      const paymentData = req.body;

      io.emit("newSale", "Nova compra emitida");

      if (
        paymentData.action === "paymenapprovedt.created" ||
        paymentData.action === "payment.updated"
      ) {
        console.log("Novo pagamento registrado: ", paymentData.data.id);

        const paymentId = paymentData.data.id;

        const paymentDetail = await payment.get({ id: paymentId });

        if (paymentDetail.status === "approved") {
          await pool.query(
            `
          UPDATE loja.sales
          SET 
            sale_status = $1, updated_at = NOW()
          WHERE 
            payment_id = $2
          `,
            [paymentDetail.status, paymentId]
          );
        }

        io.emit("paymnetResult", {
          message: "Pagamento processado",
          status: paymentDetail.status,
        });

        res.status(200).send("Webhook processado com sucesso.");
      } else {
        console.log("Ação não tratada: ", paymentData.action);

        res.status(400).send("Ação não tratada.");
      }
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      res.status(500).send("Erro ao processar webhook.");
    }
  });

  router.post("/pix-payment", async (req, res) => {
    try {
      const { paymentData } = req.body;

      // Lógica de valor aleatório
      const requestOptions = {
        idempotencyKey: uuidv4(),
      };

      const body = {
        transaction_amount: parseFloat(paymentData.transaction_amount),
        description: paymentData.description,
        payment_method_id: paymentData.payment_method_id,
        notification_url:
          "https://aeesi-local-server.vercel.app/payment/web-hooks",
        payer: {
          email: paymentData.email,
          identification: {
            type: paymentData.identification,
            number: paymentData.identificationValue,
          },
        },
      };

      const response = await payment.create({ body, requestOptions });
      const paymentId = response.id;
      const paymentStatus = response.status;

      if (response && response.status === "pending") {
        await pool.query(
          `
      INSERT INTO loja.sales (item_id, quantity_sold, total_sale_price, sale_status, payment_id, sale_date)
      VALUES ($1, $2, $3, $4, $5, NOW())
      `,
          [
            paymentData.productId,
            1,
            paymentData.transaction_amount,
            paymentStatus,
            paymentId,
          ]
        );

        res.status(200).json({
          message: "Pagamento em processamento...",
          data: response,
        });
      } else {
        res.status(400).json({ message: "Erro na criação do pagamento." });
      }
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

  return router;
};
