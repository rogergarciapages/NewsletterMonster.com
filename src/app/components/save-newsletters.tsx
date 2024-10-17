import Image from "next/image";

export default function SaveNewsletters() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
        <div className="md:col-span-6 order-1 md:order-2 space-y-4">
          <h2 className="text-5xl font-bold tracking-tighter">Save Your Favorite Newsletters</h2>
          <p className="text-base md:text-base lg:text-base xl:text-base dark:text-white">
            Never miss important updates again. Archive and organize your favorite newsletters in one place. Easily access past issues, highlight key information, and stay on top of 
            your subscriptions.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* You can add buttons or other content here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}