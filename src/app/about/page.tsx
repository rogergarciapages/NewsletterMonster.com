"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import { HeroParallaxDemo } from "@/app/components/parallax";

import Benefits from "../components/benefits";
import BenefitsGrid from "../components/benefits-grid";
import Solutions from "../components/solutions";
import Statement from "../components/statement";

export default function AboutPage() {
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
        {/* About Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              About Newsletter Monster
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              We're on a mission to preserve the art of newsletters and ensure great content lives
              beyond the inbox. By archiving and showcasing newsletters, we help creators extend
              their reach and give their work a permanent home on the web.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section data-aos="fade-up" data-aos-delay="100">
          <Statement />
        </section>

        {/* Problems We Solve */}
        <section data-aos="fade-up" data-aos-delay="150">
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              The Newsletter Dilemma
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Every day, thousands of beautifully crafted newsletters disappear forever after being
              read once. Years of creativity, design work, and valuable content simply vanish, with
              no permanent place to be discovered or appreciated by new audiences.
            </p>
          </div>
          <BenefitsGrid />
        </section>

        {/* Our Solutions */}
        <section data-aos="fade-up" data-aos-delay="200">
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              How Newsletter Monster Helps
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              We've built a platform that transforms how newsletter content lives on the web,
              helping creators showcase their work, reach new audiences, and build a lasting archive
              of their best content.
            </p>
          </div>
          <Solutions />
        </section>

        {/* Benefits of Using Our Platform */}
        <section data-aos="fade-up" data-aos-delay="250">
          <Benefits />
        </section>

        {/* Visual Showcase */}
        <section data-aos="fade-up" data-aos-delay="300">
          <HeroParallaxDemo />
        </section>

        {/* Team Section - Can be added later */}
        <section className="bg-white py-20 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-12 text-4xl font-bold text-gray-900 dark:text-white">Our Team</h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Newsletter Monster was created by people who are passionate about great newsletters
              and believe that the best content deserves to be preserved. Our team combines
              expertise in email marketing, content strategy, SEO, and web archiving to build the
              ultimate home for newsletters on the web.
            </p>
            {/* Team members can be added here later */}
          </div>
        </section>
      </div>
    </div>
  );
}
