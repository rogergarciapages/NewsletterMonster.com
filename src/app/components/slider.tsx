import ImageSlider from "./feat-slider";

interface HeroLandingProps {
  currentImageIndex: number;
  images: string[];
}

export function HeroLanding({}: HeroLandingProps) {
  return (
    <div className="container mx-auto max-w-7xl px-8 py-24">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-10">
        <div className="order-1 space-y-4 md:col-span-5">
          <p className="text-center text-base font-bold uppercase tracking-wide text-torch-600">
            The Mission:
          </p>
          <h2 className="leading-12 mb-8 text-5xl font-bold tracking-tighter">
            Archive, showcase, and celebrate <span className="text-torch-600">good</span>{" "}
            newsletters.
          </h2>
          <p className="mt-6 text-sm md:text-base">
            Millions of beautifully designed newsletters are lost and discarded every day. This
            needs to stop. Celebrate beautifully designed newsletters, their art, typography, photos
            and compelling design.
          </p>
          <p className="mt-6 text-sm md:text-base">
            Get your newsletter in front of a wider audience. By showcasing your content, you will
            attract new subscribers and significantly expand your reach. Highlight the best in
            newsletter marketing, so your message gets the attention it deserves.
          </p>
          <p className="mt-6 text-sm md:text-base">
            Empower your newsletters, Archive them beautifully. Boost SEO Instantly. Celebrate the
            art and creativity of newsletters. Explore our archive and enjoy the best newsletters,
            all in one place.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Add any additional content or buttons here */}
          </div>
        </div>
        <div className="order-2 flex justify-center md:order-1 md:col-span-5">
          <div className="relative h-[400px] w-full max-w-full overflow-hidden rounded-xl shadow-xl sm:h-[600px]">
            <div className="mockup-browser h-full border bg-base-300">
              <div className="mockup-browser-toolbar">
                <div className="input">https://newslettermonster.com</div>
              </div>
              <div className="bg-base-900 flex justify-center px-4 py-16">
                <ImageSlider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
