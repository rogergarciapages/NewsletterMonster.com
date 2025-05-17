import Image from "next/image";

import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

// Set a longer timeout for this route
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

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
    const post = await getPostBySlug(params.category, params.slug);

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

    // Add a timeout to prevent hanging
    const postPromise = getPostBySlug(params.category, params.slug);

    // Create a timeout promise
    const timeoutPromise = new Promise<null>(resolve => {
      setTimeout(() => {
        console.error(`Timeout reached for ${params.category}/${params.slug}`);
        resolve(null);
      }, 5000); // 5 second timeout
    });

    // Race the post fetch against the timeout
    const post = await Promise.race([postPromise, timeoutPromise]);

    if (!post) {
      console.error(`Post not found or timed out: ${params.category}/${params.slug}`);
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-800">Blog Post Not Available</h1>
            <p className="mb-4 text-red-700">
              We're having trouble loading this blog post. It might be temporarily unavailable.
            </p>
            <p className="mb-6">
              <a
                href={`/blog/${params.category}/${params.slug}/simple`}
                className="text-blue-600 hover:underline"
              >
                Try viewing the simplified version
              </a>
            </p>
            <div className="mt-6">
              <a
                href="/blog"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
            className="mb-2 inline-block text-blue-600 hover:underline"
          >
            ← Back to {params.category.replace(/-/g, " ")}
          </a>
        </div>

        <article className="overflow-hidden rounded-lg bg-white shadow-md">
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
              <span className="text-sm text-gray-600">
                {formatDate(post.date)} • {params.category.replace(/-/g, " ")}
              </span>
              <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
            </div>

            <div className="prose prose-lg max-w-none">{post.content}</div>
          </div>
        </article>

        <div className="mt-8">
          <a href={`/blog/${params.category}`} className="text-blue-600 hover:underline">
            ← Back to all {params.category.replace(/-/g, " ")} articles
          </a>
        </div>

        <div className="mt-4 text-center">
          <a
            href={`/blog/${params.category}/${params.slug}/simple`}
            className="text-sm text-gray-500 hover:underline"
          >
            View simplified version
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering blog post page:", error);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Error Loading Blog Post</h1>
          <p className="mb-4 text-red-700">
            We encountered an error while trying to load this blog post. This might be due to a
            temporary issue with MDX compilation.
          </p>
          <p className="mb-6">
            <a
              href={`/blog/${params.category}/${params.slug}/simple`}
              className="text-blue-600 hover:underline"
            >
              Try viewing the simplified version
            </a>
          </p>
          <div className="mt-6">
            <a
              href="/blog"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Return to Blog Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
