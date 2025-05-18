import React from "react";

import { IconCircleCheckFilled } from "@tabler/icons-react";

interface PricingProps {
  title: string;
  subtitle: string;
  prices: Price[];
}

interface Price {
  title: string;
  subtitle: string;
  price: string | number;
  period: string;
  items: Item[];
  callToAction: CallToAction;
  hasRibbon?: boolean;
  ribbonTitle?: string;
}

interface Item {
  description: string;
}

interface CallToAction {
  target: string;
  text: string;
  href: string;
}

const Pricing: React.FC<PricingProps> = ({ title, subtitle, prices }) => {
  return (
    <div className="mx-auto my-8 max-w-7xl px-4">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-bold tracking-tighter text-torch-700 dark:text-torch-500">
          {title}
        </h2>
        <p className="text-xl text-gray-800 dark:text-gray-200">{subtitle}</p>
      </div>
      <div className="flex items-stretch justify-center">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {prices.map(
            ({
              title,
              subtitle,
              price,
              period,
              items,
              callToAction,
              hasRibbon = false,
              ribbonTitle,
            }) => (
              <div
                key={title}
                className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {hasRibbon && ribbonTitle && (
                  <div className="absolute right-0 top-0 z-10 rounded-bl-lg rounded-tr-lg bg-torch-600 p-2 font-bold text-white">
                    {ribbonTitle}
                  </div>
                )}
                <div>
                  <h3 className="mb-3 text-2xl font-semibold uppercase text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
                  <div className="my-8">
                    <div className="mb-1 flex items-center justify-center text-center">
                      <span className="text-5xl text-gray-900 dark:text-white">$</span>
                      <span className="text-6xl font-extrabold text-gray-900 dark:text-white">
                        {price}
                      </span>
                    </div>
                    <span className="text-base text-gray-600 dark:text-gray-300">{period}</span>
                  </div>
                  <ul className="my-8 space-y-3 text-left md:my-10">
                    {items.map(({ description }, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <IconCircleCheckFilled className="mt-1 flex-shrink-0 text-torch-600 dark:text-torch-500" />
                        <span className="text-gray-700 dark:text-gray-200">{description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <a
                    href={callToAction.href}
                    target={callToAction.target}
                    className={`rounded-md px-5 py-2.5 font-semibold text-white transition-colors duration-300 ${
                      hasRibbon
                        ? "bg-torch-700 hover:bg-torch-800 dark:bg-torch-600 dark:hover:bg-torch-700"
                        : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                    }`}
                  >
                    {callToAction.text}
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const PricingWrapper = () => {
  const pricingData = {
    title: "Our prices",
    subtitle: "Help us save the newsletters.",
    prices: [
      {
        title: "free starter",
        subtitle: "Get things started, get your newsletter out there for the world to see.",
        price: "0",
        period: "forever",
        items: [
          {
            description: "Your newsletter in our archives, forever.",
          },
          {
            description: "Brand page, for FREE.",
          },
          {
            description: "No newsletter limit.",
          },
        ],
        callToAction: {
          target: "_blank",
          text: "Get started",
          href: "#",
        },
      },
      {
        title: "standard",
        subtitle:
          "Get quality links for your newsletter, exposure and get highlighted across the site.",
        price: 89,
        period: "Per Month",
        items: [
          {
            description: "Your newsletter in our archives, forever.",
          },
          {
            description: "Brand page, for FREE.",
          },
          {
            description: "No newsletter limit.",
          },
          {
            description: "Follow Link for every newsletter.",
          },
        ],
        callToAction: {
          target: "_blank",
          text: "Get started",
          href: "https://buy.stripe.com/aEU6oI3AW5Gka088wx",
        },
        hasRibbon: true,
        ribbonTitle: "Popular!",
      },
      {
        title: "premium",
        subtitle: "Best option for major exposure, outreach and link building. ",
        price: 289,
        period: "Per Month",
        items: [
          {
            description: "Your newsletter in our archives, forever.",
          },
          {
            description: "Brand page, for FREE.",
          },
          {
            description: "No newsletter limit.",
          },
          {
            description: "Follow Link for every newsletter",
          },
          {
            description: "Automated social posting",
          },
          {
            description: "No Ads!",
          },
        ],
        callToAction: {
          target: "_blank",
          text: "Get started",
          href: "https://buy.stripe.com/4gweVe9Zkc4Idck3ce",
        },
      },
    ],
  };

  return <Pricing {...pricingData} />;
};

export default PricingWrapper;
