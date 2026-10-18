import { createAlert, deleteAlertById, evaluateWebhook, getAlertById, getAlerts, getAllAlerts, updateAlert } from "@/controllers/alerts";
import { Router } from "express";
const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Alerts API' })
})
router.get("/view", getAlerts);
router.get("/view-all", getAllAlerts);
router.post("/create", createAlert);
router.put("/update", updateAlert);
// router.delete("/delete")h
router.get("/view/:id", getAlertById);
router.delete("/delete/:id", deleteAlertById);
// router.get("/query");
router.post("/webhook", evaluateWebhook);

export const alertRoutes = router;
