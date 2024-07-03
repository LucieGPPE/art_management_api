require("dotenv").config();
const express = require("express");
const db = require("./models/index.js");
const customerRoutes = require("./routes/customerRoutes.js");
const paintRoutes = require("./routes/paintRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/auth").authMiddleware;
const certificateRoute = require("./routes/certificateRoute.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const app = express();
const port = 3005;

app.use(express.json());

app.use("/auth", authRoutes);

// app.use("/customers", authMiddleware(['MODERATOR', 'ADMIN']), customerRoutes);
// app.use("/paints", authMiddleware(['MODERATOR', 'ADMIN']), paintRoutes);
app.use("/", dashboardRoutes);
app.use("/customers", customerRoutes);
app.use("/paints", paintRoutes);
app.use("/certificate", certificateRoute);


app.get("/", (req, res) => {
  res.send(`.`);
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
