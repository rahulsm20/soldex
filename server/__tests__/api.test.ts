import { config } from "@/utils/config";
import { afterAll, beforeAll, expect, test } from "bun:test";
import { startServer, stopServer } from "../src/server";

let server: ReturnType<typeof startServer>;

beforeAll(() => {
  server = startServer();
});

afterAll(() => {
  stopServer(server);
});

test("should return 200 OK", async () => {
  const response = await fetch(`http://localhost:${config.PORT || 3002}`);
  const data = await response.json();
  expect(response.status).toBe(200);
  expect(data).toEqual({ message: "Service running", status: "ok" });
});
