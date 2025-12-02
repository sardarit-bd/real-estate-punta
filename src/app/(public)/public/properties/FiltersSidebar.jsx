"use client";

export default function FiltersSidebar({
    query, setQuery,
    city, setCity,
    type, setType,
    bedrooms, setBedrooms,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    clearFilters
}) {
    return (
        <aside className="lg:sticky top-24 h-fit border rounded-xl p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                    Clear all
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">Search</label>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                    placeholder="Search by keyword..."
                />
            </div>

            {/* CITY FILTER */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">City</label>
                <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                >
                    <option value="all">All Cities</option>
                    <option value="punta-cana">Punta Cana</option>
                    <option value="bavaro">Bávaro</option>
                    <option value="cocotal">Cocotal</option>
                    <option value="cap-cana">Cap Cana</option>
                </select>
            </div>

            {/* PROPERTY TYPE */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                >
                    <option value="all">All Types</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                </select>
            </div>

            {/* BEDROOMS */}
            <div className="mb-5">
                <label className="text-sm text-gray-600">Bedrooms</label>
                <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                >
                    <option value="all">Any</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                </select>
            </div>

            {/* PRICE RANGE */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-sm text-gray-600">Min Price</label>
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        placeholder="0"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Max Price</label>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="mt-1 w-full border rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        placeholder="500000"
                    />
                </div>
            </div>
        </aside>
    );
}
