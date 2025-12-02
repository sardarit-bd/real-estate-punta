"use client";

import { useState, useEffect } from "react";
import BlogFilters from "./BlogFilters";
import BlogList from "./BlogList";

export default function BlogPage() {
    // EXAMPLE BLOG DATA
const blogs = [
  {
    id: 1,
    image: "/images/6.jpg",
    title: "Top 10 Property Investment Tips for Beginners",
    excerpt:
      "Learn the essential strategies to maximize your real-estate investment profits with expert-approved techniques.",
    author: "Admin",
    date: "Jan 10, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 2,
    image: "/images/1.jpg",
    title: "How to Choose the Right Location for Your Dream Home",
    excerpt:
      "Location plays the most important part when buying a house. Here’s how to choose the perfect one.",
    author: "Sarah",
    date: "Jan 15, 2025",
    category: "GUIDE",
  },
  {
    id: 3,
    image: "/images/3.jpg",
    title: "Best Interior Designs That Increase Property Value",
    excerpt:
      "These modern interior trends not only beautify your home but also boost resale value significantly.",
    author: "Michael",
    date: "Jan 20, 2025",
    category: "DESIGN",
  },

  // EXTRA BLOGS --------------------------

  {
    id: 4,
    image: "/images/6.jpg",
    title: "Real Estate Market Trends to Expect in 2025",
    excerpt:
      "Discover the key market movements expected to shape the real-estate industry in 2025 and beyond.",
    author: "Admin",
    date: "Jan 22, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 5,
    image: "/images/1.jpg",
    title: "What First-Time Home Buyers Must Know",
    excerpt:
      "Important financial and legal factors you should keep in mind before purchasing your first home.",
    author: "Emily",
    date: "Jan 25, 2025",
    category: "GUIDE",
  },
  {
    id: 6,
    image: "/images/3.jpg",
    title: "Top 5 Modern Kitchen Makeovers",
    excerpt:
      "Upgrade your kitchen with these trending design ideas that add style and functionality.",
    author: "David",
    date: "Jan 28, 2025",
    category: "DESIGN",
  },
  {
    id: 7,
    image: "/images/6.jpg",
    title: "How to Boost the Value of Your Home Before Selling",
    excerpt:
      "Simple improvements that can significantly increase your property's resale value.",
    author: "Admin",
    date: "Feb 1, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 8,
    image: "/images/1.jpg",
    title: "Beginner’s Guide to Renting vs Buying a House",
    excerpt:
      "Understand the pros and cons of renting versus buying in today’s housing market.",
    author: "Sarah",
    date: "Feb 2, 2025",
    category: "GUIDE",
  },
  {
    id: 9,
    image: "/images/3.jpg",
    title: "Creative Bedroom Makeover Ideas for 2025",
    excerpt:
      "Transform your bedroom into a modern retreat with these trending interior concepts.",
    author: "Michael",
    date: "Feb 4, 2025",
    category: "DESIGN",
  },
  {
    id: 10,
    image: "/images/6.jpg",
    title: "Should You Invest in Vacation Rental Properties?",
    excerpt:
      "Vacation rentals are booming—learn whether it's the right investment choice for you.",
    author: "Admin",
    date: "Feb 6, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 11,
    image: "/images/1.jpg",
    title: "How to Inspect a Home Before Buying",
    excerpt:
      "Avoid costly mistakes by learning the most important home inspection techniques.",
    author: "Sarah",
    date: "Feb 7, 2025",
    category: "GUIDE",
  },
  {
    id: 12,
    image: "/images/3.jpg",
    title: "Top 2025 Living Room Decor Trends",
    excerpt:
      "Explore the most stylish living room trends that designers are loving this year.",
    author: "Michael",
    date: "Feb 8, 2025",
    category: "DESIGN",
  },
  {
    id: 13,
    image: "/images/6.jpg",
    title: "Why Real Estate Is Still the Safest Investment",
    excerpt:
      "Even in market uncertainty, real estate continues to provide long-term security.",
    author: "Admin",
    date: "Feb 10, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 14,
    image: "/images/1.jpg",
    title: "Essential Checklist for Moving Into a New Home",
    excerpt:
      "Stay organized and stress-free with this complete moving day checklist.",
    author: "Emily",
    date: "Feb 12, 2025",
    category: "GUIDE",
  },
  {
    id: 15,
    image: "/images/3.jpg",
    title: "Minimalistic Home Design Ideas to Try",
    excerpt:
      "Create a simple, elegant, and timeless home with these minimalistic design principles.",
    author: "David",
    date: "Feb 14, 2025",
    category: "DESIGN",
  },
  {
    id: 16,
    image: "/images/6.jpg",
    title: "How to Negotiate Property Prices Like a Pro",
    excerpt:
      "Master the art of negotiation and secure your next property at a competitive price.",
    author: "Admin",
    date: "Feb 15, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 17,
    image: "/images/1.jpg",
    title: "Everything You Should Know About Home Loans",
    excerpt:
      "Break down interest rates, mortgage types, and qualification rules in simple terms.",
    author: "Sarah",
    date: "Feb 16, 2025",
    category: "GUIDE",
  },
  {
    id: 18,
    image: "/images/3.jpg",
    title: "2025 Color Palette Ideas for Your Home",
    excerpt:
      "Brighten up your interior with the trending color palettes of 2025.",
    author: "Michael",
    date: "Feb 18, 2025",
    category: "DESIGN",
  },
  {
    id: 19,
    image: "/images/6.jpg",
    title: "Smart Home Technologies That Improve Property Value",
    excerpt:
      "Discover the top smart upgrades that appeal most to modern home buyers.",
    author: "Admin",
    date: "Feb 19, 2025",
    category: "REAL ESTATE",
  },
  {
    id: 20,
    image: "/images/1.jpg",
    title: "How to Budget Your Finances Before Buying Property",
    excerpt:
      "Here’s how to prepare your budget to make a financially confident property purchase.",
    author: "Emily",
    date: "Feb 20, 2025",
    category: "GUIDE",
  },
];


    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    // FILTER LOGIC
    const filteredBlogs = blogs.filter((blog) => {
        return (
            (category === "all" || blog.category === category) &&
            (search === "" ||
                blog.title.toLowerCase().includes(search.toLowerCase()))
        );
    });

    // CLEAR FILTERS
    const clearFilters = () => {
        setSearch("");
        setCategory("all");
    };

    return (
        <section className="max-w-7xl mx-auto px-5 py-16">

            {/* PAGE TITLE */}
            <h2 className="text-3xl font-semibold text-[#1F1F1F] mb-2">
                Latest Articles
            </h2>
            <p className="text-gray-600 mb-10">
                Stay updated with the latest real estate insights.
            </p>

            {/* FILTERS */}
            <BlogFilters
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                clearFilters={clearFilters}
            />

            {/* LIST */}
            <BlogList blogs={filteredBlogs} />
        </section>
    );
}
