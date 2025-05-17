import React from "react";

import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Types for blog posts
export type SimpleBlogPost = {
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  coverImage: string;
  content: string; // Raw content as string
};

export type BlogPostMeta = Omit<SimpleBlogPost, "content">;

// Base directory for content
const contentDirectory = path.join(process.cwd(), "content");

// Default cover image that's guaranteed to exist
const DEFAULT_COVER_IMAGE = "/images/blog/default-cover.jpg";

// Get all category slugs
export async function getAllCategoryData() {
  try {
    const categoriesDir = path.join(contentDirectory, "categories");

    // Check if directory exists
    if (!fs.existsSync(categoriesDir)) {
      console.error(`Categories directory not found: ${categoriesDir}`);
      return [];
    }

    const categoryFiles = fs.readdirSync(categoriesDir);

    return categoryFiles
      .map(filename => {
        try {
          const filePath = path.join(categoriesDir, filename);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const categoryData = JSON.parse(fileContents);
          return categoryData;
        } catch (error) {
          console.error(`Error processing category file ${filename}:`, error);
          return null;
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error getting all category data:", error);
    return [];
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const categoriesDir = path.join(contentDirectory, "categories");

    // Check if directory exists
    if (!fs.existsSync(categoriesDir)) {
      console.error(`Categories directory not found: ${categoriesDir}`);
      return null;
    }

    const categoryFiles = fs.readdirSync(categoriesDir);

    for (const filename of categoryFiles) {
      try {
        const filePath = path.join(categoriesDir, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const categoryData = JSON.parse(fileContents);

        if (categoryData.slug === slug) {
          return categoryData;
        }
      } catch (error) {
        console.error(`Error processing category file ${filename}:`, error);
      }
    }

    return null;
  } catch (error) {
    console.error(`Error getting category by slug ${slug}:`, error);
    return null;
  }
}

// Get all post slugs for a specific category
export async function getPostSlugsForCategory(category: string) {
  try {
    const categoryDir = path.join(contentDirectory, "blog", category);

    if (!fs.existsSync(categoryDir)) {
      console.error(`Category directory not found: ${categoryDir}`);
      return [];
    }

    return fs
      .readdirSync(categoryDir)
      .filter(filename => filename.endsWith(".mdx"))
      .map(filename => filename.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error(`Error getting post slugs for category ${category}:`, error);
    return [];
  }
}

// Get all post slugs across all categories
export async function getAllPostSlugs() {
  try {
    const blogDir = path.join(contentDirectory, "blog");
    console.log(`Fetching all post slugs from: ${blogDir}`);

    // Check if directory exists
    if (!fs.existsSync(blogDir)) {
      console.error(`Blog directory not found: ${blogDir}`);
      return [];
    }

    const categories = fs.readdirSync(blogDir);
    const allSlugs: { params: { category: string; slug: string } }[] = [];
    const slugRegistry = new Map<string, boolean>(); // Track slug conflicts

    for (const category of categories) {
      try {
        const categoryDir = path.join(blogDir, category);
        if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
          const files = fs.readdirSync(categoryDir).filter(filename => filename.endsWith(".mdx"));
          console.log(`Found ${files.length} MDX files in category: ${category}`);

          for (const filename of files) {
            try {
              const filePath = path.join(categoryDir, filename);
              const fileContents = fs.readFileSync(filePath, "utf8");
              const { data } = matter(fileContents);
              const fileSlug = filename.replace(/\.mdx$/, "");

              // Use custom slug if available, otherwise use the filename
              const slug = data.slug || fileSlug;

              // Check for duplicate slugs across categories
              const slugKey = `${category}/${slug}`;
              if (slugRegistry.has(slugKey)) {
                console.warn(`Duplicate slug detected: ${slugKey}, skipping`);
                continue;
              }

              // Register this slug
              slugRegistry.set(slugKey, true);

              console.log(`Adding slug: ${category}/${slug}`);
              allSlugs.push({
                params: {
                  category,
                  slug,
                },
              });
            } catch (error) {
              console.error(`Error processing file ${filename}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing category directory ${category}:`, error);
      }
    }

    console.log(`Total slugs found: ${allSlugs.length}`);
    return allSlugs;
  } catch (error) {
    console.error("Error getting all post slugs:", error);
    return [];
  }
}

// Get post data by category and slug (without MDX compilation)
export async function getSimplePostBySlug(
  category: string,
  slug: string
): Promise<SimpleBlogPost | null> {
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

    // Return the post with raw content
    return {
      slug: fileSlug!,
      category,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
      coverImage,
      content, // Raw content as string, no MDX compilation
    };
  } catch (error) {
    console.error(`Error getting post by slug ${category}/${slug}:`, error);
    return null;
  }
}

// Get post metadata for a specific category
export async function getPostsMetadataForCategory(category: string): Promise<BlogPostMeta[]> {
  try {
    const categoryDir = path.join(contentDirectory, "blog", category);

    if (!fs.existsSync(categoryDir)) {
      console.error(`Category directory not found: ${categoryDir}`);
      return [];
    }

    const files = fs.readdirSync(categoryDir).filter(filename => filename.endsWith(".mdx"));
    const slugRegistry = new Map<string, string>(); // Track slug conflicts

    const posts = files
      .map(filename => {
        try {
          const filePath = path.join(categoryDir, filename);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          const fileSlug = filename.replace(/\.mdx$/, "");

          // Use custom slug if available, otherwise use the filename
          const slug = data.slug || fileSlug;

          // Check for duplicate slugs
          if (slugRegistry.has(slug)) {
            console.warn(`Duplicate slug detected in category ${category}: ${slug}`);
            // Skip this entry to avoid conflicts
            return null;
          }

          // Register this slug
          slugRegistry.set(slug, filePath);

          // Provide fallback image if needed
          let coverImage = data.coverImage || DEFAULT_COVER_IMAGE;

          // Ensure cover image exists in public directory
          if (coverImage.startsWith("/")) {
            const imagePath = path.join(process.cwd(), "public", coverImage);
            if (!fs.existsSync(imagePath)) {
              console.warn(`Cover image not found: ${imagePath}, using default image`);
              coverImage = DEFAULT_COVER_IMAGE;
            }
          }

          return {
            slug,
            category,
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
            author: data.author,
            coverImage,
          };
        } catch (error) {
          console.error(`Error processing post file ${filename}:`, error);
          return null;
        }
      })
      .filter(Boolean) as BlogPostMeta[];

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error getting posts metadata for category ${category}:`, error);
    return [];
  }
}

// Get all post metadata across all categories
export async function getAllPostsMetadata(): Promise<BlogPostMeta[]> {
  try {
    const blogDir = path.join(contentDirectory, "blog");

    // Check if directory exists
    if (!fs.existsSync(blogDir)) {
      console.error(`Blog directory not found: ${blogDir}`);
      return [];
    }

    const categories = fs.readdirSync(blogDir);
    const allPosts: BlogPostMeta[] = [];
    const slugRegistry = new Map<string, string>(); // Track slug conflicts

    for (const category of categories) {
      try {
        const categoryDir = path.join(blogDir, category);
        if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
          const files = fs.readdirSync(categoryDir).filter(filename => filename.endsWith(".mdx"));

          for (const filename of files) {
            try {
              const filePath = path.join(categoryDir, filename);
              const fileContents = fs.readFileSync(filePath, "utf8");
              const { data } = matter(fileContents);
              const fileSlug = filename.replace(/\.mdx$/, "");

              // Use custom slug if available, otherwise use the filename
              const slug = data.slug || fileSlug;

              // Check for duplicate slugs across categories
              const slugKey = `${category}/${slug}`;
              if (slugRegistry.has(slugKey)) {
                console.warn(`Duplicate slug detected: ${slugKey}, skipping`);
                continue;
              }

              // Register this slug
              slugRegistry.set(slugKey, filePath);

              // Provide fallback image if needed
              let coverImage = data.coverImage || DEFAULT_COVER_IMAGE;

              // Ensure cover image exists in public directory
              if (coverImage.startsWith("/")) {
                const imagePath = path.join(process.cwd(), "public", coverImage);
                if (!fs.existsSync(imagePath)) {
                  console.warn(`Cover image not found: ${imagePath}, using default image`);
                  coverImage = DEFAULT_COVER_IMAGE;
                }
              }

              allPosts.push({
                slug,
                category,
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
                author: data.author,
                coverImage,
              });
            } catch (error) {
              console.error(`Error processing file ${filename}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing category ${category}:`, error);
      }
    }

    // Sort by date (newest first)
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error getting all posts metadata:", error);
    return [];
  }
}

// Simple function to format markdown content into HTML
export function formatMarkdown(markdown: string): React.ReactNode {
  const formattedContent = [];
  let key = 0;
  let inCodeBlock = false;
  let codeBlockContent = "";
  let codeBlockLanguage = "";
  let inOrderedList = false;
  let inUnorderedList = false;
  let listItems: React.ReactNode[] = [];

  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
        codeBlockContent = "";
      } else {
        // End of code block
        inCodeBlock = false;
        formattedContent.push(
          <div key={key++} className="my-4 overflow-auto rounded-md bg-gray-800 p-4">
            <pre className="text-white">
              <code>{codeBlockContent}</code>
            </pre>
          </div>
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += `${line}\n`;
      continue;
    }

    // Handle list endings
    if (inOrderedList && !line.match(/^\d+\. /)) {
      inOrderedList = false;
      formattedContent.push(
        <ol key={key++} className="list-decimal pl-6">
          {listItems}
        </ol>
      );
      listItems = [];
    }

    if (inUnorderedList && !line.startsWith("- ")) {
      inUnorderedList = false;
      formattedContent.push(
        <ul key={key++} className="list-disc pl-6">
          {listItems}
        </ul>
      );
      listItems = [];
    }

    // Handle headings
    if (line.startsWith("# ")) {
      formattedContent.push(
        <h1 key={key++} className="my-4 text-3xl font-bold">
          {processInlineFormatting(line.substring(2))}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      formattedContent.push(
        <h2 key={key++} className="my-3 text-2xl font-bold">
          {processInlineFormatting(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      formattedContent.push(
        <h3 key={key++} className="my-2 text-xl font-bold">
          {processInlineFormatting(line.substring(4))}
        </h3>
      );
      // Handle lists
    } else if (line.startsWith("- ")) {
      if (!inUnorderedList) {
        inUnorderedList = true;
        listItems = [];
      }
      listItems.push(
        <li key={`list-${key++}`} className="my-1">
          {processInlineFormatting(line.substring(2))}
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      if (!inOrderedList) {
        inOrderedList = true;
        listItems = [];
      }
      listItems.push(
        <li key={`list-${key++}`} className="my-1">
          {processInlineFormatting(line.replace(/^\d+\. /, ""))}
        </li>
      );
      // Handle blank lines
    } else if (line.trim() === "") {
      if (!inOrderedList && !inUnorderedList) {
        formattedContent.push(<br key={key++} />);
      }
      // Handle horizontal rule
    } else if (line.startsWith("---")) {
      formattedContent.push(<hr key={key++} className="my-4 border-t border-gray-300" />);
      // Handle paragraphs
    } else {
      formattedContent.push(
        <p key={key++} className="my-2">
          {processInlineFormatting(line)}
        </p>
      );
    }
  }

  // Handle any unclosed lists
  if (inOrderedList) {
    formattedContent.push(
      <ol key={key++} className="list-decimal pl-6">
        {listItems}
      </ol>
    );
  }

  if (inUnorderedList) {
    formattedContent.push(
      <ul key={key++} className="list-disc pl-6">
        {listItems}
      </ul>
    );
  }

  return <div className="markdown-content">{formattedContent}</div>;
}

// Helper function to process inline markdown formatting
function processInlineFormatting(text: string): React.ReactNode {
  // Process links first
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(processTextFormatting(text.substring(lastIndex, match.index)));
    }
    parts.push(
      <a key={`link-${match.index}`} href={match[2]} className="text-blue-600 hover:underline">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(processTextFormatting(text.substring(lastIndex)));
  }

  return parts.length > 0 ? parts : text;
}

// Helper function to process other text formatting (bold, italic)
function processTextFormatting(text: string): React.ReactNode {
  // Process bold with ** or __
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Process italic with * or _
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/_([^_]+)_/g, "<em>$1</em>");

  // If HTML tags were added, use dangerouslySetInnerHTML
  if (text.includes("<")) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  return text;
}
