const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  profilPicturePath: {
    type: DataTypes.STRING(255),
  },
  role: {
    type: DataTypes.ENUM("CUSTOMER", "MODERATOR", "ADMIN"),
    allowNull: false,
  },
});

module.exports = User;