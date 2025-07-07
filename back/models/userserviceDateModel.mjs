import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.mjs";
import user from "./userModel.mjs";
import serviceDate from "./serviceDateModel.mjs";

const userServiceDate = sequelize.define(
  "userServiceDate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    serviceDateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: serviceDate,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("confirmed", "cancelled"),
      defaultValue: "confirmed",
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// table relations in the db
userServiceDate.belongsTo(user, { foreignKey: "userId" });
user.hasMany(userServiceDate, { foreignKey: "userId" });

userServiceDate.belongsTo(serviceDate, { foreignKey: "serviceDateId" });
serviceDate.hasMany(userServiceDate, { foreignKey: "serviceDateId" });

export default userServiceDate;
