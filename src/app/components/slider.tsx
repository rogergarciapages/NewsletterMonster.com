
import ImageSlider from "./feat-slider";

interface HeroLandingProps {
  currentImageIndex: number;
  images: string[];
}

export function HeroLanding({ currentImageIndex, images }: HeroLandingProps) {
  return (
    <section className="w-8/12 mx-auto py-12 md:py-24 lg:py-32">
      <div className="container grid gap-12 px-8 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <div className="space-y-8">
            <h2 className="text-5xl text-left font-bold leading-tighter tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl">
            Our mission is archive, showcase, and cebrate newsletters.</h2>
            <p className="mt-6 text-md">
                Millions of beautifully designed newsletters are lost and discarded every day. This needs to stop. Celebrate beatifully designed newsletters, their art, typography, photos and compelling design.</p>
            <p className="mt-6 mb-20 text-md">
                Get your newsletter in front of a wider audience. By showcasing your content, you will attract new subscribers and significantly expand your reach. Highlight the best in newsletter marketing, so your message gets the attention it deserves.</p>
            <p className="max-w-[600px] pb-8 text-muted-foreground md:text-m/relaxed lg:text-base/relaxed xl:text-base/relaxed">
              Empower your newsletters, Archive them beautifully. Boost SEO Instantly. Celebrate the art and creativity of newsletters. Explore our archive and enjoy the best newsletters, all in one place.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
          <div className="px-1 py-1">
          <div className="grid gap-8 items-start justify-center">

          </div>
        </div>
          </div>

        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-full h-[600px] max-w-[600px] overflow-hidden rounded-xl shadow-xl">
            <div className="mockup-browser h-[600px] bg-base-300 border">
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
    </section>
  );
}
