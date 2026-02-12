import { db } from "@/shared/drizzle/db";
import { solana_transactions } from "@/shared/drizzle/schema";
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Welcome to the Indexer API" });
});
router.get("/status", async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "API is running", status: "ok" });
});

router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const events = req.body;

    for (const event of events) {
      const to_address = event.nativeTransfers?.[0]?.toUserAccount;
      const from_address = event.nativeTransfers?.[0]?.fromUserAccount;
      const signature = event.signature;
      let blockTime = null;
      if (event?.timestamp) {
        blockTime = new Date(event?.timestamp * 1000);
      }
      await db.insert(solana_transactions).values({
        signature,
        slot: event.slot,
        blockTime,
        to_address,
        from_address,
        address: from_address,
      });
    }
    return res
      .status(200)
      .json({ message: "Webhook successful, tx pushed to db ", status: "ok" });
  } catch (err) {
    if (err instanceof Error) {
      return res
        .status(404)
        .json({ message: "failed to push tx", err: err.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
});
router.get("*", async (_req: Request, res: Response) => {
  return res.status(404).json({ message: "API Route not found" });
});
export { router as apiRoutes };
