const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Image = sequelize.define("Image", {
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
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = Image;
