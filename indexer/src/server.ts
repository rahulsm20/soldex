import cors from "cors";
import express, { Request, Response } from "express";
import { rateLimiter } from "shared/middleware/rate-limit";
import { apiRoutes } from "./routes/api";

//----------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      event?: any;
    }
  }
}

//----------------------------------------------------

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
// app.use(rateLimiter);
// app.use("/wallet", transactionRoutes);
app.use("/api", apiRoutes);

//----------------------------------------------------
app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "sol indexer running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`>> Indexer is running at port ${port}`);
});
