// src/app/components/brand/seo/seo-link.tsx
import type { Route } from "next";
import Link from "next/link";
import { ComponentProps, PropsWithChildren } from "react";

import { UrlObject } from "url";

type Url = UrlObject | Route;

interface SeoLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: Url;
  title?: string;
}

export function SeoLink({ children, href, title, ...props }: PropsWithChildren<SeoLinkProps>) {
  return (
    <Link href={href as Route} title={title} {...props}>
      {children}
    </Link>
  );
}