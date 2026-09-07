import { Router } from "express";
const router = Router();

router.get("/view");
router.post("/create");
router.put("/update");
router.delete("/delete");
router.get("/view/:id");
router.delete("/delete/:id");
router.get("/query");

export const routes = router;
