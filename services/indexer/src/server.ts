import cors from "cors";
import express, { Request, Response } from "express";
import { rateLimiter } from "./middleware/rate-limit";
import { transactionRoutes } from "./routes/transactionRoutes";
import { config } from "./utils/config";

//----------------------------------------------------

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: config.CLIENT_URL,
  })
);
app.use(express.json());
app.use(rateLimiter);
app.use("/wallet", transactionRoutes);

app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "sol indexer running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`>> Indexer is running at port ${port}`);
});
