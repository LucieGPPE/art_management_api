module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define("Certificate", {
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
    generatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    linkPdf: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  return Certificate;
};
