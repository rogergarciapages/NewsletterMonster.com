/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

export default function SaveNewsletters() {
  return (
    <div className="container mx-auto px-8 py-24 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-8 items-start">
        <div className="md:col-span-4 order-2 md:order-1 relative">
          <div className="relative overflow-hidden rounded-lg">
            <div className="aspect-[2/3] w-full">
              <Image
                src="/save-newsletters.png"
                alt="Newsletter collection illustration"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
                style={{
                  maskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                }}
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-6 order-1 md:order-2 space-y-8">
          <h2 className="text-5xl font-bold tracking-tighter">Save Your Favorite Newsletters</h2>
          <p className="text-base md:text-base lg:text-base xl:text-base dark:text-gray-300">
            Never miss important updates again. Archive and organize your favorite newsletters in one place. Easily access past issues, highlight key information, and stay on top of 
            your subscriptions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight leading-[2rem] text-primar border-b-8 border-torch-600">Increased Visibility</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gain exposure to a wider audience by showcasing your newsletter on our site, attracting new subscribers, and expanding your reach.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight leading-[2rem] text-primar border-b-8 border-torch-600">Huge SEO Advantages</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Improve your search engine rankings with external links from our reputable platform to your domain, enhancing your online presence.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight leading-[2rem] text-primar border-b-8 border-torch-600">Design Recognition</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Highlight your newsletter's design excellence and marketing practices, enhancing your brand's credibility and reputation within the industry.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight leading-[2rem] text-primar border-b-8 border-torch-600">Networking Opportunities</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with other companies and professionals featured on our site, opening doors to potential collaborations and partnerships.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight leading-[2rem] text-primar border-b-8 border-torch-600">Constructive Feedback</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive valuable feedback from our community, helping you refine and improve your newsletter content and strategy.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight leading-[2rem] text-primar border-b-8 border-torch-600">Enhanced Deliverability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Benefit from our focus on best practices, leading to higher engagement rates and improved deliverability of your newsletters to inboxes.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* add buttons or other content here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}