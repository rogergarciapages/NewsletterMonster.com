import Image from "next/image";
import Link from "next/link";

import { getAllCategoryData, getAllPostsMetadata } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog | Newsletter Monster",
  description: "Articles, guides, and resources about email marketing and newsletter strategies.",
};

export default async function BlogPage() {
  const posts = await getAllPostsMetadata();
  const categories = await getAllCategoryData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Main content */}
        <div className="md:w-2/3">
          <h1 className="mb-6 text-3xl font-bold">Newsletter Monster Blog</h1>

          {/* Featured post */}
          {posts.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-xl font-semibold">Featured Article</h2>
              <div className="overflow-hidden rounded-lg bg-card shadow-md">
                <div className="relative h-64 w-full">
                  <Image
                    src={posts[0].coverImage}
                    alt={posts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(posts[0].date)} • {posts[0].category.replace(/-/g, " ")}
                  </span>
                  <h3 className="mb-3 mt-2 text-2xl font-bold">
                    <Link
                      href={`/blog/${posts[0].category}/${posts[0].slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {posts[0].title}
                    </Link>
                  </h3>
                  <p className="mb-4 text-muted-foreground">{posts[0].excerpt}</p>
                  <Link
                    href={`/blog/${posts[0].category}/${posts[0].slug}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recent posts */}
          <h2 className="mb-4 text-xl font-semibold">Recent Articles</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.slice(1).map(post => (
              <div
                key={`${post.category}-${post.slug}`}
                className="overflow-hidden rounded-lg bg-card shadow-md"
              >
                <div className="relative h-48 w-full">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.date)} • {post.category.replace(/-/g, " ")}
                  </span>
                  <h3 className="mb-2 mt-2 text-lg font-bold">
                    <Link
                      href={`/blog/${post.category}/${post.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.category}/${post.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3">
          <div className="mb-6 rounded-lg bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Categories</h2>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.slug}>
                  <Link
                    href={`/blog/${category.slug}`}
                    className="block py-1 text-primary hover:underline"
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
}
