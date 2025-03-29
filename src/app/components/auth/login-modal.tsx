"use client";

import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa";

export default function LoginModal() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="bordered"
        onClick={() => signIn("github")}
        className="flex items-center gap-2"
      >
        <FaGithub className="h-5 w-5" />
        Continue with GitHub
      </Button>

      <Button
        variant="bordered"
        onClick={() => signIn("linkedin")}
        className="flex items-center gap-2"
      >
        <FaLinkedin className="h-5 w-5 text-[#0077b5]" />
        Continue with LinkedIn
      </Button>

      <Button
        variant="bordered"
        onClick={() => signIn("google")}
        className="flex items-center gap-2"
      >
        <FaGoogle className="h-5 w-5 text-[#4285F4]" />
        Continue with Google
      </Button>

      {/* ... existing code ... */}
    </div>
  );
}
