import { transactionRouter } from "@/routes/transactionRoutes";
import { config } from "@/utils/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { rateLimiter } from "shared/middleware/rate-limit";
import { chartRoutes } from "./routes/chartRoutes";
import { pdfRoutes } from "./routes/pdfRoutes";
import { tokenRoutes } from "./routes/tokenRoutes";

const app = express();
const port = config.PORT || 3002;
app.use(
  cors({
    origin: config.CLIENT_URL,
  }),
);
app.use(express.json());

app.use(rateLimiter);
app.use("/file", pdfRoutes);
app.use("/transactions", transactionRouter);
app.use("/token", tokenRoutes);
app.use("/charts", chartRoutes);
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`>> Server is running at port ${port}`);
});
