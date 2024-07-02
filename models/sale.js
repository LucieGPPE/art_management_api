module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    peinture_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Paints",
        key: "id",
      },
    },
    client_id: {
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

  return Sale;
};
