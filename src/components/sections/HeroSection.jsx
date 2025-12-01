import { Search } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";

export default function HeroSection() {
    return (
        <section className="w-full bg-[#FFF6F2] py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">

                {/* ---------- LEFT: TEXT + SEARCH BOX ---------- */}
                <div className="relative pb-16 sm:pb-20 md:pb-24 lg:pb-28 mt-8 sm:mt-12 lg:mt-32">

                    {/* TEXT */}
                    <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-3">
                        From as low as $10 per day with limited time offer discounts.
                    </p>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight sm:leading-tight text-[#113B28]">
                        Your <span className="text-[#E7C464]">Property</span>, Our Priority.
                    </h1>

                    {/* SEARCH BAR FLOATING */}
                    <div className="relative w-full mt-8 sm:mt-10 md:mt-12 lg:mt-20">
                        <div className="absolute w-full lg:w-[150%] -bottom-16 sm:-bottom-20 left-0 right-0 mx-auto bg-white shadow-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 z-10">
                            
                            {/* KEYWORD */}
                            <div className="flex-1 w-full min-w-0">
                                <label className="text-xs sm:text-sm text-gray-500 block mb-1">Keyword</label>
                                <div className="py-2 sm:py-3 flex items-center gap-2 border-b lg:border-b-0">
                                    <input
                                        type="text"
                                        placeholder="Enter Keyword"
                                        className="outline-none flex-1 text-sm sm:text-base w-full min-w-0"
                                    />
                                    <span className="text-gray-500 text-lg sm:text-xl"><Search /></span>
                                </div>
                            </div>

                            {/* STATUS - Hidden on mobile, visible on lg */}
                            <div className="hidden lg:block flex-1 w-full border-l border-r px-4">
                                <label className="text-xs sm:text-sm text-gray-500 block mb-1">Status</label>
                                <div className="relative">
                                    <select className="appearance-none py-2 sm:py-3 w-full outline-none text-sm sm:text-base bg-transparent">
                                        <option>All Status</option>
                                        <option>For Rent</option>
                                        <option>For Sale</option>
                                    </select>
                                    <FaCaretDown className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none text-sm sm:text-base" />
                                </div>
                            </div>

                            {/* TYPE - Hidden on mobile, visible on lg */}
                            <div className="hidden lg:block flex-1 w-full">
                                <label className="text-xs sm:text-sm text-gray-500 block mb-1">Type</label>
                                <div className="relative">
                                    <select className="appearance-none py-2 sm:py-3 w-full outline-none text-sm sm:text-base bg-transparent">
                                        <option>All Type</option>
                                        <option>Apartment</option>
                                        <option>Villa</option>
                                        <option>House</option>
                                    </select>
                                    <FaCaretDown className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none text-sm sm:text-base" />
                                </div>
                            </div>

                            {/* Mobile Dropdowns (combined) */}
                            <div className="lg:hidden grid grid-cols-2 gap-3 w-full">
                                {/* STATUS - Mobile */}
                                <div className="w-full">
                                    <label className="text-xs sm:text-sm text-gray-500 block mb-1">Status</label>
                                    <div className="relative">
                                        <select className="appearance-none py-2 w-full outline-none text-sm border rounded-lg px-3">
                                            <option>All Status</option>
                                            <option>For Rent</option>
                                            <option>For Sale</option>
                                        </select>
                                        <FaCaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                    </div>
                                </div>

                                {/* TYPE - Mobile */}
                                <div className="w-full">
                                    <label className="text-xs sm:text-sm text-gray-500 block mb-1">Type</label>
                                    <div className="relative">
                                        <select className="appearance-none py-2 w-full outline-none text-sm border rounded-lg px-3">
                                            <option>All Type</option>
                                            <option>Apartment</option>
                                            <option>Villa</option>
                                            <option>House</option>
                                        </select>
                                        <FaCaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* BUTTONS CONTAINER */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                                {/* FILTER BTN - Mobile only */}
                                <button className="px-8 py-4 rounded-lg border font-medium hover:bg-gray-100 transition text-sm sm:text-base">
                                    Filter
                                </button>

                                {/* SEARCH BTN */}
                                <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg lg:rounded-xl bg-[#E7C464] text-black font-medium sm:font-semibold hover:bg-[#d9b452] transition text-sm sm:text-base w-full sm:w-auto">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* POPULAR SEARCH */}
                    <div className="mt-32 sm:mt-36 md:mt-40 lg:mt-52">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <p className="font-medium text-xs sm:text-sm text-gray-600 mb-2">Popular Search</p>
                            {["Modern Villa", "Studio Apartment", "Town House"].map((item) => (
                                <span
                                    key={item}
                                    className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white rounded-full shadow text-xs sm:text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ---------- RIGHT: SINGLE IMAGE ---------- */}
                <div className="relative order-first lg:order-last">
                    <div className="grid grid-cols-1 gap-4">
                        <img
                            src="/images/home-image.png"
                            alt="Property"
                            className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl max-h-[400px] sm:max-h-[500px] lg:max-h-none"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}