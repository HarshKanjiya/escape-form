"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
        
        <div className="pt-4 border-t">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Project Count */}
      <Skeleton className="h-4 w-32" />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
