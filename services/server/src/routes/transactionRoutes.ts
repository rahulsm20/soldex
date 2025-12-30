import { transactionsController } from "@/controllers";
import express from "express";
const router = express.Router();

router.get("/", transactionsController.fetchTransactions);

export { router as transactionRouter };
