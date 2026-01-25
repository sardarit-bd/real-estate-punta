"use client";

import BlogList from "@/app/(public)/pages/blog/BlogList";
import BlogCard from "@/components/cards/Blog";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";

export default function Blogs() {

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  // FETCH DATA FROM API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs?status=published&limit=4`,
          {
            credentials: 'include'
          }
        )

        const data = await res.json()

        if (data.success) {
          setBlogs(data.data)
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, []);

  if (loading) {
    return <Loader />
  }
  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-[#1F1F1F]">
          Latest From Our Blog
        </h2>
        <p className="text-gray-500 mt-1">
          Stay updated with expert real-estate tips, guides, and trends.
        </p>
      </div>

      {/* BLOG GRID */}
      <BlogList blogs={blogs} />
    </section>
  );
}
