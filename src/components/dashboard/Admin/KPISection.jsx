import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Home, DollarSign, PlusCircle, PiIcon, Circle } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

function KPISection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get(`${API_BASE}/dashboard/overview`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load KPI data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Loading..."  icon={Circle}/>
        <KpiCard title="Loading..." icon={Circle}/>
        <KpiCard title="Loading..." icon={Circle}/>
        <KpiCard title="Loading..." icon={Circle}/>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <KpiCard
        icon={Users}
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        trend="+8%"
      />

      <KpiCard
        icon={Home}
        title="Total Properties"
        value={stats.totalProperties.toLocaleString()}
        trend="+12%"
      />

      <KpiCard
        icon={DollarSign}
        title="Featured Revenue"
        value={`$${stats.featuredRevenue.toLocaleString()}`}
        trend="+5%"
      />

      <KpiCard
        icon={PlusCircle}
        title="New Listings"
        value={stats.newListings.toLocaleString()}
        trend="+3%"
      />

    </div>
  );
}

function KpiCard({ icon: Icon, title, value, trend }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="
        bg-white border border-gray-200 rounded-2xl p-6 shadow-lg 
        flex items-center justify-between cursor-pointer
      "
        >
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-[#113B28]">{value}</h3>
                {/* <p className="text-green-600 text-xs mt-1">▲ {trend} this month</p> */}
            </div>

            <div className="h-12 w-12 rounded-xl bg-[#113B28]/10 flex items-center justify-center">
                <Icon size={22} className="text-[#113B28]"/>
            </div>
        </motion.div>
    );
}
export default KPISection;
