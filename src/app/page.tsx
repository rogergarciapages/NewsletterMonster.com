"use client";

// Supports weights 100-900
import Link from "next/link";
import { useEffect } from "react";

import "@fontsource-variable/inter";
import { Button } from "@nextui-org/react";
import { IconArrowRight } from "@tabler/icons-react";
import AOS from "aos";
import "aos/dist/aos.css";

import Footer from "./components/footer";
import { HeroSection } from "./components/hero/hero-section";
import PricingWrapper from "./components/pricing";
import SaveNewsletters from "./components/save-newsletters";
import { PopularNewsletters } from "./components/sections/popular-newsletters";
import { HeroLanding } from "./components/slider";

export default function Home() {
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main content */}
      <div className="flex-grow">
        {/* Hero Section - Main attention grabber */}
        <section data-aos="fade-up">
          <HeroSection />
        </section>

        {/* Mission Statement - Quick explanation of what we do */}
        <section data-aos="fade-up" data-aos-delay="100">
          <HeroLanding currentImageIndex={0} images={[]} />
        </section>

        {/* Learn More About Section */}
        <section
          data-aos="fade-up"
          data-aos-delay="150"
          className="bg-gray-50 py-16 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
              Want to know more about our mission?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Learn about how we're preserving newsletters, the problems we're solving, and why it
              matters for newsletter creators and readers alike.
            </p>
            <Link href="/about">
              <Button
                className="bg-torch-600 font-semibold text-white hover:bg-torch-700"
                endContent={<IconArrowRight className="ml-2" />}
              >
                Discover Our Story
              </Button>
            </Link>
          </div>
        </section>

        {/* Save Newsletters - Direct call to action */}
        <section data-aos="fade-up" data-aos-delay="200">
          <SaveNewsletters />
        </section>

        {/* Popular Newsletters Showcase - Show the product in action */}
        <section data-aos="fade-up" data-aos-delay="250">
          <PopularNewsletters />
        </section>

        {/* Pricing Section - Clear value proposition */}
        <section data-aos="fade-up" data-aos-delay="300">
          <PricingWrapper />
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
