"use client";
import Image from "next/image";
import { useState } from "react";
import { getProductImage } from "@/lib/productImages";
export default function ProductImage({
  name,
  sizes = "50vw",
  priority = false,
}: {
  name: string;
  sizes?: string;
  priority?: boolean;
}) {
  const source = getProductImage(name);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return source && failedSource !== source ? (
    <Image
      src={source}
      alt={name}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      onError={() => setFailedSource(source)}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-[#74131C] p-6 text-center text-xl font-medium text-white">
      {name}
    </div>
  );
}
