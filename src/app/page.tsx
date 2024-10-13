"use client";

import { Button, Card, CardBody } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { HeroSection } from "./components/hero-section";

export default function Home() {
  return (
    <div>
    <HeroSection />
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
