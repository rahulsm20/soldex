import { transactionsController } from "@/controllers";
import express from "express";
const router = express.Router();

// Example route for transactions
router.get("/", transactionsController.fetchTransactions);

export { router as transactionRouter };
