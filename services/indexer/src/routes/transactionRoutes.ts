import { transactionsController } from "@/controllers";
import express from "express";
const router = express.Router();

router.get(
  "/:address/transactions",
  transactionsController.getTransactionsForAddress
);

router.post("/webhook", transactionsController.indexTransaction);
export { router as transactionRoutes };
