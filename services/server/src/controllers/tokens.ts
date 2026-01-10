import { getTokenPrice } from "@/lib/jupiter";
import { Request, Response } from "express";

export const tokensController = {
  async getTokenPrice(req: Request, res: Response) {
    const { tokens = [] } = req.body;
    try {
      const response = await getTokenPrice(tokens);
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  },
};
