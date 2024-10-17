/* eslint-disable react/no-unescaped-entities */
const Statement = () => {
    return (
      <div className="w-full bg-torch-800 py-16"> {/* Parent div spanning full width with a different background color */}
        <div className="mx-auto w-10/12"> {/* 10/12 width content centered */}
          <h2 className="font-bold text-7xl max-w-4xl text-balance text-white md:text-9xl sm:leading-[3.6rem] md:leading-[6.5rem] tracking-tighter mb-8">
            It's time to level up your newsletter game<span className="animate-[pulse_1s_ease-in-out_infinite]">.</span>
          </h2>
          <p className="text-lg text-white max-w-4xl pt-8 tracking-tight md:text-xl">
          Discover the top newsletters shaping the industry and elevate your content to new heights.</p> 
          <p className="text-lg text-white max-w-4xl pb-8 tracking-tight md:text-xl">
            Strengthen your SEO, improve your domain reputation, and maximize your reach. Stay informed with the latest insights, strategies, and trends from leading companies, helping you stay ahead of the competition and grow your audience effectively.
          </p>
        </div>
      </div>
    );
  };
  
  export default Statement;
  