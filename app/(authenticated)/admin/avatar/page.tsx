"use client";

import { Card, CardContent } from "@/components/ui/card";
import AvatarManager from "./components/AvatarManager";

export default function AvatarManagement() {
  return (
    <div className="mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Avatar Management</h1>
      <Card>
        <CardContent>
          <AvatarManager />
        </CardContent>
      </Card>
    </div>
  );
}
