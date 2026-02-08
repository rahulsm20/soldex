import { redisClient } from "@/shared/redis";
import { Queue } from "bullmq";

/** Queue for processing transaction jobs */
export const txQueue = new Queue("tx", {
  connection: redisClient,
});
