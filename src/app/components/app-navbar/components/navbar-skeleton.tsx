export default function NavbarSkeleton() {
    return (
      <div className="w-full h-16 bg-background/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="w-32 h-8 bg-default-200 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="w-20 h-8 bg-default-200 rounded animate-pulse" />
            <div className="w-20 h-8 bg-default-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }