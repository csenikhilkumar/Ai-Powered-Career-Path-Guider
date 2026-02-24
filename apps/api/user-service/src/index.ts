import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFound } from "./utils/errorMiddleware";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "User Service Running", mode: "Postgres/Prisma" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`User Service running on port ${PORT}`);
});