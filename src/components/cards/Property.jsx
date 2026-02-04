"use client";

import Image from "next/image";
import { MapPin, BedDouble, Bath, Square, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PropertyCard({
  id,
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
  const { t } = useTranslation();

  const [isFavourite, setIsFavourite] = useState(false);

  // Load favourite status from localStorage on component mount
  useEffect(() => {
    const favourites = JSON.parse(
      localStorage.getItem("favouriteProperties") || "[]"
    );
    setIsFavourite(favourites.includes(id));
  }, [id]);

  const toggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favourites = JSON.parse(
      localStorage.getItem("favouriteProperties") || "[]"
    );

    const updatedFavourites = isFavourite
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    localStorage.setItem(
      "favouriteProperties",
      JSON.stringify(updatedFavourites)
    );
    setIsFavourite(!isFavourite);

    window.dispatchEvent(new Event("favourites-updated"));
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border p-3 group hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* IMAGE + BADGES + FAVOURITE */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="rounded-xl w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          {isForSale && (
            <span className="bg-[#0FA958] text-white text-xs font-semibold px-3 py-1 rounded-md">
              {t("forSale")}
            </span>
          )}
          {isFeatured && (
            <span className="bg-[#004087] text-white text-xs font-semibold px-3 py-1 rounded-md">
              {t("featured")}
            </span>
          )}
        </div>

        {/* FAVOURITE BUTTON */}
        <button
          onClick={toggleFavourite}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center 
                     hover:bg-white hover:scale-110 transition-all duration-300 shadow-md"
          aria-label={
            isFavourite
              ? t("removeFromFavourites")
              : t("addToFavourites")
          }
        >
          <Heart
            size={20}
            className={
              isFavourite
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }
          />
        </button>
      </div>

      {/* TITLE + PRICE */}
      <div className="mt-3 flex items-start justify-between">
        <h3 className="text-[17px] font-semibold text-[#1F2328]">
          {title}
        </h3>
        <span className="text-[#E63946] font-semibold text-[16px]">
          ${price.toLocaleString()}
        </span>
      </div>

      {/* LOCATION */}
      <div className="mt-1 flex items-center gap-1 text-gray-600 text-sm">
        <MapPin size={16} />
        <span className="truncate">{address}</span>
      </div>

      {/* INFO */}
      <div className="mt-4 flex items-center justify-between text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <BedDouble size={18} className="text-[#4B5563]" />
          <span>
            {beds} {t("beds")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Bath size={18} className="text-[#4B5563]" />
          <span>
            {baths} {t("baths")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Square size={18} className="text-[#4B5563]" />
          <span>
            {sqft?.toLocaleString()} {t("sqft")}
          </span>
        </div>
      </div>
    </div>
  );
}
