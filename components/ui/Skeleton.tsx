interface SkeletonProps {
  className?: string;
  radius?: string;
}

export function Skeleton({ className = "", radius = "rounded-full" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`kr-shimmer ${radius} ${className}`}
    />
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl" role="status" aria-label="Memuat produk">
      <Skeleton className="mb-8 h-4 w-48" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
        <Skeleton radius="rounded-[28px] md:rounded-[36px]" className="h-[260px] w-full md:h-[520px]" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton radius="rounded-[20px]" className="mt-4 h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6" role="status" aria-label="Memuat checkout">
      <Skeleton className="h-10 w-48" />
      <Skeleton radius="rounded-[28px]" className="h-32 w-full" />
      <div className="space-y-4">
        <Skeleton radius="rounded-[14px]" className="h-12 w-full" />
        <Skeleton radius="rounded-[14px]" className="h-12 w-full" />
        <Skeleton radius="rounded-[14px]" className="h-12 w-full" />
      </div>
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Memuat transaksi">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} radius="rounded-[20px]" className="h-20 w-full" />
      ))}
    </div>
  );
}
