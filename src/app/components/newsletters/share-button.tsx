"use client";

import { useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  FaCheck,
  FaFacebook,
  FaLink,
  FaLinkedin,
  FaShare,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

interface ShareButtonProps {
  _newsletterId?: number;
  newsletterId?: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButton({
  _newsletterId,
  newsletterId,
  size = "md",
  showTooltip = true,
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check out this newsletter on NewsletterMonster",
  className = "",
}: ShareButtonProps) {
  const effectiveNewsletterId = newsletterId || _newsletterId;

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

  const sizeClasses = {
    sm: "h-8 min-w-[70px] text-xs",
    md: "h-10 min-w-[90px] text-sm",
    lg: "h-11 min-w-[110px] text-base",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const countSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const button = (
    <Button
      variant="light"
      onClick={onOpen}
      isIconOnly={size === "sm"}
      className={`${sizeClasses[size]} ${className}`}
      startContent={
        <>
          <FaShare className={`${iconSizes[size]}`} />
          {size !== "sm" && <span className={`font-semibold ${countSizes[size]}`}>Share</span>}
        </>
      }
    />
  );

  return (
    <>
      {showTooltip ? <Tooltip content="Share this newsletter now">{button}</Tooltip> : button}

      <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
        <ModalContent className="dark:bg-zinc-900">
          <ModalHeader className="flex flex-col gap-1 text-center text-xl font-bold dark:text-zinc-50">
            Share this newsletter now
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="flat"
                onClick={() => handleShare("twitter")}
                className="w-full bg-[#1DA1F2] text-white hover:bg-[#1a94df]"
                startContent={<FaTwitter />}
              >
                Twitter
              </Button>
              <Button
                variant="flat"
                onClick={() => handleShare("facebook")}
                className="w-full bg-[#4267B2] text-white hover:bg-[#3b5998]"
                startContent={<FaFacebook />}
              >
                Facebook
              </Button>
              <Button
                variant="flat"
                onClick={() => handleShare("linkedin")}
                className="w-full bg-[#0077B5] text-white hover:bg-[#006699]"
                startContent={<FaLinkedin />}
              >
                LinkedIn
              </Button>
              <Button
                variant="flat"
                onClick={() => handleShare("whatsapp")}
                className="w-full bg-[#25D366] text-white hover:bg-[#22c55e]"
                startContent={<FaWhatsapp />}
              >
                WhatsApp
              </Button>
              <Button
                variant="flat"
                onClick={copyToClipboard}
                className="col-span-2 w-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                startContent={copied ? <FaCheck /> : <FaLink />}
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
