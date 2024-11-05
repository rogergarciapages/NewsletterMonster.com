"use client";

import { Button } from "@nextui-org/react";
import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

const EmailCopyProfile = () => {
  const heading =
    "Simply copy our email, add it to your list. As soon as your newsletters get sent out, our system will process your newsletter into our archive.";
  const email = "helloworld@newslettermonster.com";

  // Function to copy email to clipboard
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

  return (
    <div className="my-8 flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">No emails yet? Get started!</h2>
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
    </div>
  );
};

export default EmailCopyProfile;
