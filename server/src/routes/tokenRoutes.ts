import { getFiltersInfo } from "@/controllers/mint";
import { tokensController } from "@/controllers/tokens";
import express from "express";
const router = express.Router();

router.get("/filters", getFiltersInfo);
router.post("/", tokensController.getTokenPrice);
export { router as tokenRoutes };
