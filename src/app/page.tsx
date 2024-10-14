"use client";

// Supports weights 100-900
import "@fontsource-variable/inter";
import { Button, Card, CardBody } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Companies from "./components/companies";
import { HeroSection } from "./components/hero/hero-section";
import PricingWrapper from "./components/pricing";
import { HeroLanding } from "./components/slider";
import Mission from "./components/the-mission";


export default function Home() {
  return (
    <div>
    <HeroSection />
    <Mission />
    <HeroLanding currentImageIndex={0} images={[]} />
    <Companies />
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
