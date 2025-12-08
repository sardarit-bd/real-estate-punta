'use client'

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { useAuth } from "@/hooks/userAuth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}) {
  const router = useRouter()
  
  const {loading, user} = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3A34]"></div>
      </div>
    );
  }

  if(!user){
    router.push('/')
  }
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <DashboardSidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden container mx-auto px-4 p-6 md:p-12">{children}</main>
      </div>
    </div>
  )
}