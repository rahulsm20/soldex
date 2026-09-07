import { Request, Response } from "express";

export const getAlerts = (req: Request, res: Response) => {
  const { conversationId, message } = req.body;
  const userId = req.auth?.payload.sub;
  const alerts = [];

  return res.status(200).json({ alerts });
}
