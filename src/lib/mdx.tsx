import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";

// Types for blog posts
export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  coverImage: string;
  content: React.ReactElement;
};

export type BlogPostMeta = Omit<BlogPost, "content">;

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

// Get post data by category and slug
export async function getPostBySlug(category: string, slug: string): Promise<BlogPost | null> {
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

    // Step 7: Compile the MDX content with better error handling
    try {
      console.log("Compiling MDX content...");

      // Check if content is too large (might cause memory issues)
      if (content.length > 50000) {
        // ~50KB threshold
        console.warn(
          `Content for ${slug} is very large (${content.length} bytes), using fallback rendering`
        );
        // Skip compilation for very large content
        return {
          slug: fileSlug!,
          category,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt,
          author: data.author,
          coverImage,
          content: (
            <div className="prose prose-lg">
              <div className="mb-4 rounded-md bg-amber-50 p-4">
                <p className="text-amber-800">
                  <strong>Note:</strong> This content is being displayed in simplified format due to
                  its size.
                </p>
              </div>
              <div className="markdown-content">
                {content.split("\n").map((line, i) => {
                  // Basic markdown parsing for headings
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="my-4 text-3xl font-bold">
                        {line.substring(2)}
                      </h1>
                    );
                  } else if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="my-3 text-2xl font-bold">
                        {line.substring(3)}
                      </h2>
                    );
                  } else if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="my-2 text-xl font-bold">
                        {line.substring(4)}
                      </h3>
                    );
                  } else if (line.trim() === "") {
                    return <br key={i} />;
                  } else {
                    return (
                      <p key={i} className="my-2">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          ),
        };
      }

      // Use a simpler MDX compilation approach with fewer plugins
      const mdxSource = await compileMDX({
        source: content,
        options: {
          mdxOptions: {
            development: process.env.NODE_ENV === "development",
            rehypePlugins: [], // Remove plugins to simplify compilation
          },
        },
      });

      console.log("MDX compilation successful");

      // Step 8: Return the compiled blog post
      return {
        slug: fileSlug!,
        category,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        coverImage,
        content: mdxSource.content,
      };
    } catch (mdxError) {
      console.error(`Error compiling MDX for ${slug}:`, mdxError);

      // Return the post with raw content instead of failing completely
      console.log("Falling back to raw content display");

      // Create a simplified version of the content with basic formatting
      return {
        slug: fileSlug!,
        category,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        coverImage,
        content: (
          <div className="prose prose-lg">
            <div className="mb-4 rounded-md bg-amber-50 p-4">
              <p className="text-amber-800">
                <strong>Note:</strong> This content couldn't be fully rendered. Showing simplified
                version instead.
              </p>
            </div>
            <div className="markdown-content">
              {content.split("\n").map((line, i) => {
                // Basic markdown parsing for headings
                if (line.startsWith("# ")) {
                  return (
                    <h1 key={i} className="my-4 text-3xl font-bold">
                      {line.substring(2)}
                    </h1>
                  );
                } else if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="my-3 text-2xl font-bold">
                      {line.substring(3)}
                    </h2>
                  );
                } else if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="my-2 text-xl font-bold">
                      {line.substring(4)}
                    </h3>
                  );
                } else if (line.trim() === "") {
                  return <br key={i} />;
                } else {
                  return (
                    <p key={i} className="my-2">
                      {line}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        ),
      };
    }
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
