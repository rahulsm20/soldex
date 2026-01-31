import { getTransactionsChartDataUtil } from "@/lib/transactions";
import { Request, Response } from "express";

export const ChartsController = {
  getTransactionChartData: async (req: Request, res: Response) => {
    try {
      const mergedResult = await getTransactionsChartDataUtil(req);
      return res.status(200).json(mergedResult);
    } catch (error) {
      console.log("Error in getTransactionChartData:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};
