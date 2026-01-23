"use client";
import CityCard from "@/components/cards/CityCard";
// import CityCard from "@/components/cards/CityCard";
import { citiesData } from "@/data/cities";
import { useRouter } from "next/navigation";
import React from "react";

export default function CitiesPage() {
     const router = useRouter();

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* TOP HEADING */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Find Properties in These Cities
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Explore the most popular areas to find your ideal home or investment.
                        </p>
                    </div>

                    {/* <button onClick={() => router.push("/cities")} className="text-sm text-gray-600">
                        View All →
                    </button> */}
                </div>
                {/* CITY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {citiesData.map((city, index) => (
                        <CityCard
                            key={index}
                            name={city.name}
                            img={city.img}
                            slug={city.slug}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
