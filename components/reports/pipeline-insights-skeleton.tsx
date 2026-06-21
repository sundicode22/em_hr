import { cardClassName } from "@/config/design-system";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function PipelineInsightsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={cn(cardClassName, "p-5")}>
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>
      <div className={cn(cardClassName, "p-6")}>
        <Skeleton className="mb-6 h-5 w-40" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="mb-4 h-8 w-full rounded-full" />
        ))}
      </div>
      <div className={cn(cardClassName, "p-6")}>
        <Skeleton className="mb-6 h-5 w-40" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
