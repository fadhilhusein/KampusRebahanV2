interface SkeletonProps {
  className?: string;
  radius?: string;
}

export function Skeleton({ className = "", radius = "rounded-[2px]" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-foreground/6 ${radius} ${className}`}
    />
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-24 w-full mt-4" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton radius="rounded-2xl" className="h-32 w-full" />
      <div className="space-y-4">
        <Skeleton radius="rounded-xl" className="h-12 w-full" />
        <Skeleton radius="rounded-xl" className="h-12 w-full" />
        <Skeleton radius="rounded-xl" className="h-12 w-full" />
      </div>
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} radius="rounded-2xl" className="h-20 w-full" />
      ))}
    </div>
  );
}
