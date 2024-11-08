declare module "next/link" {
  import { LinkProps as NextLinkProps } from "next/link";
  import { UrlObject } from "url";

  type Url = string | UrlObject;

  export type LinkProps = Omit<NextLinkProps, "href"> & {
    href: Url;
  };
}
