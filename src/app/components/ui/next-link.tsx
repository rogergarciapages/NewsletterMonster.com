import Link from "next/link";

// This is a workaround for TypeScript issues with Next.js Link in version 14
const NextLink = Link as any;

export default NextLink;
