import { useAuth } from '@/hooks/userAuth'
import { User } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function UserButtons() {
    const { user, loading } = useAuth()

    if (loading) {
        return
    }
    console.log(user)
    return (
        <>
            {user ? (
                <Link href="/dashboard">
                    <button className="px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium bg-[#004087] text-white transition w-full">
                        Dashboard
                    </button>
                </Link>
            ) : (
                <Link href="/pages/login">
                    <button className="cursor-pointer px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium bg-[#004087] text-white transition w-full">
                        Login
                    </button>
                </Link>
            )}
        </>

    )
}
