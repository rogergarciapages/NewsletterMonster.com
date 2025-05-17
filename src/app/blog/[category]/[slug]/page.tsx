import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAllCategoryData,
  getAllPostSlugs,
  getPostBySlug,
  getPostsMetadataForCategory,
} from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

import BlogImage from "../../components/blog-image";

// Fallback component for when MDX content fails to render
function MDXErrorFallback({ error }: { error: Error }) {
  return (
    <div className="rounded-md bg-red-50 p-4 text-red-800">
      <h3 className="mb-2 text-lg font-medium">Error rendering content</h3>
      <p>There was an error rendering this content. Please try again later.</p>
      <p className="mt-2 text-sm text-red-600">{error.message}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const post = await getPostBySlug(params.category, params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Newsletter Monster Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  console.log("Generating static params for blog posts");
  try {
    const posts = await getAllPostSlugs();
    console.log(`Generated static params for ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
    return [];
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  try {
    console.log(`Rendering blog post page for ${params.category}/${params.slug}`);
    const post = await getPostBySlug(params.category, params.slug);

    if (!post) {
      console.error(`Post not found: ${params.category}/${params.slug}`);
      notFound();
    }

    // Get categories for sidebar
    const categories = await getAllCategoryData();

    // Get related posts (same category, excluding current post)
    const categoryPosts = await getPostsMetadataForCategory(params.category);
    const relatedPosts = categoryPosts.filter(p => p.slug !== params.slug).slice(0, 3);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Main content */}
          <div className="md:w-2/3">
            <div className="mb-4">
              <Link
                href={`/blog/${params.category}`}
                className="mb-2 inline-block text-primary hover:underline"
              >
                ← Back to {params.category.replace(/-/g, " ")}
              </Link>
            </div>

            <article className="overflow-hidden rounded-lg bg-card shadow-md">
              <div className="relative h-64 w-full">
                <BlogImage src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.date)} • {params.category.replace(/-/g, " ")}
                  </span>
                  <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
                  <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                </div>

                <div className="prose prose-lg max-w-none">{post.content}</div>
              </div>
            </article>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Related Articles</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map(relatedPost => (
                    <div
                      key={relatedPost.slug}
                      className="overflow-hidden rounded-lg bg-card shadow-md"
                    >
                      <div className="relative h-40 w-full">
                        <BlogImage
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(relatedPost.date)}
                        </span>
                        <h3 className="mb-2 mt-2 text-lg font-bold">
                          <Link
                            href={`/blog/${relatedPost.category}/${relatedPost.slug}`}
                            className="transition-colors hover:text-primary"
                          >
                            {relatedPost.title}
                          </Link>
                        </h3>
                        <Link
                          href={`/blog/${relatedPost.category}/${relatedPost.slug}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="mb-6 rounded-lg bg-card p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Categories</h2>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li
                    key={category.slug}
                    className={category.slug === params.category ? "font-bold" : ""}
                  >
                    <Link
                      href={`/blog/${category.slug}`}
                      className={`block py-1 ${category.slug === params.category ? "text-primary" : "hover:text-primary"}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-card p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Subscribe</h2>
              <p className="mb-4 text-muted-foreground">
                Get the latest newsletter tips and strategies delivered directly to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-md border px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering blog post page for ${params.category}/${params.slug}:`, error);
    // Display a more user-friendly error page instead of notFound()
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Error Loading Blog Post</h1>
          <p className="mb-4 text-red-700">
            We encountered an error while trying to load this blog post. This might be due to a
            temporary issue.
          </p>
          <div className="mt-6">
            <Link
              href="/blog"
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Return to Blog Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
