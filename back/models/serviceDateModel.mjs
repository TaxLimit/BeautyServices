import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.mjs";
import service from "./serviceModel.mjs";

const serviceDate = sequelize.define(
  "serviceDate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: service,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// table relations in the db

serviceDate.belongsTo(service, { foreignKey: "serviceId" });
service.hasMany(serviceDate, { foreignKey: "serviceId" });

export default serviceDate;
