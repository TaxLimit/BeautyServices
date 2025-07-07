import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.mjs";
import user from "./userModel.mjs";

const service = sequelize.define(
  "service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        "HairCare",
        "FacialTreatments",
        "Waxing",
        "Massages"
      ),
      allowNull: false,
      defaultValue: "HairCare",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    imgURL: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// table relations in the db
service.belongsTo(user, { foreignKey: "createdBy" });
user.hasMany(service, { foreignKey: "createdBy" });

export default service;
