import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllCategoryData, getCategoryBySlug, getPostsMetadataForCategory } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

import BlogImage from "../components/blog-image";

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
  try {
    console.log(`Rendering category page for: ${params.category}`);
    const category = await getCategoryBySlug(params.category);

    if (!category) {
      console.error(`Category not found: ${params.category}`);
      notFound();
    }

    const posts = await getPostsMetadataForCategory(params.category);
    console.log(`Found ${posts.length} posts in category: ${params.category}`);

    const categories = await getAllCategoryData();

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

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {posts.map(post => (
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
                      <h2 className="mb-2 mt-2 text-xl font-bold">
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
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-card p-6 text-center shadow-md">
                <p className="text-muted-foreground">No posts found in this category.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="mb-6 rounded-lg bg-card p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Categories</h2>
              <ul className="space-y-2">
                {categories.map(cat => (
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
  } catch (error) {
    console.error(`Error rendering category page for ${params.category}:`, error);
    // Display a more user-friendly error page instead of notFound()
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Error Loading Category</h1>
          <p className="mb-4 text-red-700">
            We encountered an error while trying to load this category. This might be due to a
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
