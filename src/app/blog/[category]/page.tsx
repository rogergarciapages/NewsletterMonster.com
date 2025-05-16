import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllCategoryData, getCategoryBySlug, getPostsMetadataForCategory } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Newsletter Monster Blog`,
    description: category.description,
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategoryData();

  return categories.map(category => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const posts = await getPostsMetadataForCategory(params.category);
  const allCategories = await getAllCategoryData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Main content */}
        <div className="md:w-2/3">
          <div className="mb-8">
            <Link href="/blog" className="mb-2 inline-block text-primary hover:underline">
              ← Back to all articles
            </Link>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-lg bg-card p-6 text-center">
              <p>No articles found in this category yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map(post => (
                <div
                  key={post.slug}
                  className="flex flex-col overflow-hidden rounded-lg bg-card shadow-md md:flex-row"
                >
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <span className="text-sm text-muted-foreground">{formatDate(post.date)}</span>
                    <h2 className="mb-3 mt-2 text-xl font-bold">
                      <Link
                        href={`/blog/${post.category}/${post.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.category}/${post.slug}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3">
          <div className="mb-6 rounded-lg bg-card p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Categories</h2>
            <ul className="space-y-2">
              {allCategories.map(cat => (
                <li key={cat.slug} className={cat.slug === params.category ? "font-bold" : ""}>
                  <Link
                    href={`/blog/${cat.slug}`}
                    className={`block py-1 ${cat.slug === params.category ? "text-primary" : "hover:text-primary"}`}
                  >
                    {cat.name}
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
