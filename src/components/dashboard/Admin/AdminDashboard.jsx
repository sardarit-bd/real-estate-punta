"use client";

import {
    Users,
    Home,
    DollarSign,
    TrendingUp,
    MapPin,
    ClipboardCheck,
    UserPlus,
    Wallet,
    KeyRound,
    Sparkles,
    Map,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import PropertiesChart from "./PropertiesChart";
import KPISection from "./KPISection.jsx";
import AnalyticsSection from "./AnalyticsSection";

export default function AdminOverview() {
    return (
        <section className="px-4 sm:px-6 lg:px-10 py-10 space-y-10">

            {/* ================================
          TITLE
      ================================= */}
            <div>
                <h1 className="text-3xl font-bold text-[#113B28]">Admin Analytics</h1>
                <p className="text-gray-500 mt-1">
                    Real-time insights, KPIs, and platform performance overview.
                </p>
            </div>

            {/* ================================
          KPI CARDS (TOP)
      ================================= */}
            <KPISection />

            {/* ================================
          ANALYTICS GRID
      ================================= */}
            <AnalyticsSection />

            {/* ================================
          RECENT LISTINGS
      ================================= */}
            {/* <RecentListings /> */}

            {/* ================================
          RECENT USER ACTIVITY
      ================================= */}
            {/* <ActivityLog /> */}
        </section>
    );
}


/* =======================================================
   KPI SECTION
======================================================= */
// function KPISection() {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

//             <KpiCard
//                 icon={Users}
//                 title="Total Users"
//                 value="2,450"
//                 trend="+8%"
//             />

//             <KpiCard
//                 icon={Home}
//                 title="Total Properties"
//                 value="1,020"
//                 trend="+12%"
//             />

//             <KpiCard
//                 icon={DollarSign}
//                 title="Featured Revenue"
//                 value="$18,690"
//                 trend="+5%"
//             />

//             <KpiCard
//                 icon={PlusCircle}
//                 title="New Listings"
//                 value="78"
//                 trend="+3%"
//             />

//         </div>
//     );
// }


/* =======================================================
   ANALYTICS SECTION (CHARTS + KPIs)
======================================================= */
// function AnalyticsSection() {
//     const monthlyData = [5, 12, 9, 18, 25, 32]; // dynamic later
//     const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
//     return (
//         <div className="grid lg:grid-cols-3 gap-8">

//             {/* CHART (placeholder) */}
//             <motion.div
//                 whileHover={{ scale: 1.01 }}
//                 className="col-span-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-6"
//             >
//                 <PropertiesChart data={monthlyData} categories={monthlyLabels} />
//             </motion.div>

//             {/* RIGHT SIDE ANALYTICS */}
//             <motion.div
//                 whileHover={{ scale: 1.01 }}
//                 className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6"
//             >
//                 <h3 className="text-lg font-semibold text-[#113B28]">Key Market Insights</h3>

//                 <InsightRow label="Top Performing City" value="Punta Cana" icon={<MapPin size={16} />} />
//                 <InsightRow label="Most Popular Property Type" value="Villa" icon={<Home size={16} />} />
//                 <InsightRow label="Active Owners" value="351" icon={<Users size={16} />} />
//                 <InsightRow label="Pending Property Approvals" value="7" icon={<ClipboardCheck size={16} />} />
//                 <InsightRow label="New Registrations Today" value="86" icon={<UserPlus size={16} />} />
//                 <InsightRow label="Total Revenue (This Month)" value="$12,830" icon={<Wallet size={16} />} />
//                 <InsightRow label="Properties Sold This Month" value="12" icon={<TrendingUp size={16} />} />
//                 <InsightRow label="Properties Rented This Month" value="27" icon={<KeyRound size={16} />} />
//                 <InsightRow label="Average Property Price" value="$298,500" icon={<DollarSign size={16} />} />
//                 <InsightRow label="Total Featured Listings" value="19" icon={<Sparkles size={16} />} />
//                 <InsightRow label="Total Cities Covered" value="18" icon={<Map size={16} />} />
//             </motion.div>
//         </div>
//     );
// }


/* =======================================================
   RECENT LISTINGS
======================================================= */
function RecentListings() {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
            <h3 className="text-lg font-semibold text-[#113B28] mb-4">
                Recently Added Properties
            </h3>

            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="flex items-center justify-between py-3 border-b last:border-none"
                    >
                        <div className="flex items-center gap-4">
                            <Image
                                src="/images/3.jpg"
                                width={60}
                                height={60}
                                alt="property"
                                className="rounded-xl object-cover"
                            />
                            <div>
                                <p className="font-semibold text-[#113B28]">Luxury Beachside Villa</p>
                                <p className="text-sm text-gray-500">Punta Cana • $350,000</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}


/* =======================================================
   ACTIVITY LOG
======================================================= */
function ActivityLog() {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        >
            <h3 className="text-lg font-semibold text-[#113B28] mb-4">
                Recent Activity
            </h3>

            <div className="space-y-3 text-sm">
                <ActivityItem text="New owner registered" time="2 hours ago" />
                <ActivityItem text="Property ‘Ocean View’ approved" time="5 hours ago" />
                <ActivityItem text="User purchased featured listing" time="1 day ago" />
            </div>
        </motion.div>
    );
}


/* =======================================================
   REUSABLE COMPONENTS
======================================================= */


export function InsightRow({ label, value, icon }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600">
                {icon}
                <span>{label}</span>
            </div>
            <span className="font-semibold text-[#113B28]">{value}</span>
        </div>
    );
}

function ActivityItem({ text, time }) {
    return (
        <div className="flex justify-between border-b last:border-none pb-3">
            <span className="text-gray-700">{text}</span>
            <span className="text-gray-400 text-xs">{time}</span>
        </div>
    );
}
