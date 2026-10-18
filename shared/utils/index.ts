import { config } from "@/config";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import dayjs from "dayjs";
import PDFKit from "pdfkit";
import { Auth0User } from "./types";
import { Request } from "express";

//----------------------------------------------

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

/**
 * Function to format a date string in ISO format to a long date format with 12-hour time and AM/PM.
 * @param dateISO
 * @returns string
 */
export function formatDateShort(dateISO: string): string {
  const date = new Date(dateISO);
  return dayjs(date).format("YYYY-MM-DD");
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
  doc: typeof PDFKit,
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

export const getUserInfo = async (token: string) => {
  if (!token) return null;
  const response = await fetch(`${config.AUTH0_BASE_URL}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = (await response.json()) as Auth0User;

  return user;
};

export const generateDocKey = (id: string, fileName: string) => {
  return `${id}_${fileName}`;
};

export const getTokenFromHeader = (req: Request) => {
  if (!req.headers) return null;
  const AUTH_FORWARDED_TOKEN_HEADER = "x-forwarded-authorization";
  const isProduction = config.nodeEnv === "production";
  if (isProduction) {
    const tokens = req.headers?.[AUTH_FORWARDED_TOKEN_HEADER];
    if (!tokens) return null;
    const token = (Array.isArray(tokens) ? tokens?.[0] : tokens)?.split(" ")[1];
    return token;
  }
  const token = req.headers?.authorization?.split(" ")[1];
  return token;
};
