"use client";

import { useState } from "react";
import PropertyCard from "@/components/cards/Property";

export default function Properties() {

    // 👉 PROPERTY DATA (EASY TO REPLACE WITH API)
    const properties = [
        {
            id: 1,
            image: "/uploads/abc.png",
            title: "Luxury Family Home",
            price: "395,000",
            address: "1800-1818 79th St",
            beds: 4,
            baths: 1,
            sqft: 400,
            isFeatured: true,
            type: "sale", // sale | rent
        },
        {
            id: 2,
            image: "/uploads/abcd.png",
            title: "Skyper Pool Apartment",
            price: "280,000",
            address: "1020 Bloomingdale Ave",
            beds: 4,
            baths: 2,
            sqft: 450,
            isFeatured: false,
            type: "sale",
        },
        {
            id: 3,
            image: "/uploads/abc.png",
            title: "North Dillard Street",
            price: "250",
            address: "4330 Bill Shoals Rd",
            beds: 4,
            baths: 2,
            sqft: 400,
            isFeatured: false,
            type: "rent",
        },
        {
            id: 4,
            image: "/uploads/abcd.png",
            title: "Eaton Grant Penthouse",
            price: "180,000",
            address: "7722 18th Ave, Brooklyn",
            beds: 4,
            baths: 2,
            sqft: 450,
            isFeatured: true,
            type: "sale",
        },
        {
            id: 5,
            image: "/uploads/abc.png",
            title: "New Apartment Nice View",
            price: "850",
            address: "42 Avenue O, Brooklyn",
            beds: 4,
            baths: 1,
            sqft: 460,
            isFeatured: true,
            type: "rent",
        },
        {
            id: 6,
            image: "/uploads/abcd.png",
            title: "Diamond Manor Apartment",
            price: "259,000",
            address: "7802 20th Ave, Brooklyn",
            beds: 4,
            baths: 2,
            sqft: 500,
            isFeatured: true,
            type: "sale",
        },
    ];

    // 👉 FILTER LOGIC
    const [filter, setFilter] = useState("all"); // all | sale | rent

    const filteredProperties =
        filter === "all"
            ? properties
            : properties.filter((item) => item.type === filter);

    return (
        <section className="max-w-7xl mx-auto px-5 py-16">

            {/* TOP SECTION */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* TITLE */}
                <div>
                    <h2 className="text-3xl font-semibold text-[#1F1F1F]">
                        Featured Properties
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>

                {/* FILTER BUTTONS */}
                <div className="flex gap-3 text-sm">

                    <button
                        onClick={() => setFilter("all")}
                        className={`px-5 py-2 rounded-full border 
                            ${filter === "all"
                                ? "bg-black text-white"
                                : "border-gray-300 text-gray-700"
                            }`}
                    >
                        All Properties
                    </button>

                    <button
                        onClick={() => setFilter("sale")}
                        className={`px-5 py-2 rounded-full border 
                            ${filter === "sale"
                                ? "bg-black text-white"
                                : "border-gray-300 text-gray-700"
                            }`}
                    >
                        For Sale
                    </button>

                    <button
                        onClick={() => setFilter("rent")}
                        className={`px-5 py-2 rounded-full border 
                            ${filter === "rent"
                                ? "bg-black text-white"
                                : "border-gray-300 text-gray-700"
                            }`}
                    >
                        For Rent
                    </button>

                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

                {filteredProperties.map((item) => (
                    <PropertyCard
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        price={item.price}
                        address={item.address}
                        beds={item.beds}
                        baths={item.baths}
                        sqft={item.sqft}
                        isFeatured={item.isFeatured}
                        isForSale={item.type === "sale"}
                    />
                ))}

            </div>

        </section>
    );
}
