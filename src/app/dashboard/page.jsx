// app/dashboard/page.tsx
"use client"

import AdminDashboard from "@/components/dashboard/Admin/AdminDashboard";
import OwnerDashboard from "@/components/dashboard/Owner/OwnerDashboard";
import { useAuth } from "@/hooks/userAuth";



export default function DashboardHome() {
  const user = useAuth()

  if (!user) {
    return <p>Access denied</p>;
  }

  return user.role === "admin" ? <AdminDashboard /> : user.role === "owner" ? <OwnerDashboard /> : <p>Access denied</p>;
}