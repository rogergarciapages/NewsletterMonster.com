"use client";

import { Button, Card, CardBody } from "@nextui-org/react";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <Card>
      <CardBody>
        <p>Text</p>
        <Button onClick={() => signOut({ callbackUrl: "/" })} variant="solid">
          Logout
        </Button>
      </CardBody>
    </Card>
  );
}
