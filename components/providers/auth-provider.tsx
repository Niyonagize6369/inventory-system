"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  image?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegisterData) => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<boolean>
  verifyEmail: (token: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>
  isLoading: boolean
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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - replace with actual API call
      const mockUser: User = {
        id: "1",
        username,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: username === "admin" ? "admin" : "user",
        image: "/placeholder.svg?height=40&width=40",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Navigate to appropriate dashboard
      if (mockUser.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/dashboard")
      }

      return true
    } catch (error) {
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: "user",
        image: data.image,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      // Navigate to user dashboard after registration
      router.push("/user/dashboard")

      return true
    } catch (error) {
      return false
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (user) {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
      return true
    } catch (error) {
      return false
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password reset email sent to:", email)
      return true
    } catch (error) {
      return false
    }
  }

  const resetPassword = async (token: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      if (password !== confirmPassword) {
        return false
      }
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password reset successful for token:", token)
      return true
    } catch (error) {
      return false
    }
  }

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Email verified for token:", token)
      return true
    } catch (error) {
      return false
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> => {
    try {
      if (newPassword !== confirmPassword) {
        return false
      }
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password changed successfully")
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateProfile,
        forgotPassword,
        resetPassword,
        verifyEmail,
        changePassword,
        isLoading,
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
