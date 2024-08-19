const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
const port = 2399;

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user", (req, res) => {
  res.json({
    names: ["Hendrius", "Christopher", "Bruce"],
  });
});
