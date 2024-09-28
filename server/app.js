const express = require("express");
const cors = require("cors");
const pool = require("./db/db.js");
const multer = require("multer");
const path = require("path");
const http = require("http");
const payment = require("./payment/payment.js");

const app = express();
const port = 2399;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const paymentRoutes = require("./payment/payment.js")(io);

app.use(cors());
app.use(express.json());
app.use("/payment", paymentRoutes);

server.listen(port, () => {
  console.log("Server listening on port: ", port);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register-client", async (req, res) => {
  try {
    const data = req.body;

    const query = await pool.query(
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
    const query = await pool.query(`SELECT * FROM clients.academy_clients`);
    const users = query.rows;

    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao consultar banco de dados: ", error);
    return res.status(500).json(`{Error: ${error}}`);
  }
});

app.get("/get-client-payment-history/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    const query = await pool.query(
      `
      WITH months AS (
      SELECT generate_series(1, 12) AS mes_pagamento
      )
      SELECT 
          ac.name, 
          ac.birth, 
          ac.cpf, 
          ac.phone, 
          ac.email, 
          ac.course, 
          ac.address, 
          ac.bolsista, 
          ac.schedule, 
          ac.gender, 
          ac.id AS client_id, 
          months.mes_pagamento, 
          COALESCE(EXTRACT(YEAR FROM ap.payment_date), EXTRACT(YEAR FROM CURRENT_DATE)) AS ano_pagamento,
          COALESCE(ap.payment_status, false) AS payment_status,
          ap.id_client
      FROM 
          clients.academy_clients ac
      CROSS JOIN
          months
      LEFT JOIN 
          clients.payment ap
      ON 
          ac.id = ap.id_client
          AND EXTRACT(MONTH FROM ap.payment_date) = months.mes_pagamento
          AND EXTRACT(YEAR FROM ap.payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      WHERE 
          ac.id = $1
      ORDER BY 
          months.mes_pagamento;
      `,
      [clientId]
    );
    const paymentDetail = query.rows;

    return res.status(200).json(paymentDetail);
  } catch (error) {
    console.error("Erro ao consultar banco de dados: ", error);
    return res.status(500).json(`{Error: ${error}}`);
  }
});

app.post("/register-payment", async (req, res) => {
  try {
    const { clientId, month } = req.body;
    const currentDate = new Date();

    let date = `2024-`;
    date += month + "-" + currentDate.getDate();

    const query = await pool.query(
      `
      INSERT INTO clients.payment (id_client, payment_status, payment_date, create_date, update_date)
      VALUES ($1, true, $2, NOW(), NOW())
    `,
      [clientId, date]
    );

    return res.status(200).send("Pagamento registrado com sucesso!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro interno no servidor");
  }
});

app.put("/reset-payment-status", async (req, res) => {
  const date = new Date();
  const day = date.getDate();

  if (day === 5) {
    await pool.query(`
        UPDATE clients.academy_clients
        set monthly_payment_status = 'pending'
      `);

    return res.send("Status atualizado");
  }

  return res.send("Status não atualizado");
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

app.post("/register-item", async (req, res) => {
  try {
    const newItem = req.body;

    const register = await pool.query(
      `
        INSERT INTO
          loja.items_loja (name, category, description, cost_price, selling_price, min_stock, validity, supplier, image)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        newItem.image,
      ]
    );

    res.status(200).send("Produto cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro interno no servidor: ", error);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../client/src/assets/img/loja"));
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "Upload realizado com sucesso!", file: req.file });
});
