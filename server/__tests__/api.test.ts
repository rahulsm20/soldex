import app from "@/app";
import { expect, test } from "bun:test";
import request from "supertest";

test("should return 200 OK", async () => {
  const response = await request(app).get("/").send();
  const data = response.body;
  expect(response.status).toBe(200);
  expect(data).toEqual({ message: "Service running", status: "ok" });
});
