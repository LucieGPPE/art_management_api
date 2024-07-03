const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

  const Sale = sequelize.define("Sale", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paint_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Paints",
        key: "id",
      },
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Customers",
        key: "id",
      },
    },
    realisedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("paid", "pending", "cancelled"),
      allowNull: false,
    },
  });

module.exports = Sale;
