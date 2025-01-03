import { Card } from "@/components/ui/card";

interface AdCardProps {
  isLarge?: boolean;
  className?: string;
}

export function AdCard({ isLarge = false, className = "" }: AdCardProps) {
  // This will be replaced with actual AdSense code when approved
  const AdPlaceholder = () => (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="mb-2 text-xs uppercase tracking-wide">Advertisement</div>
        {/* AdSense code will go here */}
        {/* Example:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );

  return (
    <Card
      className={`group relative w-full overflow-hidden rounded-xl bg-white/5 transition-all duration-300 ${className}`}
    >
      {/* Maintain the same aspect ratio as newsletter cards */}
      <div className="relative w-full pt-[132.35%]">
        <div className="absolute inset-0">
          <AdPlaceholder />
        </div>
      </div>
    </Card>
  );
}
