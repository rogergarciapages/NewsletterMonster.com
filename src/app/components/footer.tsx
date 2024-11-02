// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\footer.tsx
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#1c1c1c] mt-auto">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-gray-700 dark:text-gray-300">
        <div className="grid grid-cols-12 gap-4 gap-y-8 sm:gap-8 py-8 md:py-12">
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-2">
              <a className="inline-block font-bold text-xl" href="/"></a>
            </div>
            <div className="text-sm flex flex-col gap-1">
              <a 
                className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:underline transition duration-150 ease-in-out" 
                href="/terms-and-conditions"
              >
                Terms
              </a>
              <a 
                className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:underline transition duration-150 ease-in-out" 
                href="/privacy"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="col-span-6 md:col-span-3 lg:col-span-2">
              <div className="text-gray-800 dark:text-gray-300 font-medium mb-2">{section.title}</div>
              <ul className="text-sm">
                {section.links.map((link) => (
                  <li key={link.text} className="mb-2">
                    <a 
                      className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:underline transition duration-150 ease-in-out" 
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

        <div className="md:flex md:items-center md:justify-between py-6 md:py-8 border-t border-gray-200 dark:border-gray-800">
          <ul className="flex mb-4 md:order-1 -ml-2 md:ml-4 md:mb-0">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a 
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg p-2.5 inline-flex items-center transition"
                  aria-label={social.label} 
                  href={social.href}
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>

          <div className="text-sm text-gray-700 dark:text-gray-400 mr-4">
            <div className="flex items-center">
              <img 
                className="w-5 h-5 md:w-6 md:h-6 mr-1.5 rtl:mr-0 rtl:ml-1.5 rounded-sm"
                src="https://nlmr1.s3.eu-central-1.amazonaws.com/logomonster.png"
                alt="Monster Industries logo"
                loading="lazy"
              />
              <span>
                Made by YOU & {" "}
                <a 
                  className="text-[#fc0036] hover:text-[#d1002d] dark:text-[#fc0036] dark:hover:text-[#ff1a4d] underline"
                  href="https://newslettermonster.com/"
                >
                  Monster Industries ltd.
                </a>
                {" "} · Some rights reserved.
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
      { text: "Resources", href: "#" }
    ]
  },
  {
    title: "Platform",
    links: [
      { text: "Developer API", href: "#" },
      { text: "Partners", href: "#" },
      { text: "Atom", href: "#" },
      { text: "Electron", href: "#" },
      { text: "AstroWind Desktop", href: "#" }
    ]
  },
  {
    title: "Support",
    links: [
      { text: "Docs", href: "#" },
      { text: "Community Forum", href: "#" },
      { text: "Professional Services", href: "#" },
      { text: "Skills", href: "#" },
      { text: "Status", href: "#" }
    ]
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
      { text: "Shop", href: "#" }
    ]
  }
];

// Social media links data
const socialLinks = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="m4 4l11.733 16H20L8.267 4zm0 16l6.768-6.768m2.46-2.46L20 4"
        />
      </svg>
    )
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M16.5 7.5l0 .01" />
      </svg>
    )
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
      </svg>
    )
  },
  {
    label: "RSS",
    href: "/rss.xml",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <path d="M4 11a9 9 0 0 1 9 9" />
      </svg>
    )
  },
  {
    label: "Github",
    href: "https://github.com/rogergarciapages/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
        />
      </svg>
    )
  }
];

export default Footer;