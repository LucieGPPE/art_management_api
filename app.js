require("dotenv").config();
const express = require("express");
const cors = require('cors');
const path = require("path");
const db = require("./models/index.js");
const customerRoutes = require("./routes/customerRoutes.js");
const paintRoutes = require("./routes/paintRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/auth").authMiddleware;
const certificateRoute = require("./routes/certificateRoute.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: 'http://185.193.17.146:5173/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use("/auth", authRoutes);

app.use("/dashboard", dashboardRoutes);
app.use("/customers", customerRoutes);
app.use("/paints", paintRoutes);
app.use("/certificate", certificateRoute);
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
