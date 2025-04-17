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
import { IconDownload } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

interface DownloadButtonProps {
  newsletterId: number;
  fullScreenshotUrl?: string | null;
  htmlFileUrl?: string | null;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function DownloadButton({
  newsletterId,
  fullScreenshotUrl,
  htmlFileUrl,
  size = "md",
  showTooltip = true,
  className = "",
}: DownloadButtonProps) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [downloadType, setDownloadType] = useState<"html" | "image" | null>(null);

  const handleDownload = (type: "html" | "image") => {
    if (!isLoggedIn) {
      setDownloadType(type);
      onOpen();
      return;
    }

    // User is logged in, proceed with download
    if (type === "html" && htmlFileUrl) {
      window.open(htmlFileUrl, "_blank");
    } else if (type === "image" && fullScreenshotUrl) {
      window.open(fullScreenshotUrl, "_blank");
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
      aria-label="Download newsletter"
      className={`flex items-center justify-start gap-2 rounded-full px-4 ${sizeClasses[size]} hover:bg-default-100 ${className}`}
      onClick={onOpen}
      startContent={<IconDownload className={`${iconSizes[size]} text-default-500`} />}
    >
      <span className={`font-semibold ${countSizes[size]}`}>Download</span>
    </Button>
  );

  return (
    <>
      {showTooltip ? <Tooltip content="Download newsletter">{button}</Tooltip> : button}

      <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Download Newsletter</ModalHeader>
          <ModalBody className="gap-4 pb-6">
            <p className="text-center text-sm">Choose a format to download this newsletter</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="flat"
                color="primary"
                startContent={<IconDownload />}
                className="h-12"
                onClick={() => handleDownload("html")}
                isDisabled={!htmlFileUrl}
              >
                HTML Version
              </Button>
              <Button
                variant="flat"
                color="primary"
                startContent={<IconDownload />}
                className="h-12"
                onClick={() => handleDownload("image")}
                isDisabled={!fullScreenshotUrl}
              >
                Image Version
              </Button>
            </div>
            {!isLoggedIn && (
              <p className="mt-2 text-center text-sm text-gray-500">
                You need to be logged in to download newsletters
              </p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
