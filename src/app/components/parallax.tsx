"use client";

import { HeroParallax } from "./ui/hero-parallax";

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Moonbeam",
    link: "/trending",
    thumbnail: "/parallax/image1.webp",
  },
  {
    title: "Cursor",
    link: "/trending",
    thumbnail: "/parallax/image2.webp",
  },
  {
    title: "Rogue",
    link: "/trending",
    thumbnail: "/parallax/image3.webp",
  },

  {
    title: "Editorially",
    link: "/trending",
    thumbnail: "/parallax/image4.webp",
  },
  {
    title: "Editrix AI",
    link: "/trending",
    thumbnail: "/parallax/image5.webp",
  },
  {
    title: "Pixel Perfect",
    link: "/trending",
    thumbnail: "/parallax/image6.webp",
  },

  {
    title: "Algochurn",
    link: "/trending",
    thumbnail: "/parallax/image7.webp",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail: "/parallax/image8.webp",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail: "/parallax/image9.webp",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail: "/parallax/image10.webp",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail: "/parallax/image11.webp",
  },

  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail: "/parallax/image12.webp",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail: "/parallax/image13.webp",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail: "/parallax/image14.webp",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail: "/parallax/image15.webp",
  },
];
