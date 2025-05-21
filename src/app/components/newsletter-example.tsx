import Image from "next/image";
import Link from "next/link";

interface NewsletterExampleProps {
  image: string;
  title: string;
  description: string;
  tags: string[];
  relatedNewsletters?: {
    id: string;
    title: string;
    image: string;
    tags: string[];
  }[];
}

export default function NewsletterExample({
  image,
  title,
  description,
  tags = [],
  relatedNewsletters = [],
}: NewsletterExampleProps) {
  // Create stable IDs for keys
  const componentId = title.toLowerCase().replace(/[^a-z0-9]/g, "-");

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Main newsletter example */}
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${componentId}-tag-${index}`}
              className="rounded-full bg-torch-800/10 px-3 py-1 text-sm font-medium text-torch-800 dark:bg-torch-800/20 dark:text-torch-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>

      {/* Related newsletters section */}
      {relatedNewsletters.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Related Newsletters
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNewsletters.map((newsletter, index) => (
              <Link
                key={`${componentId}-related-${index}`}
                href={`/newsletters/${newsletter.id}`}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={newsletter.image}
                    alt={newsletter.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
                <div className="p-4">
                  <h5 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {newsletter.title}
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {newsletter.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={`${componentId}-related-${index}-tag-${tagIndex}`}
                        className="rounded-full bg-torch-800/10 px-2 py-0.5 text-xs font-medium text-torch-800 dark:bg-torch-800/20 dark:text-torch-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
