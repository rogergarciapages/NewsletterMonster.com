import Image from "next/image";

import { getSimplePostBySlug } from "@/lib/blog-utils";
import { formatDate } from "@/lib/utils";

// Set a longer timeout for this route
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

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
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-6 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-800">Blog Post Not Found</h1>
            <p className="mb-4 text-red-700">
              We couldn't find this blog post. It might have been moved or deleted.
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

            <div className="prose prose-lg max-w-none">
              <div className="mb-4 rounded-md bg-amber-50 p-4">
                <p className="text-amber-800">
                  <strong>Note:</strong> This is a simplified view of the article.
                </p>
              </div>

              {/* Improved markdown rendering */}
              <div className="markdown-content">
                {post.content
                  .split("\n")
                  .map((line, i) => {
                    // Basic markdown parsing
                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={i} className="my-4 text-3xl font-bold">
                          {line.substring(2)}
                        </h1>
                      );
                    } else if (line.startsWith("## ")) {
                      return (
                        <h2 key={i} className="my-3 text-2xl font-bold">
                          {line.substring(3)}
                        </h2>
                      );
                    } else if (line.startsWith("### ")) {
                      return (
                        <h3 key={i} className="my-2 text-xl font-bold">
                          {line.substring(4)}
                        </h3>
                      );
                    } else if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="my-1 ml-4">
                          {line.substring(2)}
                        </li>
                      );
                    } else if (line.match(/^\d+\. /)) {
                      return (
                        <li key={i} className="my-1 ml-4 list-decimal">
                          {line.replace(/^\d+\. /, "")}
                        </li>
                      );
                    } else if (line.trim() === "") {
                      return <br key={i} />;
                    } else if (line.startsWith("```")) {
                      // Skip code blocks for now
                      return null;
                    } else if (line.startsWith("---")) {
                      return <hr key={i} className="my-4" />;
                    } else {
                      // Handle links with basic regex
                      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                      const lastIndex = 0;
                      const parts = [];
                      let match;
                      let processedLine = line;

                      // Simple link processing
                      if (linkRegex.test(line)) {
                        processedLine = line.replace(linkRegex, (match, text, url) => {
                          return `<a href="${url}" class="text-blue-600 hover:underline">${text}</a>`;
                        });
                      }

                      // Handle bold with ** or __
                      processedLine = processedLine.replace(
                        /\*\*([^*]+)\*\*/g,
                        "<strong>$1</strong>"
                      );
                      processedLine = processedLine.replace(/__([^_]+)__/g, "<strong>$1</strong>");

                      // Handle italic with * or _
                      processedLine = processedLine.replace(/\*([^*]+)\*/g, "<em>$1</em>");
                      processedLine = processedLine.replace(/_([^_]+)_/g, "<em>$1</em>");

                      return (
                        <p
                          key={i}
                          className="my-2"
                          dangerouslySetInnerHTML={{ __html: processedLine }}
                        />
                      );
                    }
                  })
                  .filter(Boolean)}
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
