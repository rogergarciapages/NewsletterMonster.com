
const Solutions = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Solutions to Boost Your Newsletter Success
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Solution List */}
          <div className="space-y-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Improve Discoverability through Backlinks
              </h3>
              <p className="text-gray-700">
                High-quality backlinks help your newsletter content appear more frequently in search results, increasing visibility to new audiences. This exposure drives organic traffic, growing your list with engaged subscribers.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Boost Domain Authority for Higher Rankings
              </h3>
              <p className="text-gray-700">
                Backlinks from reputable sites enhance your website's domain authority, helping it rank better on search engines. Higher rankings mean your newsletter sign-up pages are more likely to attract and convert visitors.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Establish Credibility and Audience Trust
              </h3>
              <p className="text-gray-700">
                When well-known websites link to your content, it boosts your brand’s credibility. Trustworthy backlinks can reduce subscriber churn by attracting users who are genuinely interested in your expertise and value.
              </p>
            </div>
          </div>

          {/* Column 2: Visual or Call-to-Action */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Leverage SEO for Newsletter Growth
              </h3>
              <p className="text-gray-700 mb-6">
                Incorporating backlinks is a powerful yet often overlooked tactic for expanding your newsletter audience.
              </p>
              <a
                href="#"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-blue-700 transition duration-300"
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
