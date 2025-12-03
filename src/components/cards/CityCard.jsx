"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CityCard({ name, properties, img, slug }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/cities/${slug}`)}
      className="flex items-center gap-4 p-4 border rounded-2xl hover:shadow-md transition cursor-pointer"
    >
      <Image
        src={img}
        width={800}
        height={800}
        className="w-14 h-14 rounded-xl object-cover"
        alt={name}
      />

      <div>
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-500 text-sm">{properties}</p>
      </div>
    </div>
  );
}
