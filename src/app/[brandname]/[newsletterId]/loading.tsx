// app/[brandname]/[newsletterId]/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
        <div className="h-12 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }