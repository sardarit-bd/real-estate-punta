"use client";

export default function BlogFilters({
    search, setSearch,
    category, setCategory,
    clearFilters
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

            {/* SEARCH BAR */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex items-center gap-3">

                {/* CATEGORY FILTER */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-40"
                >
                    <option value="all">All Categories</option>
                    <option value="REAL ESTATE">Real Estate</option>
                    <option value="GUIDE">Guide</option>
                    <option value="DESIGN">Design</option>
                </select>

                {/* CLEAR BUTTON */}
                <button
                    onClick={clearFilters}
                    className="text-sm underline text-gray-600 hover:text-gray-900"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
