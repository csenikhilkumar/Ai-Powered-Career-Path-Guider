import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { config } from "./config";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const PORT = config.port;

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.use(rateLimiter());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway is running" });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});