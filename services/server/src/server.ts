import cors from "cors";
import express, { Request, Response } from "express";
import { transactionRouter } from "./routes/transactionRoutes";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/transactions", transactionRouter);

app.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Service running", status: "ok" });
});

app.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json("Invalid route");
});

app.listen(port, () => {
  console.log(`>> Server is running at port ${port}`);
});
