// C:\Users\Usuario\Documents\GitHub\nm4\src\app\user\[userId]\edit\loading.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { Card, CardBody, Skeleton } from "@nextui-org/react";

export default function EditProfileLoading() {
  return (
    <ThreeColumnLayout>
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        <Card>
          <CardBody className="gap-4">
            {/* Header */}
            <Skeleton className="h-8 w-48 rounded-lg"/>
            
            {/* Form content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Image Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full flex-shrink-0"/>
                    <Skeleton className="h-14 w-full rounded-lg"/>
                  </div>
                </div>

                {/* Regular inputs */}
                <Skeleton className="h-14 rounded-lg"/> {/* Name */}
                <Skeleton className="h-14 rounded-lg"/> {/* Surname */}
                <Skeleton className="h-14 rounded-lg"/> {/* Username */}
                <Skeleton className="h-14 rounded-lg"/> {/* Company Name */}

                {/* Bio - Full width */}
                <div className="md:col-span-2">
                  <Skeleton className="h-32 rounded-lg"/>
                </div>

                {/* More regular inputs */}
                <Skeleton className="h-14 rounded-lg"/> {/* Website */}
                <Skeleton className="h-14 rounded-lg"/> {/* Location */}
                <Skeleton className="h-14 rounded-lg"/> {/* Twitter */}
                <Skeleton className="h-14 rounded-lg"/> {/* Instagram */}
                <Skeleton className="h-14 rounded-lg"/> {/* LinkedIn */}
                <Skeleton className="h-14 rounded-lg"/> {/* YouTube */}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <Skeleton className="w-24 h-10 rounded-lg"/>
                <Skeleton className="w-24 h-10 rounded-lg"/>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}