"use client";

import { useEffect, useState } from "react";
import { Search, ArrowUpDown, Calendar, FileDown } from "lucide-react";
import CustomSelect from "@/components/dashboard/Admin/CustomSelect";
import { paymentService } from "@/services/payment.service";
import Loader from "@/components/common/Loader";


export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true)

  // FILTER STATES
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [transactions, setTransaction] = useState([])

    useEffect(() => {
      fetchLeases();
    }, []);
  
    const fetchLeases = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getPaymentHistory()
        console.log(response.data?.data?.payments)
       setTransaction(response.data?.data?.payments)
      } catch (err) {
        console.error('Error fetching leases:', err);
      } finally {
        setLoading(false);
      }
    };

  
  // SORTING LOGIC
  if(loading) return <Loader />

  const sortedData = [...transactions].sort((a, b) => {
    if (sortOrder === "asc") return a[sortField] > b[sortField] ? 1 : -1;
    return a[sortField] < b[sortField] ? 1 : -1;
  });


  // FILTER LOGIC
  const filteredData = sortedData.filter((t) => {
    // const matchesSearch =
    //   t.id.toLowerCase().includes(search.toLowerCase()) ||
    //   t.user.toLowerCase().includes(search.toLowerCase());

    // const matchesType = filterType === "All" || t.paymentType?.toLowerCase() === filterType.toLowerCase().replace(' ', '_');
    const matchesStatus = filterStatus === "All" || t.status?.toLowerCase() === filterStatus?.toLowerCase();

    const matchesDateFrom = dateFrom ? t.createdAt >= dateFrom : true;
    const matchesDateTo = dateTo ? t.createdAt <= dateTo : true;

    return (
      // matchesSearch &&
      // matchesType &&
      matchesStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-semibold text-[#05314A] mb-4">Transactions</h1>
      <p className="text-gray-500 mb-6">View and manage all platform payments.</p>

      {/* SEARCH + EXPORT */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 w-full md:w-80 shadow-sm">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by ID or User"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div> */}

        {/* <button className="flex items-center gap-2 bg-[#05314A] text-white px-4 py-2 rounded-xl shadow-sm hover:bg-[#074469] transition">
          <FileDown size={16} /> Export CSV
        </button> */}
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border rounded-xl p-4 shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* TYPE FILTER */}
          {/* <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Transaction Type
            </label>
            <CustomSelect
              value={filterType}
              options={["All", "Featured Listing"]}
              onChange={setFilterType}
            />
          </div> */}

          {/* STATUS FILTER */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Status</label>
            <CustomSelect
              value={filterStatus}
              options={["All", "Paid", "Failed", "Pending"]}
              onChange={setFilterStatus}
            />
          </div>

          {/* DATE FROM */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Date From</label>
            <div className="border rounded-xl px-3 py-2 flex items-center gap-2 bg-white shadow-sm">
              <Calendar size={16} className="text-gray-500" />
              <input
                type="date"
                className="outline-none text-sm w-full"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
    
          </div>

          {/* DATE TO */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Date To</label>
            <div className="border rounded-xl px-3 py-2 flex items-center gap-2 bg-white shadow-sm">
              <Calendar size={16} className="text-gray-500" />
              <input
                type="date"
                className="outline-none text-sm w-full"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F7FBFC] text-[#05314A]">
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("id")}>
                ID <ArrowUpDown size={14} className="inline-block ml-1" />
              </th>

              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("user")}>
                User <ArrowUpDown size={14} className="inline-block ml-1" />
              </th>

              <th
                className="py-3 px-4 cursor-pointer"
                onClick={() => toggleSort("amount")}
              >
                Amount <ArrowUpDown size={14} className="inline-block ml-1" />
              </th>

              <th className="py-3 px-4">Type</th>

              <th
                className="py-3 px-4 cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                Date <ArrowUpDown size={14} className="inline-block ml-1" />
              </th>

              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((t, index) => (
              <tr key={index} className="border-t hover:bg-[#F8F8F8] transition">
                <td className="py-3 px-4 font-medium text-[#05314A]">{index + 1}</td>
                <td className="py-3 px-4">{t.user?.name || 'N/A'}</td>
                <td className="py-3 px-4">${t.amount.toFixed(2)}</td>
                <td className="py-3 px-4">{t.paymentType}</td>
                <td className="py-3 px-4">{new Date(t.createdAt).toLocaleString()}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // SORT HANDLER
  function toggleSort(field) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }
}
