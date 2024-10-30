// src/app/user/[userId]/edit/loading.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { Card, CardBody, Skeleton } from "@nextui-org/react";

export default function EditProfileLoading() {
  return (
    <ThreeColumnLayout>
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        <Card>
          <CardBody className="gap-4">
            <Skeleton className="h-8 w-48 rounded-lg"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg"/>
              ))}
              <div className="md:col-span-2">
                <Skeleton className="h-32 rounded-lg"/>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Skeleton className="w-24 h-10 rounded-lg"/>
              <Skeleton className="w-24 h-10 rounded-lg"/>
            </div>
          </CardBody>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}