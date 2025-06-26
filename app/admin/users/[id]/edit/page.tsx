"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Upload, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "admin"
  status: "active" | "disabled"
  image?: string
  createdAt: string
  lastLogin?: string
}

export default function EditUserPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Omit<User, "id" | "createdAt" | "lastLogin">>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    status: "active",
    image: "",
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Mock API call to fetch user - replace with actual API
    const fetchUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock user data - replace with actual API call
        const mockUser: User = {
          id: params.id as string,
          username: "johndoe",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          image: "/placeholder.svg?height=100&width=100",
          createdAt: "2024-01-05",
          lastLogin: "2024-01-19",
        }

        setUser(mockUser)
        setFormData({
          username: mockUser.username,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status,
          image: mockUser.image || "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user. Please try again.",
          variant: "destructive",
        })
        router.push("/admin/users")
      } finally {
        setPageLoading(false)
      }
    }

    fetchUser()
  }, [params.id, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)

    try {
      // Mock image upload - replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a mock URL for the uploaded image
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, image: imageUrl }))

      toast({
        title: "Image uploaded",
        description: "Profile image has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.username || !formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Password validation if changing password
    if (changePassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        })
        return
      }

      if (passwordData.newPassword.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        })
        return
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "User updated",
        description: `User ${formData.firstName} ${formData.lastName} has been successfully updated`,
      })

      router.push("/admin/users")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading user...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">User not found</p>
            <Link href="/admin/users">
              <Button className="mt-4">Back to Users</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl">Edit User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Update the user account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="space-y-4">
                <Label>Profile Image</Label>
                <div className="flex flex-col items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Profile preview"
                      className="h-24 w-24 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={imageLoading} asChild>
                      <span>
                        {imageLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Change Image
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as "user" | "admin" }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value as "active" | "disabled" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="changePassword"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="changePassword">Change Password</Label>
              </div>

              {changePassword && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required={changePassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        required={changePassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {changePassword && (
                    <div className="col-span-full text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Password requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li className={passwordData.newPassword.length >= 6 ? "text-green-600" : ""}>
                          At least 6 characters long
                        </li>
                        <li
                          className={
                            passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword
                              ? "text-green-600"
                              : ""
                          }
                        >
                          Passwords match
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">User Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span>{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Username:</span>
                  <span>@{formData.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="capitalize">{formData.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{formData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Login:</span>
                  <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update User
              </Button>
              <Link href="/admin/users">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
