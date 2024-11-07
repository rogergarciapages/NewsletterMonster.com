const PainPoints = () => {
  return (
    <section className="bg-white py-32 dark:bg-[#09090b]">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mx-auto mb-16 text-center text-5xl font-bold text-gray-900 dark:text-white lg:max-w-[600px]">
          We understand Newsletter Marketing Challenges
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1 */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">List Growth & Quality</h3>
            <p className="text-gray-700">
              Growing a high-quality email list is difficult. Low-quality leads affect engagement
              and conversion rates, hurting ROI.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Deliverability Issues</h3>
            <p className="text-gray-700">
              Ensuring emails land in the inbox, not spam, is critical. Poor deliverability limits
              reach and engagement with your audience.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Personalization & Segmentation
            </h3>
            <p className="text-gray-700">
              Tailoring emails to audience needs requires time and data. Lack of personalization
              leads to low engagement and unsubscribes.
            </p>
          </div>

          {/* Column 2 */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Content Creation Consistency
            </h3>
            <p className="text-gray-700">
              Crafting valuable, consistent content is challenging. Inconsistent emails lead to
              subscriber loss and poor performance.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Tracking ROI & Performance</h3>
            <p className="text-gray-700">
              Measuring email campaign success and ROI is complex. Lack of data clarity hinders
              optimization and growth strategies.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Compliance & Privacy</h3>
            <p className="text-gray-700">
              Data privacy regulations like GDPR add complexity. Staying compliant is crucial to
              avoid penalties and maintain trust.
            </p>
          </div>

          {/* Column 3 */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Subscriber Churn & Retention
            </h3>
            <p className="text-gray-700">
              Retaining engaged subscribers over time is tough. High churn rates drive up
              acquisition costs and lower campaign success.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Design & Mobile Optimization
            </h3>
            <p className="text-gray-700">
              Creating mobile-friendly, visually appealing emails is essential. Poor design impacts
              engagement and increases unsubscribes.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Resource Constraints</h3>
            <p className="text-gray-700">
              Small teams often lack time or budget for effective email marketing. This limits
              growth and reduces competitive edge.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
