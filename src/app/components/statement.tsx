/* eslint-disable react/no-unescaped-entities */
import { IconArrowBigUpLineFilled } from "@tabler/icons-react"; // Import the Tabler icon
import { Parallax, ParallaxProvider } from "react-scroll-parallax"; // Parallax effect

const Statement = () => {
  return (
    <ParallaxProvider>
      <div className="relative w-full bg-torch-800 py-16 overflow-hidden"> {/* Parent div spanning full width */}
        {/* Parallax Background Icon */}
        <Parallax speed={-45}> {/* Adjust the speed for a smoother effect */}
          <IconArrowBigUpLineFilled
            className="absolute top-0 left-3/4 transform -translate-x-1/2 -translate-y-1/2 text-white" 
            size={800} // Set a large size for background effect
          />
        </Parallax>

        {/* Main Content */}
        <div className="relative mx-auto w-10/12 z-10"> {/* Content relative to ensure it layers above */}
          <h2 className="font-bold text-7xl max-w-4xl text-balance text-white md:text-9xl sm:leading-[3.6rem] md:leading-[6.5rem] tracking-tighter mb-8">
            It's time to level up your newsletter game
            <span className="animate-[pulse_1s_ease-in-out_infinite]">.</span>
          </h2>
          <p className="text-lg text-white max-w-3xl pt-8 tracking-tight md:text-xl">
            Discover the top newsletters shaping the industry and elevate your content to new heights.
          </p> 
          <p className="text-lg text-white max-w-3xl pt-4 tracking-tight md:text-xl">
            Strengthen your SEO, improve your domain reputation, and maximize your reach.
          </p>
          <p className="text-lg text-white max-w-3xl pt-4 tracking-tight md:text-xl">
            Stay informed with the latest insights, strategies, and trends from leading companies, helping you stay ahead of the competition and grow your audience effectively.
          </p>
        </div>
      </div>
    </ParallaxProvider>
  );
};

export default Statement;
