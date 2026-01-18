import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { Request } from "express";
import PDFDocument from "pdfkit";
import { db } from "shared/drizzle/db";
import { solana_transactions } from "shared/drizzle/schema";
import { getSignedURL, uploadToS3 } from "./s3";

export async function generatePDFBuffer(): Promise<Uint8Array> {
  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(25).text("Hello World!", { align: "center" });
  doc.addPage();
  doc.fontSize(18).text("This is a new page.", { align: "left" });
  doc.table({
    data: [
      ["Column 1", "Column 2", "Column 3"],
      ["One value goes here", "Another one here", "OK?"],
    ],
  });

  doc.end();

  await new Promise<void>((resolve) => doc.on("end", resolve));

  return Buffer.concat(chunks);
}

//--------------------------------------------------------------
export async function renderTransactionsReport(req: Request) {
  const { address, limit, offset } = req.query;
  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(20).text("Transactions Report", { align: "center" });
  doc.moveDown();
  const where = {
    address: address ? String(address) : undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  };

  const transactions = await db
    .select()
    .from(solana_transactions)
    .where(
      where.address
        ? eq(solana_transactions.address, where.address)
        : undefined,
    )
    .limit(where.limit || 200)
    .offset(where.offset || 0)
    .orderBy(desc(solana_transactions.blockTime));

  const tableData = [
    ["Date", "Signature", "From", "To"],
    ...transactions?.map((tx) => [
      new Date(tx.blockTime).toLocaleDateString(),
      tx.signature,
      tx.from_address ?? "N/A",
      tx.to_address ?? "N/A",
    ]),
  ];

  doc.table({ data: tableData });

  doc.end();

  await new Promise<void>((resolve) => doc.on("end", resolve));

  return Buffer.concat(chunks);
}

export async function generatePDF(pdfBuffer: Buffer) {
  const filename = `pdfs/${randomUUID()}.pdf`;

  await uploadToS3(pdfBuffer, filename, "application/pdf");

  const signedUrl = await getSignedURL(filename, 60 * 10); // 10 minutes

  return {
    filename,
    signedUrl,
  };
}
