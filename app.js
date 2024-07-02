require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const db = require("./models");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
