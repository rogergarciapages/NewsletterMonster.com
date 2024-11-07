const Solutions = () => {
  return (
    <section className="bg-white py-12 dark:bg-[#09090b]">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mx-auto mb-16 max-w-4xl text-center text-5xl font-bold text-gray-800 dark:text-white">
          Solutions to Boost Your Newsletter Success
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Column 1: Solution List */}
          <div className="space-y-8">
            <div className="rounded-lg bg-torch-700 p-8 shadow-lg shadow-cyan-950/70">
              <h3 className="mb-4 text-2xl font-semibold leading-7 text-white">
                Improve Discoverability through Backlinks
              </h3>
              <p className="text-sm text-white">
                High-quality backlinks help your newsletter content appear more frequently in search
                results, increasing visibility to new audiences. This exposure drives organic
                traffic, growing your list with engaged subscribers.
              </p>
            </div>

            <div className="rounded-lg bg-torch-700 p-8 shadow-lg shadow-cyan-950/70">
              <h3 className="mb-4 text-2xl font-semibold leading-7 text-white">
                Boost Domain Authority for Higher Rankings
              </h3>
              <p className="text-sm text-white">
                Backlinks from reputable sites enhance your website&apos;s domain authority, helping
                it rank better on search engines. Higher rankings mean your newsletter sign-up pages
                are more likely to attract and convert visitors.
              </p>
            </div>

            <div className="rounded-lg bg-torch-700 p-8 shadow-lg shadow-cyan-950/70">
              <h3 className="mb-4 text-2xl font-semibold leading-7 text-white">
                Establish Credibility and Audience Trust
              </h3>
              <p className="text-sm text-white">
                When well-known websites link to your content, it boosts your brand&apos;s
                credibility. Trustworthy backlinks can reduce subscriber churn by attracting users
                who are genuinely interested in your expertise and value.
              </p>
            </div>
          </div>

          {/* Column 2: Visual or Call-to-Action */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="mb-4 text-5xl font-semibold text-zinc-800 dark:text-white">
                Leverage SEO for Newsletter Growth
              </h3>
              <p className="mb-6 text-gray-700">
                Incorporating backlinks is a powerful yet often overlooked tactic for expanding your
                newsletter audience.
              </p>
              <a
                href="#"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition duration-300 hover:bg-blue-700"
              >
                Learn More About SEO Strategies
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
