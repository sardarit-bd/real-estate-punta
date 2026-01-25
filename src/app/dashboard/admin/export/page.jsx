"use client";

import axios from "axios";
import { FileSpreadsheet, Download, Database, Users, CreditCard } from "lucide-react";

export default function ExportCSVPage() {
  const exports = [
    {
      title: "Properties Data",
      subtitle: "Export all listed properties (CSV format)",
      icon: Database,
      action: async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exports/properties`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "properties.csv");

        document.body.appendChild(link);
        link.click();
      },
    },
    {
      title: "Users Data",
      subtitle: "Export all registered users",
      icon: Users,
      action: async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exports/users`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users.csv");

        document.body.appendChild(link);
        link.click();
      },
    },
    {
      title: "Payments",
      subtitle: "Export Stripe payments",
      icon: CreditCard,
      action: async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exports/payments`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "payments.csv");

        document.body.appendChild(link);
        link.click();
      },
    },
  ];

  return (
    <section className="p-8">
      {/* TOP SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#05314A] flex items-center gap-3">
          <FileSpreadsheet size={32} className="text-[#1F3A34]" />
          Export CSV
        </h1>
        <p className="text-gray-600 mt-1">
          Download your platform data for backup, analytics, or reporting.
        </p>
      </div>

      {/* EXPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exports.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] flex items-center justify-center mb-4">
                <Icon className="text-[#004087]" size={26} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#004087]">
                {item.title}
              </h3>

              {/* Subtitle */}
              <p className="text-gray-500 text-sm mt-1">{item.subtitle}</p>

              {/* Button */}
              <button
                onClick={item.action}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl 
                           bg-[#004087] hover:bg-[#004087] text-white transition"
              >
                <Download size={16} />
                Download CSV
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
