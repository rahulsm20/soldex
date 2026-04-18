import { pdfController } from "@/controllers/pdf";
import express from "express";
import logger from "shared/logger";
const router = express.Router();

router.post("/", pdfController.exportTransactionsReport);
router.use("*", (_req: express.Request, res: express.Response) => {
  return res.status(404).json({ error: "Route not found" });
});
router.use((err: Error, _req: express.Request, res: express.Response) => {
  logger.error("PDF generation error: " + err);
  res.status(500).json({ error: "Failed to generate PDF" });
});
export { router as pdfRoutes };
