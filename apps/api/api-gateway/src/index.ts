import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
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

// Serve frontend in production (Docker container)
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../../web/dist");
  app.use(express.static(frontendDistPath));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`API Gateway running on port ${PORT}`);
});