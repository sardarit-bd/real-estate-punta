"use client";

export default function ArticleCard({ img, category, date, title }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition cursor-pointer">
      {/* IMAGE */}
      <img
        src={img}
        className="w-full h-48 rounded-t-2xl object-cover"
      />

      {/* CONTENT */}
      <div className="p-5">
        {/* Category + Date */}
        <p className="text-sm text-gray-500 mb-2">
          {category} • {date}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-lg leading-snug mb-4">
          {title}
        </h3>

        {/* Read More */}
        <button className="text-gray-700 font-medium flex items-center gap-2 hover:text-black">
          Read More →
        </button>
      </div>
    </div>
  );
}
