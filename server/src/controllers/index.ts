import { getTransactionsUtil } from "@/lib/transactions";
import { Request, Response } from "express";

export const transactionsController = {
  fetchTransactions: async (req: Request, res: Response) => {
    const {
      address,
      limit,
      page,
      pageSize,
      startTime,
      endTime,
    }: {
      address?: string;
      limit?: number;
      page?: number;
      pageSize?: number;
      startTime?: string;
      endTime?: string;
    } = req.query;
    try {
      const result = await getTransactionsUtil({
        address: address as string,
        limit: limit ? Number(limit) : undefined,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        startTime: startTime as string,
        endTime: endTime as string,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
