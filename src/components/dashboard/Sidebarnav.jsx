"use client";

import { useAuth } from "@/hooks/userAuth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";


function getActiveItem(items, pathname) {
    const sortedItems = [...items].sort(
        (a, b) => b.href.length - a.href.length
    );

    return sortedItems.find(
        (item) =>
            pathname === item.href ||
            pathname.startsWith(item.href + "/")
    );
}

export default function SidebarNav({ items }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logout successful.");
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Try again.");
        }
    };

     const activeItem = getActiveItem(items, pathname);

    return (
        <nav className="flex flex-col px-4 py-6 space-y-2 w-full">
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem?.href === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`relative group flex items-center gap-3 rounded-xl px-4 py-3 
              text-sm font-medium transition-all
              ${isActive
                                ? "bg-[#004087] text-white shadow-md"
                                : "text-[#113B28]/80 hover:bg-[#004087]/20"
                            }
            `}
                    >
                        {/* Accent Bar */}
                        <span
                            className={`absolute left-0 top-0 h-full w-[4px]
                ${isActive ? "bg-[#E7C464]" : "bg-transparent"}
              `}
                        />

                        {Icon && <Icon size={18} />}
                        <span>{item.title}</span>
                    </Link>
                );
            })}

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl
          border border-[#113B28]/20 hover:bg-[#004087] hover:text-white"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </nav>
    );
}
