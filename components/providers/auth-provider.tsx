"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// These interfaces should match your backend and what you want to use in the frontend
interface User {
  id: string
  username: string
  first_name: string 
  last_name: string
  email: string
  image_url?: string
  role: "user" | "admin"
}

interface RegisterData {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// --- Helper Functions ---
const getApiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}${path}`

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
// ------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const res = await fetch(getApiUrl("/auth/profile"), {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData); // This will now correctly set the user with first_name, last_name
          } else {
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          localStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    };
    verifySession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Login failed." };
      }
      
      localStorage.setItem("authToken", data.token);
      setUser(data.user);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }

      return { success: true, message: "Login successful!" };
    } catch (error) {
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch(getApiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (!res.ok) {
        return { success: false, message: responseData.message || "Registration failed." };
      }

      return { success: true, message: responseData.message };
    } catch (error) {
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    router.push("/auth/login"); // Or your preferred login page
  };
  
  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch(getApiUrl(`/auth/verify/${token}`));
      if (!res.ok) {
        const data = await res.json();
        return { success: false, message: data.message || 'Verification failed.' };
      }
      return { success: true, message: 'Email verified successfully!' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch(getApiUrl("/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await fetch(getApiUrl(`/auth/reset-password/${token}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

   const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) { headers['Authorization'] = `Bearer ${token}`; }

      const res = await fetch(getApiUrl("/auth/change-password"), {
        method: 'PUT',
        headers,
        
        body: JSON.stringify({ 
          previousPassword: currentPassword, 
          newPassword: newPassword,
          confirmNewPassword: confirmPassword, 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password.");
      }
      return { success: true, message: data.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const updateProfile = async (updateData: Partial<User>) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(getApiUrl("/auth/profile"), {
        method: 'PUT',
        headers: headers, 
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      }

      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
      
      return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }
};  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        verifyEmail,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}