import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Welcome to the Indexer API" });
});
router.get("/status", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "API is running", status: "ok" });
});

router.post("/webhook", async (req: Request, res: Response) => {
  // push event data can be accessed via req.event
  const event = req;
  console.log(JSON.stringify(event, null, 2));
  return res.status(200).json({ service: "Indexer API", version: "1.0.0" });
});
router.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "API Route not found" });
});
export { router as apiRoutes };
