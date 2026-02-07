import app from "./app.js";
import http from 'http';
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const port = process.env.PORT || 3000



const startServer = (async() => {
  try {
    await dbConnect();
    app.use('/auth',authRoutes);

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
})();


