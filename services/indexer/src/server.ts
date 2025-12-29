import express, { Request, Response } from "express";
import { transactionRoutes } from "./routes/transactionRoutes";

//----------------------------------------------------

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/wallet", transactionRoutes);

app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "sol indexer running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Indexer is running at port ${port}`);
});
