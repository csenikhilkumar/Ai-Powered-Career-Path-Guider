import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import careerRoutes from "./routes/career.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use("/", careerRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "Career Service Running", mode: "Postgres/Prisma" });
});

app.listen(PORT, () => {
    console.log(`Career Service running on port ${PORT}`);
});