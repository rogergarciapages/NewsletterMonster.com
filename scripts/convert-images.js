const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const blogImagesDir = path.join(__dirname, "../public/images/blog");

// Convert JPG to WebP
async function convertToWebP() {
  try {
    const files = fs.readdirSync(blogImagesDir);

    for (const file of files) {
      if (file.endsWith(".jpg")) {
        const inputPath = path.join(blogImagesDir, file);
        const outputPath = path.join(blogImagesDir, file.replace(".jpg", ".webp"));

        console.log(`Converting ${file} to WebP...`);

        await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

        console.log(`Created ${outputPath}`);
      }
    }

    console.log("All images converted successfully!");
  } catch (error) {
    console.error("Error converting images:", error);
  }
}

convertToWebP();
