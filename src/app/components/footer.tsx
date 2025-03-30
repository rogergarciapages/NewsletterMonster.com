// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\footer.tsx
const Footer = () => {
  return (
    <footer className="mt-auto bg-white dark:bg-[#1c1c1c]">
      <div className="relative mx-auto max-w-7xl px-4 text-gray-700 dark:text-gray-300 sm:px-6">
        <div className="grid grid-cols-12 gap-4 gap-y-8 py-8 sm:gap-8 md:py-12">
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-2">
              <a className="inline-block text-xl font-bold" href="/"></a>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <a
                className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:text-gray-300"
                href="/terms-and-conditions"
              >
                Terms
              </a>
              <a
                className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:text-gray-300"
                href="/privacy"
              >
                Privacy Policy
              </a>
              <div className="mt-1 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <span>Website built with</span>
                <svg
                  className="h-5 w-[80px]"
                  viewBox="0 292.369 609.697 203.233"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="#E22319" d="M0 292.369h609.697v203.233H0z" />
                  <path
                    fill="#FFF"
                    d="M265.411 360.88c-9.212 0-18.999 4.03-25.332 12.666v-10.938h-21.302v78.299h21.302V396c0-8.06 6.333-16.696 17.848-16.696 8.636 0 17.848 6.333 17.848 16.696v44.331h21.302V391.97c.575-17.848-12.667-31.09-31.666-31.09M450.22 362.032l-19.574 53.542-19.576-53.542h-24.18l32.241 78.299h23.604l31.665-78.299zM195.748 416.15c-9.212 6.909-14.394 8.061-22.454 8.061-7.484 0-13.242-2.303-17.272-6.333l54.694-23.029c-1.151-8.636-4.606-16.121-9.211-21.878-7.485-8.636-17.848-12.666-31.089-12.666-23.605 0-41.453 17.272-41.453 40.301 0 23.605 17.848 40.302 43.755 40.302 14.393 0 29.362-6.909 36.271-14.97l-13.241-9.788zm-41.453-30.513c3.455-5.182 9.211-8.06 16.696-8.06 7.484 0 13.817 4.606 16.696 10.939l-37.422 15.545c-1.151-7.485 1.152-13.818 4.03-18.424zM127.236 420.756H78.299v-81.753H56.421v101.328h70.815zM512.975 441.482c-23.604 0-42.028-17.271-42.028-40.301 0-22.454 18.423-40.301 42.028-40.301 23.604 0 42.028 17.272 42.028 40.301.575 23.03-17.848 40.301-42.028 40.301m0-62.178c-12.091 0-20.727 9.212-20.727 21.878 0 12.09 9.212 21.878 20.727 21.878 12.09 0 20.727-9.212 20.727-21.878.574-12.091-8.638-21.878-20.727-21.878M347.74 441.482c-23.604 0-42.028-17.271-42.028-40.301 0-22.454 18.424-40.301 42.028-40.301 23.605 0 42.028 17.272 42.028 40.301s-18.422 40.301-42.028 40.301m0-62.178c-12.09 0-20.727 9.212-20.727 21.878 0 12.09 9.212 21.878 20.727 21.878 12.091 0 20.727-9.212 20.727-21.878.575-12.091-8.636-21.878-20.727-21.878M558.457 431.119h-3.454v-1.727h9.212v1.727h-3.455v9.212h-2.303v-9.212zm8.061-1.726h2.303l3.454 5.182 3.455-5.182h2.303v11.515h-2.303v-8.061l-3.455 5.182-3.454-5.182v8.061h-2.303v-11.515z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {footerSections.map(section => (
            <div key={section.title} className="col-span-6 md:col-span-3 lg:col-span-2">
              <div className="mb-2 font-medium text-gray-800 dark:text-gray-300">
                {section.title}
              </div>
              <ul className="text-sm">
                {section.links.map(link => (
                  <li key={link.text} className="mb-2">
                    <a
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:text-gray-300"
                      href={link.href}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 py-6 dark:border-gray-800 md:flex md:items-center md:justify-between md:py-8">
          <ul className="-ml-2 mb-4 flex md:order-1 md:mb-0 md:ml-4">
            {socialLinks.map(social => (
              <li key={social.label}>
                <a
                  className="inline-flex items-center rounded-lg p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  aria-label={social.label}
                  href={social.href}
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>

          <div className="mr-4 text-sm text-gray-700 dark:text-gray-400">
            <div className="flex items-center">
              <img
                className="mr-1.5 h-5 w-5 rounded-sm md:h-6 md:w-6 rtl:ml-1.5 rtl:mr-0"
                src="https://nlmr1.s3.eu-central-1.amazonaws.com/logomonster.png"
                alt="Monster Industries logo"
                loading="lazy"
              />
              <span>
                Made by YOU &{" "}
                <a
                  className="text-[#fc0036] underline hover:text-[#d1002d] dark:text-[#fc0036] dark:hover:text-[#ff1a4d]"
                  href="https://newslettermonster.com/"
                >
                  Monster Industries ltd.
                </a>{" "}
                · Some rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer sections data
const footerSections = [
  {
    title: "Product",
    links: [
      { text: "Home", href: "/" },
      { text: "Security", href: "#" },
      { text: "Team", href: "#" },
      { text: "Enterprise", href: "#" },
      { text: "Customer stories", href: "#" },
      { text: "Pricing", href: "#" },
      { text: "Resources", href: "#" },
    ],
  },
  {
    title: "Platform",
    links: [
      { text: "Developer API", href: "#" },
      { text: "Partners", href: "#" },
      { text: "Atom", href: "#" },
      { text: "Electron", href: "#" },
      { text: "AstroWind Desktop", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { text: "Docs", href: "#" },
      { text: "Community Forum", href: "#" },
      { text: "Professional Services", href: "#" },
      { text: "Skills", href: "#" },
      { text: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", href: "#" },
      { text: "Blog", href: "#" },
      { text: "Careers", href: "#" },
      { text: "Press", href: "#" },
      { text: "Inclusion", href: "#" },
      { text: "Social Impact", href: "#" },
      { text: "Shop", href: "#" },
    ],
  },
];

// Social media links data
const socialLinks = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m4 4l11.733 16H20L8.267 4zm0 16l6.768-6.768m2.46-2.46L20 4"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M16.5 7.5l0 .01" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
      </svg>
    ),
  },
  {
    label: "RSS",
    href: "/rss.xml",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <path d="M4 11a9 9 0 0 1 9 9" />
      </svg>
    ),
  },
  {
    label: "Github",
    href: "https://github.com/rogergarciapages/",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
        />
      </svg>
    ),
  },
];

export default Footer;
