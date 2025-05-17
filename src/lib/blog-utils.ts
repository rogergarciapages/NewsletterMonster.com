import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Base directory for content
const contentDirectory = path.join(process.cwd(), "content");

// Default cover image that's guaranteed to exist
const DEFAULT_COVER_IMAGE = "/images/blog/default-cover.jpg";

// Simple function to get post data without MDX compilation
export async function getSimplePostBySlug(category: string, slug: string) {
  try {
    // Step 1: Check if the category directory exists
    const categoryDir = path.join(contentDirectory, "blog", category);
    if (!fs.existsSync(categoryDir)) {
      console.error(`Category directory not found: ${categoryDir}`);
      return null;
    }

    // Step 2: Get all MDX files in the category directory
    const files = fs.readdirSync(categoryDir).filter(filename => filename.endsWith(".mdx"));
    if (files.length === 0) {
      console.error(`No MDX files found in category directory: ${categoryDir}`);
      return null;
    }

    // Step 3: Find the file with matching slug (either in frontmatter or filename)
    let targetFilePath: string | null = null;
    let fileSlug: string | null = null;

    console.log(`Looking for post with slug '${slug}' in category '${category}'`);

    for (const filename of files) {
      try {
        const filePath = path.join(categoryDir, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const currentFileSlug = data.slug || filename.replace(/\.mdx$/, "");

        console.log(`Checking file: ${filename}, slug: ${currentFileSlug}`);

        if (currentFileSlug === slug) {
          targetFilePath = filePath;
          fileSlug = currentFileSlug;
          console.log(`✓ Match found in file: ${filename}`);
          break;
        }
      } catch (err) {
        console.error(`Error reading file ${filename}:`, err);
      }
    }

    // Step 4: If no matching file was found, return null
    if (!targetFilePath) {
      console.error(`No file with slug '${slug}' found in category '${category}'`);
      return null;
    }

    // Step 5: Read and parse the matching file
    console.log(`Reading matched file at: ${targetFilePath}`);
    const fileContents = fs.readFileSync(targetFilePath, "utf8");
    const { content, data } = matter(fileContents);

    // Step 6: Prepare the cover image
    let coverImage = data.coverImage || DEFAULT_COVER_IMAGE;
    if (coverImage.startsWith("/")) {
      const imagePath = path.join(process.cwd(), "public", coverImage);
      if (!fs.existsSync(imagePath)) {
        console.warn(`Cover image not found: ${imagePath}, using default image`);
        coverImage = DEFAULT_COVER_IMAGE;
      }
    }

    // Return the post data without MDX compilation
    return {
      slug: fileSlug!,
      category,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
      coverImage,
      content, // Raw content string, not compiled
    };
  } catch (error) {
    console.error(`Error getting post by slug ${category}/${slug}:`, error);
    return null;
  }
}
