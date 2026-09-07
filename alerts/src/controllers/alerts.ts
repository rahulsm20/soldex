import { db } from "shared/drizzle/db";
import { Alerts, UserAlerts, Users } from "shared/drizzle/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export const getAlerts = async (req: Request, res: Response) => {
  const sub = req.auth?.payload?.sub;
  if (!sub) return res.status(401).json({ message: "Unauthorized" });

  const alerts = await db
    .select({
      id: Alerts.id,
      type: Alerts.type,
      changeType: Alerts.changeType,
      changeUnit: Alerts.changeUnit,
      changeValue: Alerts.changeValue,
      actionType: Alerts.actionType,
      createdAt: Alerts.createdAt,
      updatedAt: Alerts.updatedAt,
    })
    .from(Alerts)
    .innerJoin(UserAlerts, eq(UserAlerts.alertId, Alerts.id))
    .innerJoin(Users, eq(UserAlerts.userId, Users.id))
    .where(eq(Users.sub, sub));

  return res.status(200).json({ alerts });
}

export const evaluateWebhook = (req: Request, res: Response) => {
  // 
}
