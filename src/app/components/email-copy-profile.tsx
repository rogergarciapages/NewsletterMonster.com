// src/app/components/email-copy-profile.tsx
"use client";

import { useState } from "react";

import { Button, Input } from "@nextui-org/react";
import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

import { BrandProfile } from "@/types/brands";

// src/app/components/email-copy-profile.tsx

interface EmailCopyProfileProps {
  user?: BrandProfile;
  isOwnProfile?: boolean;
}

const EmailCopyProfile = ({ user, isOwnProfile }: EmailCopyProfileProps) => {
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const heading =
    "Simply copy our email, add it to your list. As soon as your newsletters get sent out, our system will process your newsletter into our archive.";
  const email = "helloworld@newslettermonster.com";

  // Domain verification handler
  const handleVerifyDomain = async () => {
    if (!user?.website_domain) {
      toast.error("Please add your website domain in profile settings first");
      return;
    }

    if (!verificationEmail.endsWith(`@${user.website_domain}`)) {
      toast.error(`Email must be from domain ${user.website_domain}`);
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch("/api/verify-domain/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verificationEmail,
          domain: user.website_domain,
        }),
      });

      if (response.ok) {
        toast.success("Verification email sent!", {
          description: `Check ${verificationEmail} for verification link`,
        });
      } else {
        throw new Error("Failed to send verification");
      }
    } catch (error) {
      toast.error("Failed to send verification email");
    } finally {
      setIsVerifying(false);
    }
  };

  // Copy to clipboard handler
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard!", {
        description: email,
        action: {
          label: "Copy Again",
          onClick: () => navigator.clipboard.writeText(email),
        },
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy email", {
        description: "Please try again or copy manually",
      });
    }
  };

  // Determine current step - starting from step 2
  const currentStep = !user?.domain_verified ? 2 : 3;

  return (
    <div className="my-8 flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">Get Started with Newsletter Monster</h2>
      <div className="py-12">
        <ul className="steps steps-vertical lg:steps-horizontal">
          <li className="step step-warning" data-content="✓">
            Register
          </li>
          <li className={`step ${currentStep >= 2 ? "step-warning" : ""}`}>
            {user?.domain_verified ? "Domain Verified" : "Verify Domain"}
          </li>
          <li className={`step ${currentStep >= 3 ? "step-warning" : ""}`}>Copy Email</li>
          <li className={`step ${currentStep >= 4 ? "step-warning" : ""}`}>Done!</li>
        </ul>
      </div>

      {isOwnProfile && !user?.domain_verified && (
        <div className="mb-8 w-full max-w-md">
          <div className="rounded-lg bg-warning-50 p-4 text-sm">
            <h3 className="font-medium">Verify Your Domain</h3>
            <p className="mt-1 text-gray-600">
              To start receiving your newsletters, please verify your domain ownership
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              type="email"
              value={verificationEmail}
              onChange={e => setVerificationEmail(e.target.value)}
              placeholder={
                user?.website_domain ? `your.name@${user.website_domain}` : "Enter your email"
              }
              description={
                user?.website_domain
                  ? `Must be from ${user.website_domain}`
                  : "Enter an email from your domain"
              }
            />
            <Button color="warning" isLoading={isVerifying} onClick={handleVerifyDomain}>
              Verify
            </Button>
          </div>
        </div>
      )}

      {(!isOwnProfile || user?.domain_verified) && (
        <>
          <p className="mb-4 flex-col text-center">{heading}</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={email}
              readOnly
              className="text-md min-w-72 rounded-lg border-2 border-gray-300/50 p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Newsletter submission email"
            />
            <Button
              isIconOnly
              onClick={copyToClipboard}
              color="primary"
              variant="solid"
              aria-label="Copy email address"
              className="h-11 w-11 rounded-lg"
            >
              <IconCopy className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailCopyProfile;
