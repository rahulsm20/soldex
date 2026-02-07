import { config } from "@/utils/config";
import { S3Client } from "bun";

const s3 = new S3Client({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY || "",
  bucket: config.AWS_S3_BUCKET || "",
});

export async function uploadToS3(
  fileBuffer: Uint8Array,
  fileName: string,
  contentType: string,
) {
  return await s3.write(fileName, fileBuffer, { type: contentType });
}

export async function getSignedURL(fileName: string, expiresInSeconds = 3600) {
  return s3.presign(fileName, { expiresIn: expiresInSeconds });
}
