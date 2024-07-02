const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js");
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Paint = require("./paint")(sequelize, DataTypes);
db.Customer = require("./customer")(sequelize, DataTypes);
db.Sale = require("./sale")(sequelize, DataTypes);
db.Certificate = require("./certificate")(sequelize, DataTypes);

// Relations
db.Paint.hasMany(db.Sale, { foreignKey: "paint_id" });
db.Customer.hasMany(db.Sale, { foreignKey: "customer_id" });
db.Sale.belongsTo(db.Paint, { foreignKey: "paint_id" });
db.Sale.belongsTo(db.Customer, { foreignKey: "customer_id" });

db.Paint.hasMany(db.Certificate, { foreignKey: "paint_id" });
db.Customer.hasMany(db.Certificate, { foreignKey: "customer_id" });
db.Certificate.belongsTo(db.Paint, { foreignKey: "paint_id" });
db.Certificate.belongsTo(db.Customer, { foreignKey: "customer_id" });

module.exports = db;
