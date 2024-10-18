const express = require("express");
const cors = require("cors");
const pool = require("./db/db.js");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const paymentRoutes = require("./payment/payment.js");
const nodeMailer = require("nodemailer");

const app = express();
const port = 2399;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

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

app.get("/get-client-relationship", async (req, res) => {
  try {
    const query = await pool.query(`
      SELECT 
        COUNT(*), course
      FROM
        clients.academy_clients
      GROUP BY
        course
      ORDER BY
       course
      `);

    res.status(200).json(query.rows);
  } catch (error) {
    console.error("Erro ao consultar banco de dados: ", error);
    return res.status(500).send("Erro interno no Servidor");
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
    return res.status(500).send("Errro interno no servidor");
  }
});

app.get("/get-last-payments", async (req, res) => {
  try {
    const query = await pool.query(`
        SELECT
          to_char(p.payment_date, 'DD-MM-YYYY') AS payment_date, 
          p.amount,
          c.name
        FROM 
          clients.academy_clients c
        INNER JOIN
          clients.payment p
        ON
          p.id_client = c.id
        WHERE
          p.payment_status = true
        ORDER BY
          p.payment_date
        LIMIT 10
      `);

    return res.status(200).json(query.rows);
  } catch (error) {
    console.error("Erro ao consultar banco de dados: ", error);
    return res.status(500).send("Errro interno no servidor");
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

// Email Configurations
const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const emailDetails = req.body;

  if (!emailDetails.name) {
    return res.status(401).send("Por favor, preencha o seu nome.");
  }

  if (!emailDetails.message) {
    return res
      .status(401)
      .send("Adicione uma mensagem para enterdermos seu interesse.");
  }

  await transporter
    .sendMail({
      to: process.env.MYMAIL,
      subject: `<💚> Mensagem CLiente Academia - <${emailDetails.email}>`,
      html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0d9757; font-size: 24px; margin: 0;">Nova Mensagem Recebida</h1>
              </div>

              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <h2 style="color: #0056b3; font-size: 20px; margin: 0 0 10px;">Nome: <strong>${emailDetails.name}</strong></h2>
                <h2 style="color: #0056b3; font-size: 20px; margin: 0 0 10px;">Email de Contato: <strong>${emailDetails.email}</strong></h2>
                <h2 style="color: #0056b3; font-size: 20px; margin: 0 0 20px;">Celular: <strong>${emailDetails.phone}</strong></h2>

                <h1 style="color: #0d9757; font-size: 22px; margin-bottom: 10px;">Mensagem:</h1>
                <p style="font-size: 16px; color: #555; background-color: #f4f4f4; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                  ${emailDetails.message}
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px; color: #777; font-size: 14px;">
                <p>Este e-mail foi gerado automaticamente. Por favor, não responda.</p>
              </div>
          </div>
            `,
    })
    .then(() => {
      console.log("Email sent");
      return res
        .status(200)
        .send("Email enviado, responderei o mais rápido possível.");
    })
    .catch((error) => {
      console.error("Erro sending email: ", error);
      return res
        .status(404)
        .send(
          "Erro de comunicação... Estamos trabalhando para consertar, tente contato por Whatsapp -> +55 (75) 982466403"
        );
    });
});
