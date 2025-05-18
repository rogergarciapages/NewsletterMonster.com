const BenefitsGrid = () => {
  return (
    <section className="bg-white py-24 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mx-auto mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:max-w-[800px]">
          Why Newsletter Monster Makes a Difference
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-torch-700 dark:text-torch-400">
              Showcase & Grow
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get your newsletter in front of new audiences and attract more subscribers. Your work
              deserves to be seen beyond the inbox.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-torch-700 dark:text-torch-400">
              Forever Archive
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Your newsletters—with all their art, design, and content—preserved forever in the
              web's largest newsletter library.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-torch-700 dark:text-torch-400">
              Traffic & Connections
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Drive more traffic to your website, products, or social channels with permanent links
              that boost your online presence.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-torch-700 dark:text-torch-400">
              Design Recognition
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get the appreciation your newsletter design deserves. Let your creative work shine and
              inspire others in the community.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-torch-700 dark:text-torch-400">
              Industry Insights
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Discover trends in your industry and see what works for other successful newsletters.
              Learn and grow your own strategy.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-3 text-xl font-semibold text-torch-700 dark:text-torch-400">
              Community Connection
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Join a thriving community of newsletter creators who support each other, share
              insights, and celebrate great content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
