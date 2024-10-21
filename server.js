import express from "express";
import dotenv from "dotenv";
import router from "./src/router/routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server };