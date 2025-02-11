import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import routes from "./src/application/router/routes.js";
import errorHandler from "./src/application/middleware/errorHandler.js";

dotenv.config();


export const app = express();
const PORT = process.env.PORT;

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {});

  mongoose.connection.on("open", () => {
    console.log("Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });
}

app.use(routes);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}