import { expect, test } from "bun:test";

test("should return 200 OK", async () => {
  const response = await fetch("http://localhost:3002");
  const data = await response.json();
  expect(response.status).toBe(200);
  expect(data).toEqual({ message: "Service running", status: "ok" });
});
