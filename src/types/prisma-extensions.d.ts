declare module "@prisma/extension-pulse" {
  import { Prisma } from "@prisma/client";

  export function withPulse(): Prisma.Extensions.Extension;
}
