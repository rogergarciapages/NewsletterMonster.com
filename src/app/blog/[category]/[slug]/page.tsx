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
          <div className="mx-auto max-w-3xl rounded-lg bg-red-50 p-6 text-center dark:bg-red-950/40">
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

    // Extract the first h1 from the content to avoid duplication
    const contentWithoutFirstH1 = removeFirstH1(post.content);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href={`/blog/${params.category}`}
            className="mb-2 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to {params.category.replace(/-/g, " ")}
          </a>
        </div>

        {/* Hero section with integrated image and title */}
        <div className="relative mb-8 overflow-hidden rounded-xl shadow-lg">
          <div className="relative h-80 w-full sm:h-96 md:h-[28rem]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
              className="brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-blue-600/80 px-2.5 py-1 text-xs font-medium text-white">
                  {params.category.replace(/-/g, " ")}
                </span>
                <span className="ml-3 text-sm text-gray-200">{formatDate(post.date)}</span>
              </div>
              <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 text-sm text-gray-200 md:text-base lg:w-3/4">{post.excerpt}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <article className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
            <div className="px-6 py-8 md:px-10">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:text-base prose-p:leading-relaxed prose-li:text-base dark:text-gray-300 md:prose-p:text-lg md:prose-li:text-lg">
                {formatMarkdown(contentWithoutFirstH1)}
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
      </div>
    );
  } catch (error) {
    console.error("Error rendering blog post page:", error);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-red-50 p-6 text-center dark:bg-red-950/40">
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

// Helper function to remove the first H1 heading from the content
function removeFirstH1(content: string): string {
  const lines = content.split("\n");
  const h1Index = lines.findIndex(line => line.trim().startsWith("# "));

  if (h1Index !== -1) {
    lines.splice(h1Index, 1);
    return lines.join("\n");
  }

  return content;
}
