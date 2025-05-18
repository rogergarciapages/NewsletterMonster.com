import Link from "next/link";

import BlogImage from "@/app/blog/components/blog-image";
import { BlogPostMeta } from "@/lib/simple-mdx";
import { formatDate } from "@/lib/utils";

interface RelatedArticlesProps {
  currentPostSlug: string;
  categoryPosts: BlogPostMeta[];
  allPosts: BlogPostMeta[];
}

export default function RelatedArticles({
  currentPostSlug,
  categoryPosts,
  allPosts,
}: RelatedArticlesProps) {
  // Filter out the current post from category posts
  const otherCategoryPosts = categoryPosts.filter(post => post.slug !== currentPostSlug);

  // Get posts from other categories if we don't have enough from the current category
  let relatedPosts = [...otherCategoryPosts];
  const neededFromOtherCategories = Math.max(0, 6 - relatedPosts.length);

  if (neededFromOtherCategories > 0) {
    const otherPosts = allPosts
      .filter(post => !categoryPosts.some(cp => cp.slug === post.slug)) // Only posts from other categories
      .slice(0, neededFromOtherCategories);

    relatedPosts = [...relatedPosts, ...otherPosts];
  }

  // Limit to 6 posts
  relatedPosts = relatedPosts.slice(0, 6);

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">Related Articles</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map(post => (
          <div
            key={post.slug}
            className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
          >
            <div className="relative h-48 w-full">
              <BlogImage src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-torch-800/10 px-2.5 py-0.5 text-xs font-medium text-torch-800 dark:bg-torch-800/20 dark:text-torch-400">
                  {post.category.replace(/-/g, " ")}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(post.date)}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                <Link
                  href={`/blog/${post.category}/${post.slug}`}
                  className="hover:text-torch-800 dark:hover:text-torch-400"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.category}/${post.slug}`}
                className="mt-3 inline-flex items-center rounded bg-torch-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-torch-700 dark:bg-torch-900 dark:hover:bg-torch-800"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
