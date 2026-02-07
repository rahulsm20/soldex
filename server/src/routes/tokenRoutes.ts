import { tokensController } from "@/controllers/tokens";
import express from "express";
const router = express.Router();

router.post("/", tokensController.getTokenPrice);

export { router as tokenRoutes };
