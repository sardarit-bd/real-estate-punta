"use client";

import { useState } from "react";
import { Menu, X, Home } from "lucide-react";
import SidebarNav from "./Sidebarnav";
import { getDashboardSideMenu } from "@/app/helpers/getDashboardSidebarMenu";
import { useAuth } from "@/hooks/userAuth";
import Image from "next/image";
import Link from "next/link";

export function DashboardSidebar() {
    const { user, loading } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    if (loading) {
        return <h2>Loading...</h2>
    }
    const sidebarNavItems = getDashboardSideMenu(user?.role);

    return (
        <section>

            {/* ============================
                DESKTOP SIDEBAR (Real Estate)
            ============================ */}
            <aside
                className="
                    hidden md:flex flex-col fixed left-0 top-0 
                    bg-[#F9F9F9] text-[#113B28]
                    border-r border-gray-200 
                    h-screen w-[250px]
                    shadow-xl z-40
                "
            >
                {/* Branding Header */}
                <div className="flex items-center justify-center gap-2 h-16 border-b border-gray-200font-bold tracking-wide text-[22px] text-[#113B28] " >
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/logo.png"
                            alt="Punta Cana Real Estate"
                            width={150}
                            height={150}
                            className="w-[150px]"
                        />
                    </Link>
                </div>

                {/* NAVIGATION */}
                <div className="mt-4">
                    <SidebarNav items={sidebarNavItems} />
                </div>
            </aside>

            {/* ============================
                MOBILE OVERLAY
            ============================ */}
            <div
                className={`
                    fixed inset-0 bg-black/50 z-30 
                    transition-opacity duration-300
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* ============================
                MOBILE DRAWER SIDEBAR
            ============================ */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-white 
                    text-[#113B28] border-r border-gray-200 shadow-xl
                    transform transition-transform duration-300 z-40
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:hidden
                `}
            >
                {/* Drawer Header */}
                <div className="
                    flex justify-between items-center p-4 
                    border-b border-gray-200
                ">
                    <h2 className="text-lg font-bold tracking-wide text-[#113B28]">
                        Dashboard
                    </h2>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-[#113B28] hover:text-[#0e2f20]"
                    >
                        <X size={26} />
                    </button>
                </div>

                {/* NAVIGATION */}
                <div className="mt-2">
                    <SidebarNav items={sidebarNavItems} />
                </div>
            </aside>

            {/* ============================
                MOBILE TOP BAR
            ============================ */}
            <div
                className="
                    md:hidden px-4 flex justify-between items-center 
                    h-16 bg-white sticky top-0 z-20 w-full 
                    border-b border-gray-200 shadow-sm
                "
            >
                <h2 className="font-semibold text-[#113B28] tracking-wide">
                    Welcome, {user?.name || "User"}
                </h2>

                <button
                    onClick={() => setIsOpen(true)}
                    className="
                        p-2 rounded-lg bg-[#113B28] 
                        text-white shadow-md hover:bg-[#0d2b1c] 
                        transition-colors
                    "
                >
                    <Menu size={22} />
                </button>
            </div>
        </section>
    );
}
