"use client";

import Image from "next/image";
import { MapPin, BedDouble, Bath, Square, Phone, Mail } from "lucide-react";

export default function PropertyDetails({ property }) {
    if (!property) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-20 text-center text-gray-600">
                Loading property details...
            </div>
        );
    }

    const {
        image,
        title,
        price,
        address,
        beds,
        baths,
        sqft,
        type,
        description,
        agent = {
            name: "Not Assigned",
            phone: "N/A",
            email: "N/A",
            image: "/uploads/agent.jpg"
        }
    } = property;


    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

            {/* TOP SECTION */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">

                {/* IMAGE */}
                <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* PROPERTY INFO */}
                <div className="flex flex-col space-y-6">

                    {/* TITLE + PRICE */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2328] leading-tight">
                            {title}
                        </h1>
                        <p className="mt-3 text-[#E63946] text-2xl md:text-3xl font-semibold">
                            ${price}
                        </p>
                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-center gap-2 text-gray-600 text-base">
                        <MapPin size={20} />
                        <span>{address}</span>
                    </div>

                    {/* FEATURES CARD */}
                    <div className="bg-white border rounded-xl p-5 md:p-6 shadow-sm">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
                            Key Details
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-5 text-gray-700">

                            <div className="flex items-center gap-3">
                                <BedDouble size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">{beds}</p>
                                    <p className="text-sm text-gray-500">Bedrooms</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Bath size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">{baths}</p>
                                    <p className="text-sm text-gray-500">Bathrooms</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Square size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold">{sqft} sqft</p>
                                    <p className="text-sm text-gray-500">Area</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold text-gray-800 capitalize">
                                    {type}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* DESCRIPTION SECTION */}
            <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-[15px] md:text-base">
                    {description}
                </p>
            </div>

            {/* CONTACT SECTION */}
            <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                    Contact Agent
                </h2>

                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">

                    <Image
                        src={agent.image || "/uploads/agent.jpg"}
                        alt="Agent"
                        width={90}
                        height={90}
                        className="rounded-full object-cover shadow"
                    />

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold">{agent.name}</h3>

                        <div className="flex items-center gap-3 mt-2 text-gray-600">
                            <Phone size={18} />
                            <span>{agent.phone}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-gray-600">
                            <Mail size={18} />
                            <span>{agent.email}</span>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
