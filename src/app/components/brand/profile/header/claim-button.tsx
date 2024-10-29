// src/app/components/brand/profile/header/claim-button.tsx
"use client";

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { IconBuildingStore } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface ClaimBrandButtonProps {
  brandName: string;
  brandDomain?: string;
}

export default function ClaimBrandButton({ brandName, brandDomain }: ClaimBrandButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract domain from email
  const getEmailDomain = (email: string) => {
    return email.split("@")[1]?.toLowerCase();
  };

  // Check if email matches brand domain
  const isValidBrandEmail = (email: string) => {
    if (!brandDomain) return true;
    const emailDomain = getEmailDomain(email);
    return emailDomain === brandDomain.toLowerCase();
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your business email");
      return;
    }

    if (!isValidBrandEmail(email)) {
      toast.error(`Please use an email from ${brandDomain}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/brands/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setIsOpen(false);
      toast.success(
        "Verification email sent! Please check your inbox to complete the claim process."
      );
    } catch (error) {
      console.error("Error claiming brand:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit claim request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        color="warning"
        variant="flat"
        onPress={() => setIsOpen(true)}
        startContent={<IconBuildingStore size={20} />}
      >
        Claim Profile
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Claim {brandName} Profile
              </ModalHeader>
              
              <ModalBody>
                <p className="text-sm text-default-500">
                  To claim this profile, please provide your business email
                  {brandDomain && ` associated with ${brandDomain}`}.
                  We&apos;ll send you a verification link to confirm ownership.
                </p>

                <Input
                  type="email"
                  label="Business Email"
                  placeholder={`email@${brandDomain || "yourbrand.com"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                />
              </ModalBody>
              
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                >
                  Submit Claim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}