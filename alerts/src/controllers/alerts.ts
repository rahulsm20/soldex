import { db } from "shared/drizzle/db";
import { AlertChangeTypeEnum, AlertInsertSchema, Alerts, UserAlerts, Users } from "shared/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { Request, Response } from "express";

export const getAlerts = async (req: Request, res: Response) => {
  const sub = req.user?.payload?.sub;
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
  // add logic to evaluate webhook data
  console.log({ req })
}

export const getAlertById = async (req: Request, res: Response) => {
  const sub = req.user?.payload?.sub;
  if (!sub) return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  if (!id) return res.status(401).json({ message: "ID not provided" })

  const alert = await db
    .select({
      id: Alerts.id,
      tokenId: Alerts.tokenId,
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
    .where(
      and(
        eq(Users.sub, sub),
        eq(Alerts.id, id)
      ));

  return res.status(200).json({ alert });
}

/**
 * Only deletes alert for user calling the function
 */
export const deleteAlertById = async (req: Request, res: Response) => {
  const sub = req.user?.payload?.sub;
  if (!sub) return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  if (!id) return res.status(401).json({ message: "ID not provided" })

  await db.delete(UserAlerts).where(and(eq(UserAlerts.userId, sub), eq(UserAlerts.alertId, id)));

  return res.status(200).json({ alert });
}

export const createAlert = async (req: Request, res: Response) => {
  const sub = req.user?.payload?.sub;
  if (!sub) return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  if (!id) return res.status(401).json({ message: "ID not provided" })
  const { data } = req.body;
  if (!data) return res.status(401).json({ message: "Data not provided" })
  const { actionUnit, actionType, actionValue, changeUnit, changeValue, changeType, tokenId, type } = data
  if (!type || !changeValue || !changeUnit || !changeType || !tokenId) return res.status(402).json({ message: 'Invalid request' })

  const result = AlertInsertSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.format());
  }

  const alert = await db.insert(Alerts).values({
    type,
    changeValue: parseFloat(changeValue),
    changeType,
    changeUnit,
    tokenId,
    actionType,
    actionUnit,
    actionValue
  });

  return res.status(200).json({ alert });

}

export const updateAlert = async (req: Request, res: Response) => {
  const sub = req.user?.payload?.sub;
  if (!sub) return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  if (!id) return res.status(401).json({ message: "ID not provided" })
  const { data } = req.body;
  if (!data) return res.status(401).json({ message: "Data not provided" })
  const { actionUnit, actionType, actionValue, changeUnit, changeValue, changeType, tokenId, type } = data
  if (!type || !changeValue || !changeUnit || !changeType || !tokenId) return res.status(402).json({ message: 'Invalid request' })

  const result = AlertInsertSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.format());
  }

  const alert = await db.update(Alerts).set({
    type,
    changeValue: parseFloat(changeValue),
    changeType,
    changeUnit,
    tokenId,
    actionType,
    actionUnit,
    actionValue
  }).where(and(eq(Alerts.id, id)));

  return res.status(200).json({ alert });

}
