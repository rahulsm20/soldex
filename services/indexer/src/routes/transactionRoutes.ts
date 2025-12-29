import { transactionsController } from "@/controllers";
import express from "express";
const router = express.Router();

router.get(
  "/:address/transactions",
  transactionsController.getTransactionsForAddress
);

export { router as transactionRoutes };
