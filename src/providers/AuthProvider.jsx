'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";;
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                    { withCredentials: true }
                );
                setUser(res?.data?.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (payload) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                payload,
                { withCredentials: true }
            );
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                { withCredentials: true }
            );
            setUser(data?.data);
            router.push("/dashboard");
        } catch (err) {
            setLoading(false);
            toast.error(err.response?.data?.message || "Invalid credentials");
        }
    };



    const register = async (form) => {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
            form
        );
    };

    const logout = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, null, { withCredentials: true })
        setUser(null);
        router.push("/pages/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);