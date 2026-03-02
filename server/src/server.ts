import { config } from "@/utils/config";
import app from "./app";

const port = config.PORT || 3002;

const server = app.listen(port, () => {
  console.log(`>> Server is running at port ${port}`);
});

process.on("SIGINT", () => {
  console.log(">> SIGINT received, shutting down server...");
  server.close(() => process.exit(0));
});
