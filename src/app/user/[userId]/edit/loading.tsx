// C:\Users\Usuario\Documents\GitHub\nm4\src\app\user\[userId]\edit\loading.tsx
import { Card, CardBody, Skeleton } from "@nextui-org/react";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function EditProfileLoading() {
  return (
    <ThreeColumnLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <Card>
          <CardBody className="gap-4">
            {/* Header */}
            <Skeleton className="h-8 w-48 rounded-lg" />

            {/* Form content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Profile Image Section */}
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Skeleton className="mx-auto h-24 w-24 flex-shrink-0 rounded-full sm:mx-0 sm:h-32 sm:w-32" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-5 w-40 rounded-lg" />
                      <Skeleton className="h-4 w-full max-w-md rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                  <Skeleton className="mt-2 h-4 w-full max-w-lg rounded-lg" />
                </div>

                {/* Field skeletons with reset button placeholders */}
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={index === 3 ? "relative md:col-span-2" : "relative"}>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24 rounded-lg" /> {/* Label */}
                      <div className="flex items-center">
                        <div className="flex-grow">
                          <Skeleton
                            className={
                              index === 3 ? "h-32 w-full rounded-lg" : "h-12 w-full rounded-lg"
                            }
                          />{" "}
                          {/* Input */}
                        </div>
                        <div className="ml-2">
                          <Skeleton className="h-8 w-8 rounded-full" /> {/* Reset button */}
                        </div>
                      </div>
                      <Skeleton className="h-3 w-48 rounded-lg" /> {/* Description */}
                    </div>
                  </div>
                ))}

                {/* Social Media Section */}
                <div className="mt-6 md:col-span-2">
                  <Skeleton className="mb-4 h-6 w-48 rounded-lg" /> {/* Section title */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={`social-${index}`} className="relative">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24 rounded-lg" /> {/* Label */}
                          <div className="flex items-center">
                            <div className="flex-grow">
                              <Skeleton className="h-12 w-full rounded-lg" /> {/* Input */}
                            </div>
                            <div className="ml-2">
                              <Skeleton className="h-8 w-8 rounded-full" /> {/* Reset button */}
                            </div>
                          </div>
                          <Skeleton className="h-3 w-48 rounded-lg" /> {/* Description */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons and warning area */}
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg" /> {/* Warning message area */}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
