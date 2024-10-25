"use client";

import { IconMailOpened } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface NewsletterImageProps {
  imageUrl: string | null;
  subject: string | null;
  brandname: string;
  newsletterId: number;
}

export default function NewsletterImage({ 
  imageUrl, 
  subject, 
  brandname, 
  newsletterId 
}: NewsletterImageProps) {
  if (!imageUrl) return null;

  return (
    <Link href={`/${brandname}/${newsletterId}`}>
      <div className="relative group">
        <div className="aspect-[680/900] w-full">
          <div className="absolute inset-0 p-4">
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                src={imageUrl}
                alt={subject || "Newsletter preview"}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-torch-600/0 group-hover:bg-torch-600/90 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center gap-3">
                  <IconMailOpened className="w-16 h-16 text-white" strokeWidth={2} />
                  <span className="text-white tracking-tighter font-bold text-xl">
                    Open It!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}