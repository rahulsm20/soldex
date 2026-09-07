import express, { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";

const app = express();
const port = process.env.PORT || 3003;

declare global {
  namespace Express {
    interface Request {
      user: AuthResult | undefined;
    }
  }
}

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ message: "alerts service running", status: "ok" });
});

app.get("*", async (req: Request, res: Response) => {
  return res.status(404).json("invalid route");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
