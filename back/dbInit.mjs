import sequelize from "./dbConnection.mjs";
import user from "./models/userModel.mjs";
import service from "./models/serviceModel.mjs";
import serviceDate from "./models/serviceDateModel.mjs";
import userServiceDate from "./models/userserviceDateModel.mjs";

const initDatabase = async () => {
  try {
    // await sequelize.sync({ alter: true });
    console.log("✅ Database running successfully ✅");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

export default initDatabase;
