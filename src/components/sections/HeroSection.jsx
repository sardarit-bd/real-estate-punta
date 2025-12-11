import SearchCard from "./SearchCard";
import VideoPlayer from "./VideoPlayer";

export default function LuxuryHero() {

    return (
        <section className="bg-[#FFF7F3] py-30">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* LEFT SIDE */}
                <div>
                    <p className="text-gray-600 text-sm mb-2">
                        From as low as $10 per day with limited time offer discounts.
                    </p>

                    <h1 className="text-4xl sm:text-5xl font-bold text-[#113B28] leading-tight">
                        Your <span className="text-[#004087]">Property</span>, Our Priority.
                    </h1>

                    {/* SEARCH CARD */}

                    <SearchCard />
                </div>

                {/* RIGHT SIDE VIDEO PLAYER */}
                <VideoPlayer />
            </div>
        </section>
    );
}