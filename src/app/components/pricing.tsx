import { IconCircleCheckFilled } from "@tabler/icons-react";
import React from "react";

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
    <div className="max-w-7xl mx-auto my-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold tracking-tighter text-torch-700">{title}</h2>
        <p className="text-xl">{subtitle}</p>
      </div>
      <div className="flex items-stretch justify-center">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[#111]">
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
                className="relative p-6 bg-white dark:bg-[#2e2e2e] border border-gray-200 dark:border-[#2e2e2e] rounded-lg shadow flex flex-col justify-between text-center"
              >
                {hasRibbon && ribbonTitle && (
                  <div className="absolute right-0 top-0 z-10 p-2 bg-green-700 text-white font-bold rounded-bl-lg rounded-tr-lg">
                    {ribbonTitle}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-semibold uppercase mb-3">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-100">{subtitle}</p>
                  <div className="my-8">
                    <div className="flex items-center justify-center text-center mb-1">
                      <span className="text-5xl">$</span>
                      <span className="text-6xl font-extrabold">{price}</span>
                    </div>
                    <span className="text-base text-gray-600 dark:text-gray-100">{period}</span>
                  </div>
                  <ul className="my-8 md:my-10 space-y-2 text-left">
                    {items.map(({ description }, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <IconCircleCheckFilled className="text-torch-600/80 mt-1" />
                        <span>{description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <a
                    href={callToAction.href}
                    target={callToAction.target}
                    className={`px-4 py-2 font-semibold text-white rounded ${
                      hasRibbon ? "bg-torch-700 border-gray-100" : "bg-gray-800  border-gray-100"
                    } hover:${hasRibbon ? "bg-green-800" : "bg-blue-700"}`}
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
        subtitle:
          "Optimal option to get your newsletter out there for the world to see.",
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
        subtitle:
          "Best option for major exposure, outreach and link building. ",
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
