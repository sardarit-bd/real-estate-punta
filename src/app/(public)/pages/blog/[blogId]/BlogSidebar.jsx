"use client";

import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function BlogSidebar({ category, date, author }) {
    return (
        <aside className="lg:sticky top-24 h-fit border rounded-xl bg-white shadow-sm p-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Article Info</h3>

            <div className="space-y-4 text-sm text-gray-600">
                <div>
                    <p className=" text-gray-800"><b>Author: </b>  <span>{author}</span></p>

                </div>

                <div>
                    <p className=" text-gray-800"><b>Published: </b> <span>{new Date(date).toLocaleDateString()}</span></p>
                </div>

                <div>
                    <p className=" text-gray-800 mb-2"><b>Category: </b>  <span className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-md">
                        {category}
                    </span></p>

                </div>
            </div>

            <hr className="my-6" />

            <h4 className="font-semibold text-gray-800 mb-3">Share:</h4>
            <div className="flex gap-3">
                <button
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                    <FaFacebook />
                </button>
                <button
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                    <FaTwitter />
                </button>
                <button
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                    <FaLinkedin />
                </button>
            </div>
        </aside>
    );
}
