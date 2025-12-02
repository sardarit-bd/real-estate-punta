"use client";

export default function Pagination({ currentPage, totalPages, setPage }) {
    const pages = [...Array(totalPages).keys()].map(n => n + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-10">

            {/* Prev */}
            <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg border 
                ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
                Prev
            </button>

            {/* Page Buttons */}
            {pages.map((num) => (
                <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-4 py-2 rounded-lg border text-sm
                    ${currentPage === num
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                >
                    {num}
                </button>
            ))}

            {/* Next */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className={`px-4 py-2 rounded-lg border
                ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
                Next
            </button>
        </div>
    );
}
