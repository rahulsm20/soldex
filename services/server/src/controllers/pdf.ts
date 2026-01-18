import { generatePDF, renderTransactionsReport } from "@/lib/pdf";
import { Request, Response } from "express";

export const pdfController = {
  exportTransactionsReport: async (req: Request, res: Response) => {
    try {
      const pdfBuffer = await renderTransactionsReport(req);

      const { filename, signedUrl } = await generatePDF(pdfBuffer);

      return res.status(200).json({ filename, signedUrl });
    } catch (err) {
      return res.status(500).json({
        message: "Error generating PDF",
        status: "error",
        err,
      });
    }
  },
};
