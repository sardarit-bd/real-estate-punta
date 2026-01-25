"use client"

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import BlogDetails from "./BlogDetails";
import BlogSidebar from "./BlogSidebar";

export default function BlogDetailsPage() {
    const params = useParams()
    const id = params.blogId;
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${id}`);
                const data = await response.json();
                setBlog(data?.data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

       if(id){
         fetchBlog();
       }
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-gray-600">Loading...</div>;
    }

    if (!blog) {
        return <div className="text-center py-20 text-gray-600">Blog not found.</div>;
    }

    return (
        <section className="max-w-7xl mx-auto px-5 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_300px] gap-10">

                {/* BLOG DETAILS */}
                <BlogDetails blog={blog} />

                {/* RIGHT SIDEBAR */}
                <BlogSidebar
                    author={blog?.author?.name}
                    date={blog?.createdAt}
                    category={blog.category}
                />
            </div>
        </section>
    );
}