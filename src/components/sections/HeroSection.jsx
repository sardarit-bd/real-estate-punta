"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaCaretDown } from "react-icons/fa";
import Image from "next/image";

export default function LuxuryHero() {
    const router = useRouter();

    // Filters
    const [city, setCity] = useState("all");
    const [type, setType] = useState("all");
    const [bedrooms, setBedrooms] = useState("all");

    const [openDropdown, setOpenDropdown] = useState(null);

    const toggle = (f) => setOpenDropdown(openDropdown === f ? null : f);

    const handleSelect = (field, val) => {
        if (field === "city") setCity(val);
        if (field === "type") setType(val);
        if (field === "bedrooms") setBedrooms(val);
        setOpenDropdown(null);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (city !== "all") params.set("city", city);
        if (type !== "all") params.set("type", type);
        if (bedrooms !== "all") params.set("bedrooms", bedrooms);

        router.push(`/pages/properties?${params.toString()}`);
    };

    return (
        <section className="bg-[#FFF7F3] py-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT SIDE */}
                <div>
                    <p className="text-gray-600 text-sm mb-2">
                        From as low as $10 per day with limited time offer discounts.
                    </p>

                    <h1 className="text-4xl sm:text-5xl font-bold text-[#113B28] leading-tight">
                        Your <span className="text-[#E7C464]">Property</span>, Our Priority.
                    </h1>

                    {/* SEARCH CARD */}
                    <div className="mt-10 bg-white shadow-lg rounded-3xl p-6 border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* CITY */}
                            <div>
                                <label className="text-gray-600 text-sm">City</label>
                                <div className="relative mt-1">
                                    <div className="custom-box" onClick={() => toggle("city")}>
                                        <span>{city === "all" ? "All Cities" : city}</span>
                                        <FaCaretDown />
                                    </div>

                                    {openDropdown === "city" && (
                                        <div className="dropdown-panel">
                                            {["all", "punta-cana", "bavaro", "cocotal", "cap-cana"].map((item) => (
                                                <div key={item} className="dropdown-item"
                                                     onClick={() => handleSelect("city", item)}>
                                                    {item === "all" ? "All Cities" : item}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* STATUS */}
                            <div>
                                <label className="text-gray-600 text-sm">Status</label>
                                <div className="relative mt-1">
                                    <div className="custom-box" onClick={() => toggle("type")}>
                                        <span>
                                            {type === "all" ? "All Status" : type === "rent" ? "For Rent" : "For Sale"}
                                        </span>
                                        <FaCaretDown />
                                    </div>

                                    {openDropdown === "type" && (
                                        <div className="dropdown-panel">
                                            <div className="dropdown-item" onClick={() => handleSelect("type", "all")}>All Status</div>
                                            <div className="dropdown-item" onClick={() => handleSelect("type", "rent")}>For Rent</div>
                                            <div className="dropdown-item" onClick={() => handleSelect("type", "sale")}>For Sale</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* BEDROOMS */}
                            <div>
                                <label className="text-gray-600 text-sm">Bedrooms</label>
                                <div className="relative mt-1">
                                    <div className="custom-box" onClick={() => toggle("bedrooms")}>
                                        <span>
                                            {{
                                                all: "Any",
                                                1: "1 Bedroom",
                                                2: "2 Bedrooms",
                                                3: "3 Bedrooms",
                                                4: "4+ Bedrooms",
                                            }[bedrooms]}
                                        </span>
                                        <FaCaretDown />
                                    </div>

                                    {openDropdown === "bedrooms" && (
                                        <div className="dropdown-panel">
                                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "all")}>Any</div>
                                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "1")}>1 Bedroom</div>
                                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "2")}>2 Bedrooms</div>
                                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "3")}>3 Bedrooms</div>
                                            <div className="dropdown-item" onClick={() => handleSelect("bedrooms", "4")}>4+ Bedrooms</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleSearch}
                                className="px-8 py-3 w-full bg-[#E7C464] text-black font-semibold rounded-xl shadow"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Popular Search */}
                    {/* <div className="mt-6 flex items-center gap-4 flex-wrap">
                        <span className="text-gray-600 text-sm font-medium">Popular Search</span>
                        {["Modern Villa", "Studio Apartment", "Town House"].map((item) => (
                            <span key={item}
                                  className="px-4 py-1.5 bg-white border rounded-full text-sm shadow cursor-pointer">
                                {item}
                            </span>
                        ))}
                    </div> */}
                </div>

                {/* RIGHT SIDE IMAGE (Your Single Image) */}
                <div className="flex justify-center lg:justify-end">
                    <Image
                        src="/images/home-image.png"   // <<--- USE YOUR IMAGE HERE
                        alt="Luxury Home"
                        width={600}
                        height={700}
                        className="rounded-3xl object-cover shadow-lg"
                    />
                </div>
            </div>

            {/* CUSTOM STYLES */}
            <style>{`
                .custom-box {
                    background: white;
                    padding: 14px 16px;
                    border-radius: 14px;
                    border: 1px solid #E5E7EB;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    color: #05314A;
                    font-weight: 500;
                }
                .custom-box:hover {
                    border-color: #E7C464;
                }
                .dropdown-panel {
                    position: absolute;
                    width: 100%;
                    background: white;
                    padding: 10px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    margin-top: 6px;
                    z-index: 20;
                }
                .dropdown-item {
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #05314A;
                }
                .dropdown-item:hover {
                    background: #E7C464;
                    color: #05314A;
                }
            `}</style>
        </section>
    );
}
