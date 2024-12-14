"use client";

import Link from "next/dist/client/link";
import Image from "next/image";

import { MotionValue, motion, useScroll, useSpring, useTransform } from "framer-motion";

interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

interface HeroParallaxProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
  translate: MotionValue<number>;
}

const ProductCard = ({ product, translate }: ProductCardProps) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product relative h-96 w-[30rem] flex-shrink-0"
    >
      <Link href={product.link} className="block group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
        />
      </Link>
    </motion.div>
  );
};

export const HeroParallax = ({ products }: HeroParallaxProps) => {
  const { scrollYProgress } = useScroll();
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]));
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]));

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <div className="...">
      <motion.div>
        <motion.div>
          {firstRow.map(product => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        {/* ... rest of the rows ... */}
      </motion.div>
    </div>
  );
};
