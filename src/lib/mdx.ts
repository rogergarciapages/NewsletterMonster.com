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

// Get all category slugs
export async function getAllCategoryData() {
  const categoriesDir = path.join(contentDirectory, "categories");
  const categoryFiles = fs.readdirSync(categoriesDir);

  return categoryFiles.map(filename => {
    const filePath = path.join(categoriesDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const categoryData = JSON.parse(fileContents);

    return categoryData;
  });
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const categoriesDir = path.join(contentDirectory, "categories");
  const categoryFiles = fs.readdirSync(categoriesDir);

  for (const filename of categoryFiles) {
    const filePath = path.join(categoriesDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const categoryData = JSON.parse(fileContents);

    if (categoryData.slug === slug) {
      return categoryData;
    }
  }

  return null;
}

// Get all post slugs for a specific category
export async function getPostSlugsForCategory(category: string) {
  const categoryDir = path.join(contentDirectory, "blog", category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  return fs
    .readdirSync(categoryDir)
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => filename.replace(/\.mdx$/, ""));
}

// Get all post slugs across all categories
export async function getAllPostSlugs() {
  const blogDir = path.join(contentDirectory, "blog");
  const categories = fs.readdirSync(blogDir);

  const allSlugs: { params: { category: string; slug: string } }[] = [];

  for (const category of categories) {
    const categoryDir = path.join(blogDir, category);
    if (fs.statSync(categoryDir).isDirectory()) {
      const slugs = fs
        .readdirSync(categoryDir)
        .filter(filename => filename.endsWith(".mdx"))
        .map(filename => ({
          params: {
            category,
            slug: filename.replace(/\.mdx$/, ""),
          },
        }));

      allSlugs.push(...slugs);
    }
  }

  return allSlugs;
}

// Get post data by category and slug
export async function getPostBySlug(category: string, slug: string): Promise<BlogPost | null> {
  const postPath = path.join(contentDirectory, "blog", category, `${slug}.mdx`);

  if (!fs.existsSync(postPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(postPath, "utf8");
  const { content, data } = matter(fileContents);

  const mdxSource = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypePrism],
      },
    },
  });

  return {
    slug,
    category,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    author: data.author,
    coverImage: data.coverImage,
    content: mdxSource.content,
  };
}

// Get post metadata for a specific category
export async function getPostsMetadataForCategory(category: string): Promise<BlogPostMeta[]> {
  const categoryDir = path.join(contentDirectory, "blog", category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const posts = fs
    .readdirSync(categoryDir)
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => {
      const filePath = path.join(categoryDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      const slug = filename.replace(/\.mdx$/, "");

      return {
        slug,
        category,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        coverImage: data.coverImage,
      };
    });

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get all post metadata across all categories
export async function getAllPostsMetadata(): Promise<BlogPostMeta[]> {
  const blogDir = path.join(contentDirectory, "blog");
  const categories = fs.readdirSync(blogDir);

  let allPosts: BlogPostMeta[] = [];

  for (const category of categories) {
    const categoryDir = path.join(blogDir, category);
    if (fs.statSync(categoryDir).isDirectory()) {
      const posts = await getPostsMetadataForCategory(category);
      allPosts = [...allPosts, ...posts];
    }
  }

  // Sort by date (newest first)
  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
