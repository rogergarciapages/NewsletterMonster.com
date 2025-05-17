import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import rehypePrism from "rehype-prism-plus";

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

    // Check if directory exists
    if (!fs.existsSync(blogDir)) {
      console.error(`Blog directory not found: ${blogDir}`);
      return [];
    }

    const categories = fs.readdirSync(blogDir);
    const allSlugs: { params: { category: string; slug: string } }[] = [];
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
                console.warn(`Duplicate slug detected: ${slugKey}`);
                // Skip this entry to avoid conflicts
                continue;
              }

              // Register this slug
              slugRegistry.set(slugKey, filePath);

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

    return allSlugs;
  } catch (error) {
    console.error("Error getting all post slugs:", error);
    return [];
  }
}

// Get post data by category and slug
export async function getPostBySlug(category: string, slug: string): Promise<BlogPost | null> {
  try {
    // First, try to find a post with a matching custom slug
    const categoryDir = path.join(contentDirectory, "blog", category);
    if (!fs.existsSync(categoryDir)) {
      console.error(`Category directory not found: ${categoryDir}`);
      return null;
    }

    // Read all files in the category directory to find matching custom slug
    const files = fs.readdirSync(categoryDir).filter(filename => filename.endsWith(".mdx"));

    let targetFile = `${slug}.mdx`;
    let fileFound = false;

    // Check if we need to search for a custom slug
    for (const filename of files) {
      const filePath = path.join(categoryDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // If this file has a custom slug that matches our requested slug
      if (data.slug === slug) {
        targetFile = filename;
        fileFound = true;
        break;
      }
    }

    // If we didn't find a file with a matching custom slug, fallback to the slug as filename
    const postPath = path.join(categoryDir, targetFile);

    if (!fileFound && !fs.existsSync(postPath)) {
      console.error(`Post file not found: ${postPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(postPath, "utf8");
    console.log(`File contents loaded, length: ${fileContents.length}`);

    const { content, data } = matter(fileContents);
    console.log("Front matter parsed:", data);

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

    try {
      console.log("Compiling MDX content...");
      const mdxSource = await compileMDX({
        source: content,
        options: {
          mdxOptions: {
            rehypePlugins: [rehypePrism],
          },
        },
      });
      console.log("MDX compilation successful");

      return {
        slug: data.slug || slug,
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
      throw mdxError;
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
    let allPosts: BlogPostMeta[] = [];

    for (const category of categories) {
      try {
        const categoryDir = path.join(blogDir, category);
        if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
          const posts = await getPostsMetadataForCategory(category);
          allPosts = [...allPosts, ...posts];
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
