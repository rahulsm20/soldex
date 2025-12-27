import { solanaClient } from "@/lib/sol";
import express from "express";
const router = express.Router();

router.get("/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const data = await solanaClient.getAccountInfo(address);
    return res.status(200).json({ address, data });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/", async (_req, res) => {
  return res.status(200).json({ message: "sol indexer running", status: "ok" });
});

export { router as solRoutes };
