import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { Request } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import { formatDateISO, getRandomColor, renderLineChart } from "shared/utils";
import { ACCOUNTS, ACCOUNTS_MAP, LOGO_URL } from "shared/utils/constants";
import interFont from "../../assets/fonts/Inter-VariableFont_opsz,wght.ttf";
import { getSignedURL, uploadToS3 } from "./s3";
import {
  getTransactionsChartDataUtil,
  getTransactionsUtil,
} from "./transactions";

//--------------------------------------------------------------

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
export async function renderTransactionsReport(
  req: Request,
  title?: string,
): Promise<Buffer> {
  const { address, limit, page, pageSize, startTime, endTime } = req.query;
  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];
  const fontPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    interFont,
  );

  doc.registerFont("Inter", fontPath, "Inter");
  doc.font(fontPath);
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});
  const response = await fetch(LOGO_URL);
  const logo = await response.arrayBuffer();
  const y = 45;
  let pageNumber = 1;
  const addFooter = () => {
    const year = new Date().getFullYear();
    doc.fontSize(10).text(`© ${year} Soldex`, 20, doc.page.height - 50, {
      lineBreak: false,
    });
    doc
      .fontSize(6)
      .text(`Page ${pageNumber}`, doc.page.width - 100, doc.page.height - 50, {
        lineBreak: false,
      });
    pageNumber += 1;
  };
  addFooter();
  doc.image(logo, 50, y, { width: 10 });

  doc.fontSize(20).text("Soldex", 65, y - 2);

  doc.fontSize(12).text(title || "Transactions Report", { align: "left" });
  doc.moveDown();
  // Register footer for every page
  doc.on("pageAdded", addFooter);

  const transactions = await getTransactionsUtil({
    address: address as string,
    limit: limit ? Number(limit) : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    startTime: startTime as string,
    endTime: endTime as string,
  });
  const chartData = await getTransactionsChartDataUtil(req);
  const values: { label: string; data: number[]; borderColor: string }[] = [];

  const labels = chartData.map((data) => {
    const date = formatDateISO(new Date(data.time));
    for (let key of Object.keys(data)) {
      if (key !== "time") {
        const mapKey = ACCOUNTS_MAP[key] || key;
        let entry = values.find((v) => v.label === mapKey);
        if (!entry) {
          entry = {
            label: mapKey,
            data: [],
            borderColor: getRandomColor(),
          };
          values.push(entry);
        }
        if (data?.[key]) {
          entry.data.push(data?.[key] as number);
        }
      }
    }
    return date;
  });
  await renderLineChart(doc, labels, values);
  doc.moveDown();

  const tokens = ACCOUNTS.map((account) => [account.label, account.sig]);
  doc.text("Mint Addresses");
  doc.moveDown();
  const legendTableData: PDFKit.Mixins.TableOptionsWithData["data"] = [
    ["Token", "Mint Address"],
    ...tokens,
  ];

  doc.fontSize(6).table({ data: legendTableData });
  doc.moveDown();

  const mappedTransactions =
    transactions?.transactions?.map((tx, idx) => [
      (idx + 1).toString(),
      dayjs(tx.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      tx.address ?? "N/A",
      {
        text: tx.signature,
        url: `https://solscan.io/tx/${tx.signature}`,
        link: `https://solscan.io/tx/${tx.signature}`,
        underline: true,
        color: "blue",
      },
      tx.slot.toString(),
      tx.from_address ?? "N/A",
      tx.to_address ?? "N/A",
    ]) || [];

  if (mappedTransactions.length === 0) {
    mappedTransactions.push(["No transactions found", "", "", "", "", "", ""]);
  }

  doc.text("Transactions");
  doc.moveDown();

  const tableData: PDFKit.Mixins.TableOptionsWithData["data"] = [
    ["#", "Date", "Mint Address", "Signature", "Slot", "From", "To"],
    ...mappedTransactions,
  ];

  doc.fontSize(6).table({
    data: tableData,
  });

  doc.end();

  await new Promise<void>((resolve) => doc.on("end", resolve));

  return Buffer.concat(chunks);
}

//--------------------------------------------------------------
export async function generatePDF(pdfBuffer: Buffer, name?: string) {
  const filename = `${name}.pdf` || `pdfs/${randomUUID()}.pdf`;

  await uploadToS3(pdfBuffer, filename, "application/pdf");

  const signedUrl = await getSignedURL(filename, 60 * 10); // 10 minutes

  return {
    filename,
    signedUrl,
  };
}
