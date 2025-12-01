"use client";

import ArticleCard from "../cards/ArticlesSection";


export default function ArticlesSection() {
    const articles = [
        {
            img: "/images/artical-1.jpg",
            category: "Apartment",
            date: "March 19, 2024",
            title: "Housing Markets That Changed the Most This Week",
        },
        {
            img: "/images/artical-2.jpg",
            category: "Apartment",
            date: "March 19, 2024",
            title: "Read Unveils the Best Canadian Cities for Biking",
        },
        {
            img: "/images/artical-3.jpg",
            category: "Office",
            date: "March 19, 2024",
            title: "10 Walkable Cities Where You Can Live Affordably",
        },
        {
            img: "/images/artical-4.jpg",
            category: "Shop",
            date: "March 19, 2024",
            title: "New Apartment Nice in the Best Canadian Cities",
        },
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* TOP TITLE */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Recent Articles & News
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Checkout the latest updates and insights from our experts.
                    </p>
                </div>


                {/* ARTICLE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {articles.map((item, index) => (
                        <ArticleCard
                            key={index}
                            img={item.img}
                            category={item.category}
                            date={item.date}
                            title={item.title}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
