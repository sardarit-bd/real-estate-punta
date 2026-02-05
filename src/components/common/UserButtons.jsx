"use client";

import { useAuth } from '@/hooks/userAuth';
import { User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const UserButtons = ({ mobile = false, onItemClick }) => {
    const { user, loading } = useAuth();

    const handleClick = () => {
        // Call onItemClick if provided (to close mobile drawer)
        if (onItemClick && typeof onItemClick === 'function') {
            onItemClick();
        }
    };

    if (loading) {
        return (
            <div className={`flex ${mobile ? "flex-col gap-3" : "items-center gap-3"}`}>
                <button className="cursor-pointer px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium bg-gray-300 text-white transition w-full animate-pulse">
                    Loading...
                </button>
            </div>
        );
    }

    console.log(user);

    const buttonClass = mobile 
        ? "cursor-pointer px-6 py-3 border border-[#1F3A34] rounded-full text-base font-medium bg-[#004087] text-white transition w-full hover:bg-[#003366]"
        : "cursor-pointer px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium bg-[#004087] text-white transition hover:bg-[#003366]";

    return (
        <div className={`flex ${mobile ? "flex-col gap-3" : "items-center gap-3"}`}>
            {user ? (
                <>
                    {/* Show user info in mobile drawer */}
                    {mobile && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-[#004087] text-white rounded-full flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{user.name || user.email}</p>
                                <p className="text-sm text-gray-500">Logged In</p>
                            </div>
                        </div>
                    )}
                    
                    <Link 
                        href="/dashboard" 
                        onClick={handleClick}
                        className={mobile ? "w-full" : ""}
                    >
                        <button className={buttonClass}>
                            Dashboard
                        </button>
                    </Link>
                    
                    {/* Logout button for mobile */}
                    {mobile && (
                        <button 
                            onClick={() => {
                                // Add your logout logic here
                                console.log("Logout clicked");
                                handleClick();
                            }}
                            className="cursor-pointer px-6 py-3 border border-red-600 rounded-full text-base font-medium bg-white text-red-600 transition w-full hover:bg-red-50"
                        >
                            Logout
                        </button>
                    )}
                </>
            ) : (
                <>
                    <Link 
                        href="/pages/login" 
                        onClick={handleClick}
                        className={mobile ? "w-full" : ""}
                    >
                        <button className={buttonClass}>
                            Login
                        </button>
                    </Link>
                    
                    {/* Sign Up button for mobile */}
                    {mobile && (
                        <Link 
                            href="/pages/register" 
                            onClick={handleClick}
                            className="w-full"
                        >
                            <button className="cursor-pointer px-6 py-3 border border-[#1F3A34] rounded-full text-base font-medium bg-white text-[#004087] transition w-full hover:bg-gray-50">
                                Sign Up
                            </button>
                        </Link>
                    )}
                </>
            )}
        </div>
    );
};

export default UserButtons;