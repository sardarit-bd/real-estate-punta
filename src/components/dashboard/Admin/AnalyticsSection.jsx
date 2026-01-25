import Loader from "@/components/common/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import PropertiesChart from "./PropertiesChart";
import { InsightRow } from "./AdminDashboard";
import { ClipboardCheck, DollarSign, Home, KeyRound, Map, MapPin, Sparkles, TrendingUp, UserPlus, Users, Wallet } from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

function AnalyticsSection() {
  /* -------------------------
     PROPERTY GROWTH
  --------------------------*/

  const {
    data: growth = [],
    isLoading: growthLoading,
  } = useQuery({
    queryKey: ["dashboard-property-growth"],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/dashboard/property-growth`
      );
      return res.data;
    },
  });

  /* -------------------------
     MARKET INSIGHTS
  --------------------------*/

  const {
    data: insights,
    isLoading: insightsLoading,
  } = useQuery({
    queryKey: ["dashboard-market-insights"],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/dashboard/market-insights`
      );
      return res.data;
    },
  });

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartLabels = growth.map(i => monthNames[i.month - 1]);
  const chartData = growth.map(i => i.count);

  if (growthLoading || insightsLoading) {
    return <Loader />;
  }

  if (!insights) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-8">

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="col-span-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-6"
      >
        <PropertiesChart
          data={chartData}
          categories={chartLabels}
        />
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6"
      >
        <h3 className="text-lg font-semibold text-[#113B28]">
          Key Market Insights
        </h3>

        <InsightRow label="Top Performing City" value={insights.topCity || "-"} icon={<MapPin size={16} />} />
        <InsightRow label="Most Popular Property Type" value={insights.mostPopularType || "-"} icon={<Home size={16} />} />
        <InsightRow label="Active Owners" value={insights.activeOwners} icon={<Users size={16} />} />
        <InsightRow label="Pending Property Approvals" value={insights.pendingApprovals} icon={<ClipboardCheck size={16} />} />
        <InsightRow label="New Registrations Today" value={insights.newRegistrationsToday} icon={<UserPlus size={16} />} />
        <InsightRow label="Total Revenue (This Month)" value={`$${insights.monthRevenue.toLocaleString()}`} icon={<Wallet size={16} />} />
        <InsightRow label="Properties Sold This Month" value={insights.sold} icon={<TrendingUp size={16} />} />
        <InsightRow label="Properties Rented This Month" value={insights.rented} icon={<KeyRound size={16} />} />
        <InsightRow label="Average Property Price" value={`$${Math.round(insights.averagePrice).toLocaleString()}`} icon={<DollarSign size={16} />} />
        <InsightRow label="Total Featured Listings" value={insights.totalFeatured} icon={<Sparkles size={16} />} />
        <InsightRow label="Total Cities Covered" value={insights.totalCities} icon={<Map size={16} />} />
      </motion.div>

    </div>
  );
}

export default AnalyticsSection;
