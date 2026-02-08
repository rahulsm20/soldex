import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import dayjs from "dayjs";
import PDFKit from "pdfkit";

/**
 * Function to format a date string in ISO format to a long date format with 24-hour time.
 * @param dateISO
 * @returns
 */
export function formatDateLong24h(dateISO: string): string {
  const date = new Date(dateISO);
  return dayjs(date).format("YYYY-MM-DD HH:mm");
}

/**
 * Function to format a date string in ISO format to a long date format with 12-hour time and AM/PM.
 * @param dateISO
 * @returns string
 */
export function formatDateLong12h(dateISO: string): string {
  const date = new Date(dateISO);
  return dayjs(date).format("YYYY-MM-DD hh:mm A");
}

export function formatDateISO(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}

export function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
/**
 * Renders a line chart into the provided PDF document.
 * @param doc
 * @param labels
 * @param values
 */
export async function renderLineChart(
  doc: PDFKit.PDFDocument,
  labels: string[],
  values: { label: string; data: number[]; borderColor: string }[],
) {
  const canvas = new ChartJSNodeCanvas({
    width: 800,
    height: 400,
  });

  const image = await canvas.renderToBuffer({
    type: "line",
    data: {
      labels,
      datasets: values,
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            font: {
              family: "Inter",
              size: 10,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              family: "Inter",
              size: 9,
            },
          },
        },
        y: {
          ticks: {
            font: {
              family: "Inter",
              size: 9,
            },
          },
        },
      },
    },
  });

  doc.image(image, { width: 500 });
}
