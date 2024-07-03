require("dotenv").config();
const express = require("express");
const db = require("./models/index.js");
const customerRoutes = require("./routes/customerRoutes.js");
const paintRoutes = require("./routes/paintRoutes.js");

const app = express();
const port = 3005;

app.use(express.json());

app.use("/customers", customerRoutes);
app.use("/paints", paintRoutes);
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
