"use client";

import { useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconCopy,
  IconShare,
} from "@tabler/icons-react";

interface ShareButtonProps {
  newsletterId: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButton({
  newsletterId,
  size = "md",
  showTooltip = true,
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check out this newsletter on NewsletterMonster",
  className = "",
}: ShareButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
    onClose();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const button = (
    <Button
      variant="light"
      aria-label="Share newsletter"
      className={`flex items-center justify-center hover:bg-default-100 ${className}`}
      onClick={onOpen}
      startContent={<IconShare className={`${iconSizes[size]} text-default-500`} />}
    >
      Share
    </Button>
  );

  return (
    <>
      {showTooltip ? <Tooltip content="Share newsletter">{button}</Tooltip> : button}

      <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Share Newsletter</ModalHeader>
          <ModalBody className="gap-4 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="flat"
                color="primary"
                startContent={<IconBrandTwitter />}
                className="h-12"
                onClick={() => handleShare("twitter")}
              >
                Twitter
              </Button>
              <Button
                variant="flat"
                color="primary"
                startContent={<IconBrandFacebook />}
                className="h-12"
                onClick={() => handleShare("facebook")}
              >
                Facebook
              </Button>
              <Button
                variant="flat"
                color="primary"
                startContent={<IconBrandLinkedin />}
                className="h-12"
                onClick={() => handleShare("linkedin")}
              >
                LinkedIn
              </Button>
              <Button
                variant="flat"
                color="primary"
                startContent={<IconBrandWhatsapp />}
                className="h-12"
                onClick={() => handleShare("whatsapp")}
              >
                WhatsApp
              </Button>
            </div>

            <div className="relative mt-2">
              <Button
                variant="flat"
                color="primary"
                startContent={<IconCopy />}
                className="h-12 w-full"
                onClick={copyToClipboard}
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
