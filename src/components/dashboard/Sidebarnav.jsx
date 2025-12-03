"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav({ items }) {
    const pathname = usePathname();

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
                            ${
                                isActive
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
                                    ${
                                        isActive
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
            <Link
                href="/"
                className="
                    mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    border border-[#113B28]/20 text-[#113B28]
                    transition-all duration-200
                    hover:bg-[#E7C464]/20 hover:text-[#113B28]
                "
            >
                <LogOut size={18} />
                <span>Logout</span>
            </Link>
        </nav>
    );
}
