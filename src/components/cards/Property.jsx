"use client";

import Image from "next/image";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";

export default function PropertyCard({
    image,
    title,
    price,
    address,
    beds,
    baths,
    sqft,
    isFeatured,
    isForSale,
}) {
    return (
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border p-3">

            {/* IMAGE + BADGES */}
            <div className="relative">
                <Image
                    src={image}
                    alt={title}
                    width={600}
                    height={400}
                    className="rounded-xl w-full h-48 object-cover"
                />

                <div className="absolute top-3 left-3 flex gap-2">
                    {isForSale && (
                        <span className="bg-[#0FA958] text-white text-xs font-semibold px-3 py-1 rounded-md">
                            FOR SALE
                        </span>
                    )}
                    {isFeatured && (
                        <span className="bg-[#EAB308] text-[#1F2922] text-xs font-semibold px-3 py-1 rounded-md">
                            FEATURED
                        </span>
                    )}
                </div>
            </div>

            {/* TITLE + PRICE */}
            <div className="mt-3 flex items-start justify-between">
                <h3 className="text-[17px] font-semibold text-[#1F2328]">
                    {title}
                </h3>
                <span className="text-[#E63946] font-semibold text-[16px]">
                    ${price}
                </span>
            </div>

            {/* LOCATION */}
            <div className="mt-1 flex items-center gap-1 text-gray-600 text-sm">
                <MapPin size={16} />
                {address}
            </div>

            {/* INFO */}
            <div className="mt-4 flex items-center justify-between text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                    <BedDouble size={18} className="text-[#4B5563]" />
                    <span>{beds} Beds</span>
                </div>

                <div className="flex items-center gap-2">
                    <Bath size={18} className="text-[#4B5563]" />
                    <span>{baths} Baths</span>
                </div>

                <div className="flex items-center gap-2">
                    <Square size={18} className="text-[#4B5563]" />
                    <span>{sqft} sqft</span>
                </div>
            </div>
        </div>
    );
}
