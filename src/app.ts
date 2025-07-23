import express from "express";
import connectDB from "./server";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import morgan from "morgan";
import cors from "cors";

import usersRoutes from "./api/users/users.routes";
import foodRoutes from "./api/items/food.routes";
import clothesRoutes from "./api/items/clothes.routes";
import furnitureRoutes from "./api/items/furniture.routes";
import notificationsRoutes from "./api/notifications/notifications.routes";
import dotenv from "dotenv"
dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use("/users", usersRoutes);
app.use("/food", foodRoutes);
app.use("/clothes", clothesRoutes);
app.use("/furniture", furnitureRoutes);
app.use("/notifications", notificationsRoutes);
app.use(notFound);
app.use(errorHandler);
import { Buffer } from "buffer";
global.Buffer = Buffer;

import path from "path";
app.use("/media", express.static(path.join(__dirname, "../media")));
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
