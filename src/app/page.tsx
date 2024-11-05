"use client";

// Supports weights 100-900
import "@fontsource-variable/inter";
import { Button, Card, CardBody } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Benefits from "./components/benefits";
import Companies from "./components/companies";
import { HeroSection } from "./components/hero/hero-section";
import PainPoints from "./components/pain-points";
import PricingWrapper from "./components/pricing";
import SaveNewsletters from "./components/save-newsletters";
import { PopularNewsletters } from "./components/sections/popular-newsletters";
import { HeroLanding } from "./components/slider";
import Solutions from "./components/solutions";
import Statement from "./components/statement";


export default function Home() {
  return (
    <div>
    <HeroSection />
    <HeroLanding currentImageIndex={0} images={[]} />
    <PainPoints />
    <Solutions />
    <SaveNewsletters />
    <Statement />
    <Companies />
    <Benefits />
    <PopularNewsletters />
    <PricingWrapper />

    <Card className="w-10/12 m-auto">
      <CardBody>
        <p>Text</p>
        <Button onClick={() => signOut({ callbackUrl: "/" })} variant="solid">
          Logout
        </Button>

      </CardBody>
    </Card>
    </div>
  );
}
