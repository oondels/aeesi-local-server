const express = require("express");
const cors = require("cors");
const pool = require("./db/db.js");
const paymentRoutes = require("./payment/payment.js");

const app = express();
const port = 2399;

app.use(cors());
app.use(express.json());
app.use("/payment", paymentRoutes);

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register-client", async (req, res) => {
  try {
    const data = req.body;

    const query = pool.query(
      `
     INSERT INTO clients.academy_clients
     (name, birth, cpf, phone, email, course, address, bolsista, schedule, gender)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        data.nome,
        data.birth,
        data.cpf,
        data.phone,
        data.email,
        data.curso,
        data.address,
        data.bolsa,
        data.horario,
        data.genero,
      ]
    );

    const nome = data.nome.split(" ")[0];
    const sobrenome = data.nome.split(" ")[data.nome.split(" ").length - 1];

    res
      .status(200)
      .send(`O cliente ${nome} ${sobrenome} foi cadastrado com sucesso!`);
  } catch (error) {
    console.error(`Erro interno no servidor: ${error}`);
    res.status(500).send("Erro interno no servidor: ", error);
  }
});

app.get("/get-academy-clients", async (req, res) => {
  try {
    const query = await pool.query("SELECT * FROM clients.academy_clients");
    const users = query.rows;

    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao consultar banco de dados: ", error);
    return res.status(500).json(`{Error: ${error}}`);
  }
});

app.get("/getAllProducts", async (req, res) => {
  try {
    const query = await pool.query(`
        SELECT * FROM loja.items_loja
    `);
    const result = query.rows;

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro interno no servidor");
    return res.status(500).json(`{Error: ${error}}`);
  }
});

app.post("/registerItem", async (req, res) => {
  try {
    const newItem = req.body;

    const register = await pool.query(
      `
        INSERT INTO
          loja.items_loja (name, category, description, cost_price, selling_price, min_stock, validity, supplier)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        newItem.name,
        newItem.category,
        newItem.description,
        newItem.costPrice,
        newItem.sellingPrice,
        newItem.minStock,
        newItem.validity,
        newItem.supplier,
      ]
    );

    res.status(200).send("Produto cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro interno no servidor: ", error);
  }
});
