"use client";

import { useAuth } from "@/hooks/userAuth";
import axios from "axios";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SidebarNav({ items }) {
    const pathname = usePathname();
    const {logout} = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logout Successfull.")
        } catch (err) {
            console.log(err)
            toast.error("Something Wrong when logout. Please wait and try again.")
        }
    }

    return (
        <nav className="flex flex-col px-4 py-6 space-y-2 w-full">

            {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`relative group flex items-center gap-3 rounded-xl px-4 py-3 
                            text-sm font-medium transition-all duration-200
                            ${isActive
                                ? "bg-[#113B28] text-white shadow-md"
                                : "text-[#113B28]/80 hover:bg-[#E7C464]/20 hover:text-[#113B28]"
                            }
                        `}
                    >
                        {/* Left Accent Bar */}
                        <span
                            className={`
                                absolute left-0 top-0 h-full w-[4px] rounded-r-lg transition-all duration-200
                                ${isActive ? "bg-[#E7C464]" : "bg-transparent group-hover:bg-[#E7C464]"}
                            `}
                        />

                        {/* ICON */}
                        {Icon && (
                            <Icon
                                size={18}
                                className={`transition-colors duration-200
                                    ${isActive
                                        ? "text-white"
                                        : "text-[#113B28]/70 group-hover:text-[#113B28]"
                                    }
                                `}
                            />
                        )}

                        {/* TEXT */}
                        <span>{item.title}</span>
                    </Link>
                );
            })}

            {/* ================= Logout Button ================= */}
            <button onClick={handleLogout}
                className="
                    mt-3 cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    border border-[#113B28]/20 text-[#113B28]
                    transition-all duration-200
                    hover:bg-[#E7C464]/20 hover:text-[#113B28]
                "
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </nav>
    );
}
