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

    const sendResetPassword = async (payload) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
                payload
            );
        } catch (err) {
            setLoading(false);
        }
    };
    const resetPassword = async (payload) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
                { password: payload.password },
                {
                    headers: {
                        'Authorization': `${payload.token}`
                    }
                }
            );
            return res.data;
        } catch (err) {
            setLoading(false);
            return err
        }
    };
    const updateProfile = async (payload) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/users/me`,
                payload,
                { withCredentials: true }
            );
            setUser(res.data.data);
            return res.data.data;
        } catch (err) {
            throw err;
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
        router.push("/pages/login");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, sendResetPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);