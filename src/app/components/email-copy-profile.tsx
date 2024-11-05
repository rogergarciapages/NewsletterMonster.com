"use client";

import { IconCopy } from "@tabler/icons-react";

const EmailCopyProfile = () => {
  const heading =
    "Simply copy our email, add it to your list. As soon as your newsletters get sent out, our system will process your newsletter into our archive.";
  const email = "helloworld@newslettermonster.com";

  // Function to copy email to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email).then(
      () => {
        alert("Email copied to clipboard!");
      },
      err => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">No emails yet? Get started!</h2>
      <p className="mb-4 flex-col text-center">{heading}</p>
      <div className="flex items-center">
        <input
          type="text"
          value={email}
          readOnly
          className="text-md mr-2 rounded border border-gray-300 p-1.5"
        />
        <button
          onClick={copyToClipboard}
          className="rounded bg-zinc-800 p-2 text-lg text-white hover:bg-gray-700 dark:bg-secondary dark:hover:bg-torch-900"
        >
          <IconCopy className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default EmailCopyProfile;
