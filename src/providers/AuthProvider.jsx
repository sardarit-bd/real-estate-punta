'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

const AuthContext = createContext();

// Custom axios instance with better error handling
const authAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
});

// Request interceptor to handle Google Translate issues
authAxios.interceptors.request.use(
    (config) => {
        // Check if we're on client side
        if (typeof window !== 'undefined') {
            const cookies = parseCookies();
            const isTranslated = cookies.googtrans && cookies.googtrans !== '/auto/en';
            
            // Add headers for translated pages
            if (isTranslated) {
                config.headers['X-Translation-Active'] = 'true';
                // Extract language from googtrans cookie (format: /auto/en or /auto/bn)
                const lang = cookies.googtrans.split('/').pop() || 'en';
                config.headers['Accept-Language'] = lang;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 500 errors
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 500 errors (often caused by Google Translate)
        if (error.response?.status === 500) {
            // Check if it's a translation issue
            if (typeof window !== 'undefined') {
                const cookies = parseCookies();
                const isTranslated = cookies.googtrans && cookies.googtrans !== '/auto/en';
                
                if (isTranslated && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    // Remove translation headers for retry
                    delete originalRequest.headers['X-Translation-Active'];
                    delete originalRequest.headers['Accept-Language'];
                    
                    try {
                        return await authAxios(originalRequest);
                    } catch (retryError) {
                        // If retry fails, clear translation and reload
                        console.warn('Translation causing 500 error, clearing translation...');
                        
                        // Clear googtrans cookie
                        document.cookie = 'googtrans=/auto/en; path=/; max-age=0';
                        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        
                        // Force page reload without translation
                        setTimeout(() => {
                            window.location.href = window.location.pathname;
                        }, 100);
                    }
                }
            }
        }
        
        // Handle 401 unauthorized
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Clear user state
                const authContext = window.__auth_context__;
                if (authContext?.setUser) {
                    authContext.setUser(null);
                }
                
                // Don't redirect from auth pages
                const currentPath = window.location.pathname;
                const authPages = ['/pages/login', '/pages/register', '/pages/forgot-password', '/pages/reset-password'];
                
                if (!authPages.includes(currentPath) && !currentPath.startsWith('/pages/reset-password/')) {
                    // Store current URL for redirect after login
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                    window.location.href = '/pages/login';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Expose context to window for interceptor access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__auth_context__ = { setUser };
        }
        
        return () => {
            if (typeof window !== 'undefined') {
                delete window.__auth_context__;
            }
        };
    }, []);

    useEffect(() => {
        checkAuth();
        
        // Listen for route changes
        const handleRouteChange = () => {
            checkAuth();
        };
        
        window.addEventListener('popstate', handleRouteChange);
        
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [pathname]);

    const checkAuth = async () => {
        try {
            setLoading(true);
            
            // Clear any cached auth errors
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('auth_error_500');
            }
            
            const res = await authAxios.get('/api/auth/me');
            
            if (res.data.success) {
                setUser(res.data.data);
                
                // Check if user needs to verify email
                if (res.data.data.role === 'tenant' && !res.data.data.emailVerified && 
                    !pathname.includes('/verify-email')) {
                    router.push('/pages/verify-email');
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log('Auth check failed:', error.message);
            setUser(null);
            
            // Store error info for debugging
            if (typeof window !== 'undefined' && error.response?.status === 500) {
                sessionStorage.setItem('auth_error_500', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    path: pathname,
                    message: error.message
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (payload) => {
        try {
            setLoading(true);
            
            // First login
            await authAxios.post('/api/auth/login', payload);
            
            // Then get user info
            const { data } = await authAxios.get('/api/auth/me');
            
            if (data.success) {
                setUser(data.data);
                
                // Check redirect URL
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
                sessionStorage.removeItem('redirectAfterLogin');
                
                // Check if email verification is needed
                if (data.data.role === 'tenant' && !data.data.emailVerified) {
                    router.push('/pages/verify-email');
                } else {
                    router.push(redirectUrl);
                }
                
                toast.success('Login successful!');
            }
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || "Invalid credentials";
            
            // Check if it's a translation issue
            if (err.response?.status === 500) {
                const cookies = parseCookies();
                if (cookies.googtrans && cookies.googtrans !== '/auto/en') {
                    toast.error('Please disable translation and try again');
                } else {
                    toast.error('Server error. Please try again.');
                }
            } else {
                toast.error(errorMessage);
            }
            
            throw err;
        }
    };

    const sendResetPassword = async (payload) => {
        try {
            await authAxios.post('/api/auth/forgot-password', payload);
            toast.success('Reset password email sent!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to send reset email";
            toast.error(errorMessage);
            throw err;
        }
    };

    const resetPassword = async (payload) => {
        try {
            const res = await authAxios.post(
                '/api/auth/reset-password',
                { password: payload.password },
                {
                    headers: {
                        'Authorization': `${payload.token}`
                    }
                }
            );
            toast.success('Password reset successful!');
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to reset password";
            toast.error(errorMessage);
            throw err;
        }
    };

    const updateProfile = async (payload) => {
        try {
            const res = await authAxios.patch('/api/users/update-profile', payload);
            setUser(res.data.data);
            toast.success('Profile updated successfully!');
            return res.data.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update profile";
            toast.error(errorMessage);
            throw err;
        }
    };

    const getProfile = async () => {
        try {
            const res = await authAxios.get('/api/users/profile');
            return res.data.data;
        } catch (err) {
            throw err;
        }
    };

    const register = async (form) => {
        try {
            const res = await authAxios.post('/api/auth/register', form);
            toast.success('Registration successful! Please check your email for verification.');
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed";
            toast.error(errorMessage);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authAxios.post('/api/auth/logout', null);
            
            // Clear any translation cookies that might cause issues
            if (typeof window !== 'undefined') {
                document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
            
            setUser(null);
            toast.success('Logged out successfully');
            
            // Redirect to home or login page
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
            
        } catch (err) {
            console.error('Logout error:', err);
            // Still clear user and redirect even if logout API fails
            setUser(null);
            window.location.href = '/';
        }
    };

    // Function to refresh user data
    const refreshUser = async () => {
        try {
            const { data } = await authAxios.get('/api/auth/me');
            if (data.success) {
                setUser(data.data);
            }
        } catch (error) {
            console.log('Failed to refresh user:', error.message);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        updateProfile,
        sendResetPassword,
        resetPassword,
        getProfile,
        refreshUser,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};