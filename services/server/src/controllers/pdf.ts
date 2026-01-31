import { generatePDF, renderTransactionsReport } from "@/lib/pdf";
import { Request, Response } from "express";
import { formatDateLong12h } from "shared/utils";

export const pdfController = {
  exportTransactionsReport: async (req: Request, res: Response) => {
    try {
      const startTime = req.query.startTime;
      const endTime = req.query.endTime;
      const title = `Transactions Report ${startTime && endTime ? `from ${formatDateLong12h(startTime as string)} to ${formatDateLong12h(endTime as string)}` : ""}`;
      const pdfBuffer = await renderTransactionsReport(req, title);
      const { filename, signedUrl } = await generatePDF(pdfBuffer, title);

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
