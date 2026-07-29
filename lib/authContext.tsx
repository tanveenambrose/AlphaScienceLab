"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: "admin" | "media" | "member";
    avatarUrl?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    login: (email: string, password: string, loginType: "admin" | "member") => Promise<{ success: boolean; role?: string; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: { name?: string; avatarUrl?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => ({ success: false }),
    logout: async () => {},
    updateProfile: async () => ({ success: false }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Load initial session from localStorage
        const stored = typeof window !== "undefined" ? localStorage.getItem("asl_user_session") : null;
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("asl_user_session");
            }
        }

        // Verify with backend
        fetch("/api/auth/me")
            .then((res) => {
                if (res.ok) return res.json();
                return null;
            })
            .then((data) => {
                if (data?.user) {
                    setUser(data.user);
                    if (typeof window !== "undefined") {
                        localStorage.setItem("asl_user_session", JSON.stringify(data.user));
                    }
                }
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string, loginType: "admin" | "member") => {
        try {
            const endpoint = loginType === "admin" ? "/api/admin/login" : "/api/auth/login";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, loginType }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error || "Login failed" };
            }

            const userData: UserProfile = data.user || {
                id: data.id || "usr_1",
                name: data.name || email.split("@")[0].replace(".", " "),
                email: email,
                role: data.role || (loginType === "admin" ? "admin" : "member"),
                avatarUrl: data.avatarUrl || "",
            };

            setUser(userData);
            if (typeof window !== "undefined") {
                localStorage.setItem("asl_user_session", JSON.stringify(userData));
            }

            return { success: true, role: userData.role };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : "Something went wrong" };
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
            if (typeof window !== "undefined") {
                localStorage.removeItem("asl_user_session");
            }
        }
    };

    const updateProfile = async (data: { name?: string; avatarUrl?: string; currentPassword?: string; newPassword?: string }) => {
        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                return { success: false, error: result.error || "Failed to update profile" };
            }

            if (user) {
                const updatedUser: UserProfile = {
                    ...user,
                    name: data.name ?? user.name,
                    avatarUrl: data.avatarUrl ?? user.avatarUrl,
                };
                setUser(updatedUser);
                if (typeof window !== "undefined") {
                    localStorage.setItem("asl_user_session", JSON.stringify(updatedUser));
                }
            }

            return { success: true };
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : "Failed to update profile" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
