import app from "@/app";
import { ChartDataResponse, TransactionsResponse } from "@soldex/types";
import { expect, test } from "bun:test";
import request from "supertest";

test("health check", async () => {
  const response = await request(app).get("/").send();
  const data = response.body;
  expect(response.status).toBe(200);
  expect(data).toEqual({ message: "Service running", status: "ok" });
});

test("chart data", async () => {
  const response = await request(app).get("/charts").send();
  const data = response.body as ChartDataResponse[];
  expect(response.status).toBe(200);
  expect(Array.isArray(data)).toBe(true);
  data.forEach((item) => {
    expect(item).toHaveProperty("time");
  });
});

test("invalid route", async () => {
  const response = await request(app).get("/invalid-route").send();
  expect(response.status).toBe(404);
  expect(response.body).toBe("Invalid route");
});

test("transactions", async () => {
  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago
  const endTime = new Date().toISOString();
  const response = await request(app)
    .get(
      `/transactions?limit=10&page=1&pageSize=10&startTime=${startTime}&endTime=${endTime}`,
    )
    .send();
  const data = response.body as TransactionsResponse;
  expect(response.status).toBe(200);
  expect(Array.isArray(data.transactions)).toBe(true);
  expect(data).toHaveProperty("page");
  expect(data).toHaveProperty("pageSize");
  expect(data).toHaveProperty("pageCount");
});
