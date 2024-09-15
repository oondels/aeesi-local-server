const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASS,
  host: process.env.IP,
  port: process.env.PORT,
  database: process.env.DBASE,
});

module.exports = pool;
