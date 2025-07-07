import app from "./app.mjs";
import "dotenv/config";
import initDatabase from "./dbInit.mjs";

const port = process.env.PORT || 3003;

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(
        `🚀 Server started successfully on port http://localhost:${port} 🚀`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
