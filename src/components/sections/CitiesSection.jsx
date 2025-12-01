"use client";
import React from "react";
import CityCard from "../cards/CityCard";

export default function CitiesSection() {

    const cities = [
        { name: "New York", properties: "8 Properties", img: "/images/1.jpg" },
        { name: "San Diego", properties: "0 Properties", img: "/images/2.png" },
        { name: "Miami", properties: "2 Properties", img: "/images/3.jpg" },
        { name: "Los Angeles", properties: "1 Property", img: "/images/4.jpg" },
        { name: "Chicago", properties: "2 Properties", img: "/images/5.jpg" },
    ];

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

                    <button className="text-gray-700 hover:text-black flex items-center gap-2 font-medium">
                        View All Cities →
                    </button>
                </div>

                {/* CITY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {cities.map((city, index) => (
                        <CityCard
                            key={index}
                            name={city.name}
                            properties={city.properties}
                            img={city.img}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
