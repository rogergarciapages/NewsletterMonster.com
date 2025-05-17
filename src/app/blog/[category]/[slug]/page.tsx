import Image from "next/image";

import { formatMarkdown, getAllPostSlugs, getSimplePostBySlug } from "@/lib/simple-mdx";
import { formatDate } from "@/lib/utils";

// Set options for better server rendering
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs();
    return posts;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  try {
    const post = await getSimplePostBySlug(params.category, params.slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "View our blog post",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  try {
    console.log(`Rendering blog post page for ${params.category}/${params.slug}`);
    const post = await getSimplePostBySlug(params.category, params.slug);

    if (!post) {
      console.error(`Post not found: ${params.category}/${params.slug}`);
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center dark:bg-red-950/40">
            <h1 className="mb-4 text-2xl font-bold text-red-800 dark:text-red-300">
              Blog Post Not Found
            </h1>
            <p className="mb-4 text-red-700 dark:text-red-400">
              We couldn't find the blog post you're looking for. It might have been moved or
              deleted.
            </p>
            <div className="mt-6">
              <a
                href="/blog"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
              >
                Return to Blog Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <a
            href={`/blog/${params.category}`}
            className="mb-2 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to {params.category.replace(/-/g, " ")}
          </a>
        </div>

        <article className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
          <div className="relative h-64 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="p-6">
            <div className="mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(post.date)} • {params.category.replace(/-/g, " ")}
              </span>
              <h1 className="mt-2 text-3xl font-bold dark:text-white">{post.title}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert dark:text-gray-300">
              {formatMarkdown(post.content)}
            </div>
          </div>
        </article>

        <div className="mt-8">
          <a
            href={`/blog/${params.category}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to all {params.category.replace(/-/g, " ")} articles
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering blog post page:", error);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center dark:bg-red-950/40">
          <h1 className="mb-4 text-2xl font-bold text-red-800 dark:text-red-300">
            Error Loading Blog Post
          </h1>
          <p className="mb-4 text-red-700 dark:text-red-400">
            We encountered an error while trying to load this blog post. This might be due to a
            temporary issue.
          </p>
          <div className="mt-6">
            <a
              href="/blog"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              Return to Blog Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
