import { webhookController } from "@/controllers/webhook";
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Welcome to the Indexer API" });
});
router.get("/status", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "API is running", status: "ok" });
});

router.post("/webhook", webhookController.handleWebhook);
router.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "API Route not found" });
});
export { router as apiRoutes };
