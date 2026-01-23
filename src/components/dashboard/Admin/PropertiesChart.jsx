"use client";

import dynamic from "next/dynamic";

// ApexCharts must be loaded dynamically in Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PropertiesChart({ data = [], categories = [] }) {
    console.log("categories", categories)
    console.log("data", data)
  const series = [
    {
      name: "New Properties",
      data,
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    colors: ["#E7C464"],

    stroke: {
      curve: "smooth",
      width: 3,
    },

    xaxis: {
      categories,
      title: { text: "Months" },
    },

    yaxis: {
      title: { text: "Number of Properties" },
      min: 0,
    },

    markers: {
      size: 5,
      colors: ["#E7C464"],
      strokeColors: "#05314A",
      strokeWidth: 2,
    },

    grid: {
      borderColor: "#e5e7eb",
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value} Properties`,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-[#05314A]">
        Property Listing Growth
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        This graph shows how many properties were added each month.
      </p>

      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
