import Image from "next/image";
import { notFound } from "next/navigation";

import { getSimplePostBySlug } from "@/lib/blog-utils";
import { formatDate } from "@/lib/utils";

export default async function SimpleBlogPostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  try {
    console.log(`Rendering simple blog post page for ${params.category}/${params.slug}`);
    const post = await getSimplePostBySlug(params.category, params.slug);

    if (!post) {
      console.error(`Post not found: ${params.category}/${params.slug}`);
      notFound();
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

            <div className="prose prose-lg max-w-none">
              {/* Display raw content as pre-formatted text */}
              <div className="rounded-md bg-gray-50 p-4">
                <p className="mb-2 text-sm text-gray-500">
                  Note: This is a simplified view without MDX rendering.
                </p>
                <pre className="whitespace-pre-wrap text-sm">{post.content}</pre>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8">
          <a href={`/blog/${params.category}`} className="text-blue-600 hover:underline">
            ← Back to all {params.category.replace(/-/g, " ")} articles
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering simple blog post page:", error);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Error Loading Blog Post</h1>
          <p className="mb-4 text-red-700">
            We encountered an error while trying to load this blog post. This might be due to a
            temporary issue.
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
