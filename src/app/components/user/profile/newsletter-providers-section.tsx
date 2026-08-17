"use client";

import { Button, Card, CardBody } from "@nextui-org/react";
import { IconExternalLink, IconRocket } from "@tabler/icons-react";

export interface NewsletterProvider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  textColor: string;
  bgLight: string;
  url: string;
}

const PROVIDERS: NewsletterProvider[] = [
  {
    id: "beehiiv",
    name: "beehiiv",
    tagline: "Growth & Monetization",
    description: "The newsletter platform built by creators for growth, analytics, and revenue.",
    badgeColor: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-300",
    bgLight: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40",
    url: "https://www.beehiiv.com",
  },
  {
    id: "substack",
    name: "Substack",
    tagline: "Subscription Publishing",
    description: "Independent writing platform to build a loyal subscriber base and get paid.",
    badgeColor: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-300",
    bgLight: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/40",
    url: "https://substack.com",
  },
  {
    id: "kit",
    name: "Kit (ConvertKit)",
    tagline: "Creator Marketing",
    description: "Powerful email automation and audience building tools designed for creators.",
    badgeColor: "bg-rose-500",
    textColor: "text-rose-700 dark:text-rose-300",
    bgLight: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40",
    url: "https://kit.com",
  },
  {
    id: "ghost",
    name: "Ghost",
    tagline: "Open Source Platform",
    description: "Modern, customizable open-source platform for publishing and memberships.",
    badgeColor: "bg-zinc-800 dark:bg-zinc-200",
    textColor: "text-zinc-800 dark:text-zinc-200",
    bgLight: "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700",
    url: "https://ghost.org",
  },
  {
    id: "buttondown",
    name: "Buttondown",
    tagline: "Minimalist & Elegant",
    description: "Lightweight, developer-friendly tool to run modern email newsletters.",
    badgeColor: "bg-blue-600",
    textColor: "text-blue-700 dark:text-blue-300",
    bgLight: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",
    url: "https://buttondown.email",
  },
  {
    id: "mailerlite",
    name: "MailerLite",
    tagline: "Simple & Effective",
    description: "Intuitive email marketing platform with drag-and-drop editor and automation.",
    badgeColor: "bg-emerald-600",
    textColor: "text-emerald-700 dark:text-emerald-300",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40",
    url: "https://www.mailerlite.com",
  },
];

interface NewsletterProvidersSectionProps {
  isOwnProfile?: boolean;
}

export default function NewsletterProvidersSection({
  isOwnProfile = false,
}: NewsletterProvidersSectionProps) {
  return (
    <section className="mb-10 w-full rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50/80 to-white p-6 dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-900">
      <div className="mb-6 text-center sm:text-left">
        <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
            <IconRocket size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            You don&apos;t have a newsletter? Create your own here:
          </h2>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Launch your publication using top newsletter providers. Click below to start building
          your audience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map(provider => (
          <Card
            key={provider.id}
            className={`transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:bg-zinc-900 ${provider.bgLight}`}
            shadow="sm"
          >
            <CardBody className="flex flex-col justify-between p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-3 w-3 rounded-full ${provider.badgeColor}`} />
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      {provider.name}
                    </h3>
                  </div>
                  <span className={`text-xs font-semibold ${provider.textColor}`}>
                    {provider.tagline}
                  </span>
                </div>
                <p className="mb-5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {provider.description}
                </p>
              </div>

              <Button
                as="a"
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="solid"
                size="sm"
                className="w-full font-medium"
                endContent={<IconExternalLink size={16} />}
              >
                Create on {provider.name}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {isOwnProfile && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50 sm:flex-row">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Already running a newsletter brand? Add it to Newsletterzilla to gain subscribers!
          </p>
          <Button
            as="a"
            href="/brand/create"
            color="secondary"
            variant="flat"
            size="sm"
            className="shrink-0 font-semibold"
          >
            Register Brand Page
          </Button>
        </div>
      )}
    </section>
  );
}
