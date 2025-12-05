"use client";

import Image from "next/image";

export default function AboutPage() {
    return (
        <section className="max-w-7xl mx-auto px-5 py-16 space-y-24">

            {/* HERO SECTION */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1F2328] leading-tight">
                        About <span className="text-[#E63946]">Punta Cana Real Estate</span>
                    </h1>
                    <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                        We help buyers, renters, and investors find the perfect property in the heart of Punta Cana. With years of experience and a passionate team, we offer a seamless, transparent, and trustworthy real estate service.
                    </p>
                </div>

                <div className="relative w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
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
                {[
                    {
                        title: "Our Mission",
                        text: "Provide exceptional real estate solutions that simplify property buying, selling, and renting in Punta Cana. We combine industry expertise, technology, and personalized service."
                    },
                    {
                        title: "Our Vision",
                        text: "To become the most trusted real estate platform in the Dominican Republic — where transparency, customer satisfaction, and innovation set a new industry standard."
                    }
                ].map((item, i) => (
                    <div key={i} className="bg-gradient-to-r from-[#FFEDEB] to-[#FFF3F1] border rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
                        <h2 className="text-2xl font-semibold text-[#1F2328]">{item.title}</h2>
                        <p className="mt-4 text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>

            {/* OUR VALUES */}
            <div>
                <h2 className="text-3xl font-semibold text-[#1F2328] text-center mb-10">
                    Our Core Values
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Trust & Transparency", text: "Every transaction is honest, clear, and professional." },
                        { title: "Customer First", text: "Your goals and satisfaction guide everything we do." },
                        { title: "Innovation", text: "We use modern tools to make your property search easier." },
                        { title: "Integrity", text: "We act with honesty and strong moral principles." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 duration-300">
                            <h3 className="text-lg font-semibold text-[#1F2328]">{item.title}</h3>
                            <p className="mt-3 text-gray-600 text-sm">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <div className="bg-gradient-to-r from-[#FFF5F3] to-[#FFE9E5] border rounded-3xl p-10">
                <h2 className="text-3xl font-semibold text-[#1F2328] mb-8 text-center">
                    Why Choose Us?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Expert Local Knowledge", text: "We know every neighborhood in Punta Cana." },
                        { title: "Verified Properties", text: "Every listing is checked for accuracy and legitimacy." },
                        { title: "Seamless Process", text: "From search to paperwork, we guide you at every step." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 duration-300 text-center">
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
                        { img: "/images/man.avif", name: "Johnathan Miller", role: "Lead Property Consultant" },
                        { img: "/images/girl.jpg", name: "Sophia Rodriguez", role: "Client Relations Manager" },
                        { img: "/images/miller.png", name: "Carlos Ramirez", role: "Investment Specialist" }
                    ].map((member, i) => (
                        <div key={i} className="text-center">
                            <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                                <Image
                                    src={member.img}
                                    alt={member.name}
                                    width={144}
                                    height={144}
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-[#1F2328]">{member.name}</h3>
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
