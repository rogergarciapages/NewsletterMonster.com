"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, Button, Card, CardBody } from "@nextui-org/react";
import { IconArrowRight, IconBuildingStore, IconMail, IconUsers } from "@tabler/icons-react";

export interface ManagedBrandItem {
  brand_id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  domain: string | null;
  followers_count: number;
  newslettersCount: number;
}

interface UserBrandsSectionProps {
  brands: ManagedBrandItem[];
}

export default function UserBrandsSection({ brands }: UserBrandsSectionProps) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="mb-10 w-full">
      <div className="mb-4 flex items-center gap-2">
        <IconBuildingStore size={22} className="text-primary-600 dark:text-primary-400" />
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          My Brands
        </h2>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {brands.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map(brand => (
          <Card
            key={brand.brand_id}
            className="group transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <CardBody className="flex flex-col justify-between p-5">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  {brand.logo ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <Avatar
                      name={brand.name}
                      className="h-12 w-12 text-sm font-bold text-white bg-gradient-to-tr from-primary-500 to-secondary-500"
                      radius="lg"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-zinc-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {brand.name}
                    </h3>
                    {brand.domain && (
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {brand.domain}
                      </p>
                    )}
                  </div>
                </div>

                {brand.description && (
                  <p className="mb-4 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
                    {brand.description}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <IconMail size={14} />
                    <span>
                      {brand.newslettersCount} {brand.newslettersCount === 1 ? "issue" : "issues"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconUsers size={14} />
                    <span>
                      {brand.followers_count}{" "}
                      {brand.followers_count === 1 ? "follower" : "followers"}
                    </span>
                  </div>
                </div>

                <Button
                  as={Link}
                  href={`/brand/${brand.slug}`}
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="w-full font-medium"
                  endContent={<IconArrowRight size={16} />}
                >
                  View Brand Page
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
