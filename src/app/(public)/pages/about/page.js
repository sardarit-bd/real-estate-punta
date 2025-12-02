"use client";

import Image from "next/image";

export default function AboutPage() {
    return (
        <section className="max-w-7xl mx-auto px-5 py-16 space-y-20">

            {/* HERO SECTION */}
            <div className="grid md:grid-cols-2 gap-10 items-center">

                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1F2328] leading-tight">
                        About <span className="text-[#E63946]">Punta Cana Real Estate</span>
                    </h1>

                    <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                        We are dedicated to helping buyers, renters, and investors find
                        the perfect property in the beautiful heart of Punta Cana. With
                        years of experience and a passionate team, we offer a seamless,
                        transparent, and trustworthy real estate service.
                    </p>
                </div>

                <div className="relative w-full h-[300px] md:h-[380px] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src="/images/about.png"
                        alt="About Us"
                        fill
                        className="object-cover"
                    />
                </div>

            </div>

            {/* MISSION & VISION */}
            <div className="grid md:grid-cols-2 gap-10">

                <div className="bg-white border rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1F2328]">Our Mission</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        To provide exceptional real estate solutions that simplify
                        property buying, selling, and renting in Punta Cana. We combine
                        industry expertise, technology, and personalized service to help
                        clients make confident property decisions.
                    </p>
                </div>

                <div className="bg-white border rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#1F2328]">Our Vision</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        To become the most trusted real estate platform in the Dominican
                        Republic — where transparency, customer satisfaction, and
                        innovation set a new standard in the real estate industry.
                    </p>
                </div>

            </div>

            {/* OUR VALUES */}
            <div>
                <h2 className="text-3xl font-semibold text-[#1F2328] text-center mb-10">
                    Our Core Values
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            title: "Trust & Transparency",
                            text: "We ensure every transaction is honest, clear, and professional."
                        },
                        {
                            title: "Customer First",
                            text: "Your goals and satisfaction guide everything we do."
                        },
                        {
                            title: "Innovation",
                            text: "We use modern tools to make your property search easier."
                        },
                        {
                            title: "Integrity",
                            text: "We act with honesty and strong moral principles."
                        }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-lg font-semibold text-[#1F2328]">{item.title}</h3>
                            <p className="mt-3 text-gray-600 text-sm">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <div className="bg-gray-50 border rounded-2xl p-10">
                <h2 className="text-3xl font-semibold text-[#1F2328] mb-6 text-center">
                    Why Choose Us?
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Expert Local Knowledge",
                            text: "We know every neighborhood in Punta Cana deeply."
                        },
                        {
                            title: "Verified Properties",
                            text: "Every listing is checked for accuracy and legitimacy."
                        },
                        {
                            title: "Seamless Process",
                            text: "From search to paperwork, we guide you at every step."
                        }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition text-center"
                        >
                            <h3 className="text-xl font-semibold text-[#1F2328]">{item.title}</h3>
                            <p className="mt-3 text-gray-600 text-sm">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TEAM SECTION */}
            <div>
                <h2 className="text-3xl font-semibold text-[#1F2328] text-center mb-10">
                    Meet Our Team
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

                    {[
                        {
                            img: "/images/man.avif",
                            name: "Johnathan Miller",
                            role: "Lead Property Consultant"
                        },
                        {
                            img: "/images/girl.jpg",
                            name: "Sophia Rodriguez",
                            role: "Client Relations Manager"
                        },
                        {
                            img: "/images/miller.png",
                            name: "Carlos Ramirez",
                            role: "Investment Specialist"
                        }
                    ].map((member, i) => (
                        <div key={i} className="text-center">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-md">
                                <Image
                                    src={member.img}
                                    alt={member.name}
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-[#1F2328]">
                                {member.name}
                            </h3>
                            <p className="text-gray-600 text-sm">{member.role}</p>
                        </div>
                    ))}

                </div>
            </div>

            {/* STATS SECTION */}
            <div className="grid sm:grid-cols-3 gap-10 text-center">
                {[
                    { label: "Properties Listed", value: "450+" },
                    { label: "Happy Clients", value: "900+" },
                    { label: "Years Experience", value: "10+" }
                ].map((stat, i) => (
                    <div key={i}>
                        <p className="text-4xl font-bold text-[#E63946]">{stat.value}</p>
                        <p className="text-gray-600 mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

        </section>
    );
}
