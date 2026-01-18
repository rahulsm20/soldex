import { pdfController } from "@/controllers/pdf";
import express from "express";
const router = express.Router();

router.post("/", pdfController.exportTransactionsReport);

export { router as pdfRoutes };
