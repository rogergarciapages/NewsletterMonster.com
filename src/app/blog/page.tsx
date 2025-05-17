import NextLink from "@/app/components/ui/next-link";
import { getAllCategoryData, getAllPostsMetadata } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

import BlogImage from "./components/blog-image";

export const metadata = {
  title: "Blog | Newsletter Monster",
  description: "Articles, guides, and resources about email marketing and newsletter strategies.",
};

export default async function BlogPage() {
  try {
    const posts = await getAllPostsMetadata();
    const categories = await getAllCategoryData();

    // Group recent posts
    const recentPosts = posts.slice(0, 4);
    const remainingPosts = posts.slice(4);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Newsletter Monster Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Articles, guides, and resources about email marketing and newsletter strategies.
          </p>
        </div>

        {recentPosts.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-6 text-2xl font-semibold">Latest Articles</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {recentPosts.map(post => (
                <div key={post.slug} className="overflow-hidden rounded-lg bg-card shadow-md">
                  <div className="relative h-40 w-full">
                    <BlogImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                    <h3 className="mb-2 mt-2 text-lg font-bold">
                      <NextLink
                        href={`/blog/${post.category}/${post.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </NextLink>
                    </h3>
                    <NextLink
                      href={`/blog/${post.category}/${post.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Read more →
                    </NextLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Main content */}
          <div className="md:w-2/3">
            <h2 className="mb-6 text-2xl font-semibold">All Articles</h2>
            {remainingPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {remainingPosts.map(post => (
                  <div key={post.slug} className="overflow-hidden rounded-lg bg-card shadow-md">
                    <div className="relative h-48 w-full">
                      <BlogImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                      <h3 className="mb-2 mt-2 text-xl font-bold">
                        <NextLink
                          href={`/blog/${post.category}/${post.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {post.title}
                        </NextLink>
                      </h3>
                      <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
                      <NextLink
                        href={`/blog/${post.category}/${post.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read more →
                      </NextLink>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-card p-6 text-center shadow-md">
                <p className="text-muted-foreground">No more articles found.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="mb-6 rounded-lg bg-card p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Categories</h2>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.slug}>
                    <NextLink
                      href={`/blog/${category.slug}`}
                      className="block py-1 text-primary hover:underline"
                    >
                      {category.name}
                    </NextLink>
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
    console.error("Error rendering blog page:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Error Loading Blog</h1>
          <p className="mb-4 text-red-700">
            We encountered an error while trying to load the blog. This might be due to a temporary
            issue.
          </p>
          <div className="mt-6">
            <NextLink
              href="/"
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Return to Home
            </NextLink>
          </div>
        </div>
      </div>
    );
  }
}
