module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define("Certificate", {
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
