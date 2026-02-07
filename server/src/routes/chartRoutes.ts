import { ChartsController } from "@/controllers/charts";
import express from "express";
const router = express.Router();

router.get("/", ChartsController.getTransactionChartData);

export { router as chartRoutes };
