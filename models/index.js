const { Sequelize } = require("sequelize");
const config = require("../config/config.js");
const sequelize = require("../config/sequelize");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import des modèles
db.Paint = require("../models/paint");
db.Customer = require("../models/customer");
db.Sale = require("../models/sale");
db.Certificate = require("../models/certificate");
db.Image = require("../models/image");

// Relations entre les modèles
db.Paint.hasMany(db.Sale, { foreignKey: "paint_id" });
db.Customer.hasMany(db.Sale, { foreignKey: "customer_id" });
db.Sale.belongsTo(db.Paint, { foreignKey: "paint_id" });
db.Sale.belongsTo(db.Customer, { foreignKey: "customer_id" });

db.Paint.hasOne(db.Certificate, { foreignKey: "paint_id" });
db.Customer.hasMany(db.Certificate, { foreignKey: "customer_id" });
db.Certificate.belongsTo(db.Paint, { foreignKey: "paint_id" });
db.Certificate.belongsTo(db.Customer, { foreignKey: "customer_id" });

db.Paint.hasMany(db.Image, { foreignKey: "paint_id" });
db.Image.belongsTo(db.Paint, { foreignKey: "paint_id" });

module.exports = db;
