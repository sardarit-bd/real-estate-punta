'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                { withCredentials: true }
            );
            setUser(res?.data?.data);
        } catch (err) {
            console.error("Auth check error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (payload) => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                payload,
                { withCredentials: true }
            );
            
            // Update user state
            const userRes = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                { withCredentials: true }
            );
            setUser(userRes?.data?.data);
            
            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const register = async (form) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
                form
            );
            toast.success("Registration successful!");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
            throw err;
        }
    };

    const updateProfile = async (payload) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/users/me`, // CORRECTED URL
                payload,
                { withCredentials: true }
            );

            const updatedUser = res.data.data;
            setUser(updatedUser);
            toast.success("Profile updated successfully!");
            return updatedUser;
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
                null,
                { withCredentials: true }
            );
            setUser(null);
            toast.success("Logged out successfully!");
            router.push("/login");
        } catch (err) {
            console.error("Logout error:", err);
            setUser(null);
            router.push("/login");
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/change-password`,
                { oldPassword, newPassword },
                { withCredentials: true }
            );
            toast.success("Password changed successfully!");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Password change failed");
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout, 
            register, 
            updateProfile,
            changePassword 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);