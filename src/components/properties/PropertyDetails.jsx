"use client";

import { useState } from "react";
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
        images = [],
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
            image: "/uploads/agent.jpg",
        },
    } = property;

    // 👉 MAIN IMAGE STATE
    const [previewImage, setPreviewImage] = useState(image);

    // 👉 FINAL GALLERY LIST (ensures main + all images included)
    const gallery = [image, ...images].slice(0, 4); // limit to 4 images (1 main + 3 gallery)

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

            {/* TOP SECTION */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">

                {/* MAIN PREVIEW IMAGE */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    <Image
                        src={previewImage}
                        alt={title}
                        fill
                        className="object-cover transition-all duration-300"
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

                    {/* KEY DETAILS */}
                    <div className="bg-white border rounded-xl p-5 md:p-6 shadow-sm">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
                            Key Details
                        </h2>

                        <div className="grid grid-cols-2 gap-5 text-gray-700">
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
                                <span className="text-lg font-semibold capitalize text-gray-800">
                                    {type}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* IMAGE GALLERY (CLICKABLE) */}
                    <div className="grid grid-cols-3 gap-5 mt-4">
                        {gallery.slice(1).map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setPreviewImage(img)}
                                className="w-full h-28 border rounded-xl overflow-hidden flex items-center justify-center bg-white focus:outline-none hover:opacity-80 transition"
                            >
                                {img ? (
                                    <Image
                                        src={img}
                                        alt={`Gallery ${i + 1}`}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-500">No Image</span>
                                )}
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Description
                </h2>
                <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* MAP */}
            <div className="map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8976.524870225803!2d-68.41150214321561!3d18.495511638412378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea890ba67c733c1%3A0x7a0111a8ec90305b!2sCap%20Cana%2C%2023000%20Punta%20Cana%2C%20Dominican%20Republic!5e1!3m2!1sen!2sbd!4v1764738996752!5m2!1sen!2sbd"
                    height="450"
                    className="w-full rounded-xl"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* CONTACT AGENT */}
            <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                    Contact Agent
                </h2>

                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <Image
                        src={agent.image}
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
