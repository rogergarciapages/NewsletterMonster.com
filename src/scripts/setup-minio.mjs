// src/scripts/setup-minio.mjs
import * as dotenv from "dotenv";
import { Client } from "minio";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT?.replace("https://", ""),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const BUCKET_NAME = process.env.MINIO_BUCKET;

const publicReadPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        AWS: ["*"]
      },
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${BUCKET_NAME}/public/*`]
    }
  ]
};

const defaultHeaders = {
  "Content-Type": "application/octet-stream",
  "Cache-Control": "no-cache",
  "x-amz-acl": "public-read",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
  "Access-Control-Allow-Headers": "*"
};

async function setupMinio() {
  try {
    console.log("Starting MinIO setup...");

    // Check if bucket exists
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
    }

    // Set bucket policy
    console.log("Setting bucket policy...");
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(publicReadPolicy));

    // Create public directory
    console.log("Creating public directory...");
    await minioClient.putObject(
      BUCKET_NAME,
      "public/",
      Buffer.from(""),
      0,
      defaultHeaders
    );

    console.log("MinIO setup completed successfully!");
  } catch (error) {
    console.error("Error during MinIO setup:", error);
    process.exit(1);
  }
}

// Run setup
setupMinio().catch(console.error);

// Add process handling for clean exit
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});