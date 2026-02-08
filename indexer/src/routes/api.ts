import { txQueue } from "@/lib/bullmq";
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
  const events = req.body;
  for (const event of events) {
    await txQueue.add("processTransaction", {
      signature: event.signature,
      slot: event.slot,
      timestamp: event.timestamp,
      block_time: event.blockTime,
      accountData: event.accountData,
    });
  }
  return res
    .status(200)
    .json({ message: "Webhook successful, tx pushed to queue", status: "ok" });
});
router.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "API Route not found" });
});
export { router as apiRoutes };
