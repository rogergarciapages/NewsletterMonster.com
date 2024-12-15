"use client";

import Link from "next/dist/client/link";
import React from "react";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { ProductCardWrapper } from "./product-card";

interface SafeLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

interface HeroParallaxProps {
  products: Array<{
    title: string;
    link: string;
    thumbnail: string;
  }>;
}

const _SafeLink = ({ href, children, className }: SafeLinkProps) => (
  <Link href={href} className={className}>
    {children}
  </Link>
);

export const HeroParallax = ({ products }: HeroParallaxProps) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);
  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map(product => (
            <ProductCardWrapper product={product} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map(product => (
            <ProductCardWrapper product={product} isReverse key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map(product => (
            <ProductCardWrapper product={product} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
      <h1 className="text-2xl font-bold dark:text-white md:text-7xl">
        The Ultimate <br /> development studio
      </h1>
      <p className="mt-8 max-w-2xl text-base dark:text-neutral-200 md:text-xl">
        We build beautiful products with the latest technologies and frameworks. We are a team of
        passionate developers and designers that love to build amazing products.
      </p>
    </div>
  );
};
